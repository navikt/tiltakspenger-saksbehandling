import {
  RadioGroup,
  Radio,
  Select,
  Button,
  VStack,
  HStack,
} from '@navikt/ds-react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';
import { dateTilFormatertTekst } from '../../utils/date';
import {
  gyldigPeriodeValidator,
  påkrevdPeriodeValidator,
} from '../../utils/validation';
import { Periode } from '../../types/Periode';
import Periodefelt from '../saksopplysning-tabell/Periodefelt';

interface OppdaterSaksopplysningFormProps {
  håndterLukkRedigering: () => void;
  håndterLagreSaksopplysning: (data: SkjemaFelter) => void;
  saksopplysningTittel: string;
  vurderingsperiode: Periode;
}

export interface SkjemaFelter {
  periode: {
    fra: Date;
    til: Date;
  };
  valgtVerdi: boolean;
  begrunnelse: string;
}

export const OppdaterSaksopplysningFormSkjema = ({
  håndterLukkRedigering,
  håndterLagreSaksopplysning,
  saksopplysningTittel,
  vurderingsperiode,
}: OppdaterSaksopplysningFormProps) => {
  const [valgtVerdi, settvalgtVerdi] = useState<boolean>(false);

  const formMethods = useForm<SkjemaFelter>({
    mode: 'onSubmit',
    defaultValues: {
      periode: {
        fra: new Date(vurderingsperiode.fra),
        til: new Date(vurderingsperiode.til),
      },
    },
  });

  const onLagreSaksopplysning = (data: SkjemaFelter) => {
    håndterLagreSaksopplysning(data);
    håndterLukkRedigering();
  };

  const håndtervalgtVerdi = (
    valgtVerdiSvar: boolean,
    onChange: (value: boolean) => void,
  ) => {
    onChange(valgtVerdiSvar);
    settvalgtVerdi(valgtVerdiSvar);
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onLagreSaksopplysning)}
        style={{
          background: '#E6F0FF',
          padding: '1rem',
        }}
      >
        <VStack gap="5">
          <Controller
            name={'valgtVerdi'}
            control={formMethods.control}
            render={({ field: { onChange } }) => {
              return (
                <RadioGroup
                  legend="Legg til ny saksopplysning"
                  onChange={(value) => håndtervalgtVerdi(value, onChange)}
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
            disabledFra={!valgtVerdi}
            disabledTil={!valgtVerdi}
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
                  <option value="FEIL_I_INNHENTET_DATA">
                    Feil i innhentet data
                  </option>
                  <option value="ENDRING_ETTER_SOKNADSTIDSPUNKT">
                    Endring etter søknadstidspunkt
                  </option>
                </Select>
              );
            }}
          />
          <HStack gap="4">
            <Button
              type="button"
              onClick={() => håndterLukkRedigering()}
              variant="tertiary"
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
