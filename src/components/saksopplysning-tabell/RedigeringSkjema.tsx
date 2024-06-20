import {
  RadioGroup,
  Radio,
  Select,
  Button,
  VStack,
  HStack,
} from '@navikt/ds-react';
import { useSWRConfig } from 'swr';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import Periodefelt from './Periodefelt';
import { useState } from 'react';
import { dateTilFormatertTekst, dateTilISOTekst } from '../../utils/date';
import {
  gyldigPeriodeValidator,
  påkrevdPeriodeValidator,
} from '../../utils/validation';
import { Periode } from '../../types/Periode';

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
          <Periodefelt
            name="periode"
            validate={[gyldigPeriodeValidator, påkrevdPeriodeValidator]}
            minDate={new Date(vurderingsperiode.fra)}
            maxDate={new Date(vurderingsperiode.til)}
            defaultFra={new Date(vurderingsperiode.fra)}
            defaultTil={new Date(vurderingsperiode.til)}
            disabledFra={!harYtelse}
            disabledTil={!harYtelse}
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
