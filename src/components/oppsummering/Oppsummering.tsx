import { Loader, Heading, VStack, Alert, Button } from '@navikt/ds-react';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { useContext, useRef } from 'react';
import BegrunnelseModal from '../begrunnelsemodal/BegrunnelseModal';
import styles from './Oppsummering.module.css';
import VilkårsvurderingTable from './VilkårsvurderingTable';
import { BehandlingStatus } from '../../types/BehandlingTypes';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import Varsel from '../varsel/Varsel';
import { Behandlingsknapper } from '../behandlingsknapper/BehandlingKnapper';
import BekreftelsesModal from '../bekreftelsesmodal/BekreftelsesModal';
import { useGodkjennBehandling } from '../../hooks/useGodkjennBehandling';

const Oppsummering = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { valgtBehandling, isLoading, error } = useHentBehandling(behandlingId);
  const {
    godkjennBehandling,
    godkjennerBehandling,
    godkjennBehandlingError,
    reset,
  } = useGodkjennBehandling(behandlingId);
  const sendTilbakeRef = useRef(null);
  const godkjennRef = useRef(null);

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

  const retur = valgtBehandling.attesteringer.findLast(
    (attestering) => attestering.begrunnelse,
  );

  const visBegrunnelse =
    valgtBehandling.status === BehandlingStatus.UNDER_BEHANDLING && retur;

  return (
    <VStack gap="6" className={styles.wrapper}>
      <Heading size="medium">Oppsummering</Heading>
      {visBegrunnelse && (
        <Alert size="small" role="status" variant="warning">
          {`Beslutter har sendt behandlingen i retur med begrunnelsen: "${
            retur.begrunnelse
          }"`}
        </Alert>
      )}
      <VStack gap="4" className={styles.vurdering}>
        <Heading size="small">Vilkårsvurdering</Heading>
        <VilkårsvurderingTable />
      </VStack>
      <Behandlingsknapper godkjennRef={godkjennRef} />
      <BegrunnelseModal modalRef={sendTilbakeRef} />
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
