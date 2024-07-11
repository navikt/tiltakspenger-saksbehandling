import {
  RadioGroup,
  Radio,
  Select,
  Button,
  VStack,
  HStack,
} from '@navikt/ds-react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  gyldigPeriodeValidator,
  påkrevdPeriodeValidator,
  setupValidation,
} from '../../utils/validation';
import { Periode } from '../../types/Periode';
import Periodevelger from '../saksopplysning-tabell/PeriodeVelger';
import { periodeTilFormatertDatotekst } from '../../utils/date';

interface OppdaterSaksopplysningFormProps {
  håndterLagreSaksopplysning: (data: SkjemaFelter) => void;
  håndterLukkRedigering: () => void;
  saksopplysningTittel: string;
  vurderingsperiode: Periode;
}

export interface SkjemaFelter {
  periode: { fra: Date; til: Date };
  valgtVerdi: boolean;
  begrunnelse: string;
}

export const OppdaterSaksopplysningFormSkjema = ({
  håndterLagreSaksopplysning,
  håndterLukkRedigering,
  saksopplysningTittel,
  vurderingsperiode,
}: OppdaterSaksopplysningFormProps) => {
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
      valgtVerdi: false,
    },
  });
  const watchHarYtelse = watch('valgtVerdi');

  const onSubmit: SubmitHandler<SkjemaFelter> = (data) => {
    håndterLagreSaksopplysning(data);
    håndterLukkRedigering();
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
              disabled={!watchHarYtelse}
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
              <option value="FEIL_I_INNHENTET_DATA">
                Feil i innhentet data
              </option>
              <option value="ENDRING_ETTER_SØKNADSTIDSPUNKT">
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
