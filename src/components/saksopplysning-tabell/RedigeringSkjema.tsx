import {
  RadioGroup,
  Radio,
  Select,
  Button,
  VStack,
  HStack,
} from '@navikt/ds-react';
import { useSWRConfig } from 'swr';
import { Controller, FormProvider, get, useForm } from 'react-hook-form';
import { useState } from 'react';
import { dateTilFormatertTekst, dateTilISOTekst } from '../../utils/date';
import {
  gyldigPeriodeValidator,
  påkrevdPeriodeValidator,
  setupValidation,
} from '../../utils/validation';
import { Periode } from '../../types/Periode';
import Periodevelger from './PeriodeVelger';

interface RedigeringSkjemaProps {
  saksopplysning: string;
  saksopplysningTittel: string;
  håndterLukkRedigering: () => void;
  behandlingId: string;
  vurderingsperiode: Periode;
}

interface SkjemaFelter {
  periode: {
    fra: Date;
    til: Date;
  };
  harYtelse: string;
  begrunnelse: string;
}

export const RedigeringSkjema = ({
  håndterLukkRedigering,
  saksopplysning,
  saksopplysningTittel,
  behandlingId,
  vurderingsperiode,
}: RedigeringSkjemaProps) => {
  const [harYtelse, settHarYtelse] = useState<boolean>(false);

  const formMethods = useForm<SkjemaFelter>({
    mode: 'onSubmit',
    defaultValues: {
      periode: {
        fra: new Date(vurderingsperiode.fra),
        til: new Date(vurderingsperiode.til),
      },
    },
  });

  const håndterHarYtelse = (
    harYtelseSvar: boolean,
    onChange: (value: boolean) => void,
  ) => {
    onChange(harYtelseSvar);
    settHarYtelse(harYtelseSvar);
  };

  const mutator = useSWRConfig().mutate;

  const håndterLagreSaksopplysning = () => {
    håndterLukkRedigering();
    const skjemaFelter = formMethods.getValues();
    fetch(`/api/behandling/${behandlingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fra: harYtelse
          ? dateTilISOTekst(skjemaFelter.periode?.fra)
          : vurderingsperiode.fra,
        til: harYtelse
          ? dateTilISOTekst(skjemaFelter.periode?.til)
          : vurderingsperiode.til,
        vilkår: saksopplysning, //TODO endre navnet på denne i backend
        begrunnelse: skjemaFelter.begrunnelse,
        harYtelse: skjemaFelter.harYtelse,
      }),
    }).then(() => {
      mutator(`/api/behandling/${behandlingId}`);
    });
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(håndterLagreSaksopplysning)}
        style={{
          background: '#E6F0FF',
          padding: '1rem',
        }}
      >
        <VStack gap="5">
          <Controller
            name={'harYtelse'}
            control={formMethods.control}
            render={({ field: { onChange } }) => {
              return (
                <RadioGroup
                  legend="Legg til ny saksopplysning"
                  onChange={(value) => håndterHarYtelse(value, onChange)}
                  defaultValue={false}
                >
                  <Radio
                    value={false}
                  >{`Søker mottar ikke ${saksopplysningTittel} i perioden ${dateTilFormatertTekst(
                    vurderingsperiode.fra,
                  )} til ${dateTilFormatertTekst(vurderingsperiode.til)}`}</Radio>
                  <Radio
                    value={true}
                  >{`Søker mottar ${saksopplysningTittel} i hele eller deler av perioden`}</Radio>
                </RadioGroup>
              );
            }}
          />
          <Controller
            name="periode"
            control={formMethods.control}
            rules={{
              validate: setupValidation([
                gyldigPeriodeValidator,
                påkrevdPeriodeValidator,
              ]),
            }}
            render={({ field: { onChange } }) => {
              return (
                <Periodevelger
                  id={'periode'}
                  onFromChange={(date) => {
                    onChange({
                      fom: date || '',
                      tom: formMethods.getValues(),
                    });
                  }}
                  onToChange={(date) => {
                    onChange({
                      fom: formMethods.getValues(),
                      tom: date || '',
                    });
                  }}
                  defaultSelected={{
                    fom: vurderingsperiode.fra,
                    tom: vurderingsperiode.til,
                  }}
                  errorMessage={
                    get(formMethods.formState.errors, 'periode')?.message
                  }
                  minDate={vurderingsperiode.fra}
                  maxDate={vurderingsperiode.til}
                  disabled={!harYtelse}
                  size="small"
                />
              );
            }}
          />
          <Controller
            name={'begrunnelse'}
            control={formMethods.control}
            rules={{ required: true }}
            render={({ field: { onChange }, formState: { errors } }) => {
              return (
                <Select
                  label="Begrunnelse for endring"
                  style={{ width: '415px' }}
                  onChange={(e) => onChange(e.target.value)}
                  error={errors.begrunnelse && 'Begrunnelse mangler'}
                >
                  <option value="">Velg grunn</option>
                  <option value="Feil i innhentet data">
                    Feil i innhentet data
                  </option>
                  <option value="Endring etter søknadstidspunkt">
                    Endring etter søknadstidspunkt
                  </option>
                </Select>
              );
            }}
          />
          <HStack>
            <Button
              type="button"
              onClick={() => håndterLukkRedigering()}
              variant="tertiary"
              style={{ marginRight: '2rem' }}
            >
              Avbryt
            </Button>
            <Button type="submit">Lagre endring</Button>
          </HStack>
        </VStack>
      </form>
    </FormProvider>
  );
};
