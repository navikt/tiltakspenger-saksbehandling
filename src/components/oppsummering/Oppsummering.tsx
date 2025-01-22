import { Loader, Heading, VStack, Button, BodyLong } from '@navikt/ds-react';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { useContext, useRef } from 'react';
import styles from './Oppsummering.module.css';
import VilkårsvurderingTable from './VilkårsvurderingTable';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import Varsel from '../varsel/Varsel';
import { Behandlingsknapper } from '../behandlingsknapper/BehandlingKnapper';
import BekreftelsesModal from '../bekreftelsesmodal/BekreftelsesModal';
import { useGodkjennBehandling } from '../../hooks/useGodkjennBehandling';

const Oppsummering = () => {
  const { behandlingId, sakId } = useContext(BehandlingContext);
  const { valgtBehandling, isLoading, error } = useHentBehandling(behandlingId);
  const {
    godkjennBehandling,
    godkjennerBehandling,
    godkjennBehandlingError,
    reset,
  } = useGodkjennBehandling(behandlingId, sakId);
  const godkjennRef = useRef(null);
  const begrunnelseRef = useRef(null);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  } else if (error)
    return (
      <Varsel
        variant="error"
        melding={`Kunne ikke hente oppsummering (${error.status} ${error.info})`}
      />
    );

  const onGodkjennBehandling = () => {
    godkjennBehandling().then(lukkModal);
  };

  const lukkModal = () => {
    godkjennRef.current.close();
    reset();
  };

  return (
    <VStack gap="6" className={styles.wrapper}>
      <Heading size="medium">Oppsummering</Heading>
      <VStack gap="4" className={styles.vurdering}>
        <Heading size="small">Vilkårsvurdering</Heading>
        <VilkårsvurderingTable />
      </VStack>
      <VStack className={styles.vurdering}>
        <Heading size="small">Begrunnelse</Heading>
        <BodyLong>
          {valgtBehandling.tilleggstekstBrev
            ? valgtBehandling.tilleggstekstBrev.tekst
            : 'Det er ikke lagt ved tilleggsbegrunnelse for flytting av perioden'}
        </BodyLong>
        <Button onClick={() => console.log()}>Legg til begrunnelse</Button>
      </VStack>
      <Behandlingsknapper godkjennRef={godkjennRef} />
      <BekreftelsesModal
        modalRef={godkjennRef}
        tittel={'Godkjenn og fatt vedtak'}
        body={'Ønsker du å fatte vedtak på denne behandlingen?'}
        lukkModal={lukkModal}
        error={godkjennBehandlingError}
      >
        <Button
          type="submit"
          size="small"
          loading={godkjennerBehandling}
          onClick={() => {
            onGodkjennBehandling();
          }}
        >
          Godkjenn vedtaket
        </Button>
      </BekreftelsesModal>
    </VStack>
  );
};

export default Oppsummering;
