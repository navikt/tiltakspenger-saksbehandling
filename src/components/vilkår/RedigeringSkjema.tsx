import {
  RadioGroup,
  Radio,
  Select,
  Button,
  VStack,
  HStack,
} from '@navikt/ds-react';
import { useSWRConfig } from 'swr';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  dateTilISOTekst,
  periodeTilFormatertDatotekst,
} from '../../utils/date';
import {
  gyldigPeriodeValidator,
  påkrevdPeriodeValidator,
  setupValidation,
} from '../../utils/validation';
import { Periode } from '../../types/Periode';
import Periodevelger from '../vilkår/PeriodeVelger';

interface RedigeringSkjemaProps {
  håndterLukkRedigering: () => void;
  saksopplysning: string;
  saksopplysningTittel: string;
  behandlingId: string;
  vurderingsperiode: Periode;
}

interface SkjemaFelter {
  periode: { fra: Date; til: Date };
  valgtVerdi: boolean;
  begrunnelse: string;
}

export const RedigeringSkjema = ({
  håndterLukkRedigering,
  saksopplysning,
  saksopplysningTittel,
  behandlingId,
  vurderingsperiode,
}: RedigeringSkjemaProps) => {
  const mutator = useSWRConfig().mutate;

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    resetField,
  } = useForm<SkjemaFelter>({
    mode: 'onSubmit',
    defaultValues: {
      periode: {
        fra: new Date(vurderingsperiode.fra),
        til: new Date(vurderingsperiode.til),
      },
    },
  });

  const watchvalgtVerdi = watch('valgtVerdi');

  const onSubmit: SubmitHandler<SkjemaFelter> = (data) => {
    håndterLukkRedigering();
    const valgtFra = dateTilISOTekst(data.periode.fra);
    const valgtTil = dateTilISOTekst(data.periode.til);

    fetch(`/api/behandling/${behandlingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fra: watchvalgtVerdi ? valgtFra : vurderingsperiode.fra,
        til: watchvalgtVerdi ? valgtTil : vurderingsperiode.til,
        vilkår: saksopplysning,
        begrunnelse: data.begrunnelse,
        valgtVerdi: data.valgtVerdi,
      }),
    }).then(() => {
      mutator(`/api/behandling/${behandlingId}`);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        background: '#E6F0FF',
        padding: '1rem',
      }}
    >
      <VStack gap="5" align="start">
        <Controller
          name={'valgtVerdi'}
          control={control}
          render={({ field: { onChange } }) => {
            return (
              <RadioGroup
                legend="Legg til ny saksopplysning"
                onChange={(value) => {
                  if (!value) resetField('periode');
                  onChange(value);
                }}
                defaultValue={false}
              >
                <Radio
                  value={false}
                >{`Søker mottar ikke ${saksopplysningTittel} i perioden ${periodeTilFormatertDatotekst(vurderingsperiode)}`}</Radio>
                <Radio
                  value={true}
                >{`Søker mottar ${saksopplysningTittel} i hele eller deler av perioden`}</Radio>
              </RadioGroup>
            );
          }}
        />
        <Controller
          name="periode"
          control={control}
          rules={{
            validate: setupValidation([
              gyldigPeriodeValidator,
              påkrevdPeriodeValidator,
            ]),
          }}
          render={({ field: { onChange, value } }) => (
            <Periodevelger
              onFraChange={(dato: Date) => {
                onChange({
                  fra: dato,
                  til: value.til,
                });
              }}
              onTilChange={(dato: Date) => {
                onChange({
                  fra: value.fra,
                  til: dato,
                });
              }}
              minDato={vurderingsperiode.fra}
              maxDato={vurderingsperiode.til}
              valgtFraDato={value.fra}
              valgtTilDato={value.til}
              disabled={!watchvalgtVerdi}
              error={errors.periode?.message ?? ''}
            />
          )}
        />
        <Controller
          name={'begrunnelse'}
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange } }) => (
            <Select
              label="Begrunnelse for endring"
              onChange={onChange}
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
          )}
        />
        <HStack gap="4">
          <Button
            type="button"
            onClick={() => håndterLukkRedigering()}
            variant="tertiary"
          >
            Avbryt
          </Button>
          <Button type="submit" value="submit">
            Lagre endring
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};
