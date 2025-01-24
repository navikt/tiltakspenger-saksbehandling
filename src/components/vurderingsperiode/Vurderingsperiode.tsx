import { Loader, Heading, VStack, Button, HStack } from '@navikt/ds-react';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { useContext, useState } from 'react';
import styles from './Vurderingsperiode.module.css';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import Varsel from '../varsel/Varsel';
import Datovelger from '../revurderingsmodal/Datovelger';
import { useOppdaterVurderingsperiode } from '../../hooks/useOppdaterVurderingsperiode';
import { dateTilISOTekst } from '../../utils/date';
import { Controller, useForm } from 'react-hook-form';
import { setupValidation } from '../../utils/validation';

export interface VurderingsperiodeForm {
  fraOgMed: Date;
  tilOgMed: Date;
}

const Vurderingsperiode = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { valgtBehandling, isLoading, error } = useHentBehandling(behandlingId);
  const [låst, settLåst] = useState<boolean>(true);
  const { oppdaterVurderingsperiode, oppdaterVurderingsperiodeError, reset } =
    useOppdaterVurderingsperiode(behandlingId);

  const fraOgMed = new Date(valgtBehandling.vurderingsperiode.fraOgMed);
  const tilOgMed = new Date(valgtBehandling.vurderingsperiode.tilOgMed);

  const onSubmit = () => {
    oppdaterVurderingsperiode({
      periode: {
        fraOgMed: dateTilISOTekst(getValues().fraOgMed),
        tilOgMed: dateTilISOTekst(getValues().tilOgMed),
      },
    }).then(() => {
      settLåst(true);
      reset();
    });
  };

  const { getValues, control, handleSubmit } = useForm<VurderingsperiodeForm>({
    defaultValues: {
      fraOgMed: fraOgMed,
      tilOgMed: tilOgMed,
    },
  });

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  } else if (error)
    return (
      <Varsel
        variant="error"
        melding={`Kunne ikke hente vurderingsperiode (${error.status} ${error.info})`}
      />
    );

  return (
    <VStack gap="6" className={styles.wrapper}>
      <Heading size="medium">Vurderingsperiode</Heading>
      {oppdaterVurderingsperiodeError && (
        <Varsel
          variant="error"
          melding={oppdaterVurderingsperiodeError.message}
        />
      )}
      <VStack gap="4" className={styles.vurdering}>
        <HStack gap="4">
          <Controller
            name="fraOgMed"
            control={control}
            rules={{
              validate: setupValidation([]),
            }}
            render={({ field: { onChange, value } }) => (
              <Datovelger
                onDateChange={onChange}
                readOnly={låst}
                label="Fra og med"
                minDate={fraOgMed}
                maxDate={tilOgMed}
                defaultSelected={value}
              />
            )}
          />
          <Controller
            name="tilOgMed"
            control={control}
            rules={{
              validate: setupValidation([]),
            }}
            render={({ field: { onChange, value } }) => (
              <Datovelger
                onDateChange={onChange}
                readOnly={låst}
                minDate={fraOgMed}
                maxDate={tilOgMed}
                label="Til og med"
                defaultSelected={value}
              />
            )}
          />
        </HStack>
        <HStack gap="4">
          <Button
            variant="secondary"
            size="small"
            onClick={() => settLåst(!låst)}
          >
            {låst ? 'Endre vurderingsperiode' : 'Avbryt'}
          </Button>
          {!låst && (
            <Button type="submit" size="small" onClick={handleSubmit(onSubmit)}>
              Lagre ny vurderingsperiode
            </Button>
          )}
        </HStack>
      </VStack>
    </VStack>
  );
};

export default Vurderingsperiode;
