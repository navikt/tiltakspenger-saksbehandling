import {
  RadioGroup,
  Radio,
  Select,
  Button,
  VStack,
  HStack,
} from '@navikt/ds-react';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import PeriodeSkjema from './PeriodeSkjema';
import dayjs from 'dayjs';
import { useState } from 'react';
import { formatDate } from '../../utils/date';

interface RedigeringSkjemaProps {
  vilkår: string;
  vilkårFlateTittel: string;
  håndterLukkRedigering: () => void;
  behandlingId: string;
  behandlingsperiode: {
    fom: string;
    tom: string;
  };
  vilkårsperiode: {
    fom: string;
    tom: string;
  };
}

interface SkjemaFelter {
  periode: {
    fom: Date;
    tom: Date;
  };
  harYtelse: string;
  begrunnelse: string;
}

function påkrevdPeriodeValidator(periode: { fom: Date; tom: Date }) {
  if (!periode?.fom || !periode?.tom) {
    return 'Fra og til må fylles ut';
  }
}

function gyldigPeriodeValidator(periode: { fom: Date; tom: Date }) {
  const fraDato = dayjs(periode?.fom);
  const tilDato = dayjs(periode?.tom);

  if (fraDato.isAfter(tilDato)) {
    return 'Fra-dato kan ikke være etter til-dato';
  }
}

export const RedigeringSkjema = ({
  håndterLukkRedigering,
  vilkår,
  vilkårFlateTittel,
  vilkårsperiode,
  behandlingId,
  behandlingsperiode,
}: RedigeringSkjemaProps) => {
  const [harYtelse, settHarYtelse] = useState<boolean>(false);

  const formMethods = useForm<SkjemaFelter>({
    mode: 'onSubmit',
    defaultValues: {
      periode: {
        fom: new Date(vilkårsperiode.fom),
        tom: new Date(vilkårsperiode.tom),
      },
    },
  });

  const håndterHarYtelse = (
    harYtelseSvar: boolean,
    onChange: (value: boolean) => void
  ) => {
    onChange(harYtelseSvar);
    settHarYtelse(harYtelseSvar);
  };

  const mutator = useSWRConfig().mutate;

  const håndterLagreSaksopplysning = () => {
    håndterLukkRedigering();
    const skjemaFelter = formMethods.getValues();
    const res = fetch(`/api/behandling/${behandlingId}`, {
      method: 'POST',
      body: JSON.stringify({
        fom: harYtelse
          ? skjemaFelter.periode?.fom.toISOString().split('T')[0]
          : behandlingsperiode.fom,
        tom: harYtelse
          ? skjemaFelter.periode?.tom.toISOString().split('T')[0]
          : behandlingsperiode.tom,
        vilkår: vilkår,
        begrunnelse: skjemaFelter.begrunnelse,
        harYtelse: skjemaFelter.harYtelse,
      }),
    }).then(() => {
      mutator(`/api/behandling/${behandlingId}`).then(() => {
        toast('Saksopplysning endret');
      });
    });
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(håndterLagreSaksopplysning)}
        style={{
          background: '#F2F3F5',
          width: '100%',
          height: '100%',
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
                  legend="Endre vilkår"
                  onChange={(value) => håndterHarYtelse(value, onChange)}
                  defaultValue={false}
                >
                  <Radio
                    value={false}
                  >{`Mottar ikke ${vilkårFlateTittel.toLowerCase()} i perioden ${formatDate(
                    behandlingsperiode.fom
                  )} til ${formatDate(behandlingsperiode.tom)}`}</Radio>
                  <Radio
                    value={true}
                  >{`Mottar ${vilkårFlateTittel.toLowerCase()}`}</Radio>
                </RadioGroup>
              );
            }}
          />
          <PeriodeSkjema
            name="periode"
            validate={[gyldigPeriodeValidator, påkrevdPeriodeValidator]}
            minDate={new Date(behandlingsperiode.fom)}
            maxDate={new Date(behandlingsperiode.tom)}
            defaultFra={new Date(vilkårsperiode.fom)}
            defaultTil={new Date(vilkårsperiode.tom)}
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
