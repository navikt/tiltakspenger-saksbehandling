import {
  Loader,
  Heading,
  VStack,
  Button,
  HStack,
  BodyLong,
} from '@navikt/ds-react';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { useContext, useRef } from 'react';
import styles from './Vurderingsperiode.module.css';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import Varsel from '../varsel/Varsel';
import Datovelger from '../revurderingsmodal/Datovelger';
import Endringsmodal from '../endringsmodal/Endringsmodal';
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
  const { oppdaterVurderingsperiode } =
    useOppdaterVurderingsperiode(behandlingId);
  const modalRef = useRef(null);

  const onSubmit = () => {
    oppdaterVurderingsperiode({
      periode: {
        fraOgMed: dateTilISOTekst(getValues().fraOgMed),
        tilOgMed: dateTilISOTekst(getValues().tilOgMed),
      },
    });
  };

  const {
    getValues,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<VurderingsperiodeForm>({
    defaultValues: {
      fraOgMed: new Date(valgtBehandling.vurderingsperiode.fraOgMed),
      tilOgMed: new Date(valgtBehandling.vurderingsperiode.tilOgMed),
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
      <VStack gap="4" className={styles.vurdering}>
        <HStack gap="4">
          <Datovelger
            label="Fra og med"
            readOnly
            defaultSelected={
              new Date(valgtBehandling.vurderingsperiode.fraOgMed)
            }
          />
          <Datovelger
            label="Til og med"
            readOnly
            defaultSelected={
              new Date(valgtBehandling.vurderingsperiode.tilOgMed)
            }
          />
        </HStack>
        <HStack>
          <Button
            type="submit"
            size="small"
            onClick={() => modalRef.current.showModal()}
          >
            Endre vurderingsperiode
          </Button>
        </HStack>
      </VStack>
      <Endringsmodal
        modalRef={modalRef}
        tittel="Endre vurderingsperiode"
        håndterLagring={handleSubmit(onSubmit)}
      >
        <VStack gap="4">
          <BodyLong>
            Legg til ny fra- og til-dato for vurderingsperioden. Endringen vil
            føre til at vurderingsperioden for vilkårsvurderingen vil endres
            tilsvarende.
          </BodyLong>
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
                  label="Fra og med"
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
                  label="Til og med"
                  defaultSelected={value}
                />
              )}
            />
          </HStack>
        </VStack>
      </Endringsmodal>
    </VStack>
  );
};

export default Vurderingsperiode;
