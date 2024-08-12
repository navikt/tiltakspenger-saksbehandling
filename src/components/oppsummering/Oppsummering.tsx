import { Loader, Heading, VStack, Alert } from '@navikt/ds-react';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { BehandlingKnapper } from '../behandling-knapper/BehandlingKnapper';
import { useContext, useRef } from 'react';
import BegrunnelseModal from '../begrunnelse-modal/BegrunnelseModal';
import styles from './Oppsummering.module.css';
import VilkårsvurderingTable from './VilkårsvurderingTable';
import { BehandlingStatus } from '../../types/BehandlingTypes';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';
import Varsel from '../varsel/Varsel';

const Oppsummering = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { valgtBehandling, isLoading, error } = useHentBehandling(behandlingId);
  const modalRef = useRef(null);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  } else if (error)
    return (
      <Varsel
        variant="error"
        melding={`Kunne ikke hente oppsummering (${error.status} ${error.info})`}
      />
    );

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
      <BehandlingKnapper modalRef={modalRef} />
      <BegrunnelseModal modalRef={modalRef} />
    </VStack>
  );
};

export default Oppsummering;
