import { Loader, Heading, VStack, Alert } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { BehandlingKnapper } from '../behandling-knapper/BehandlingKnapper';
import { useContext, useRef } from 'react';
import BegrunnelseModal from '../begrunnelse-modal/BegrunnelseModal';
import styles from './Oppsummering.module.css';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import VilkårsvurderingTable from './VilkårsvurderingTable';
import { BehandlingStatus } from '../../types/BehandlingTypes';
import { finnUtfallsperiodetekst } from '../../utils/tekstformateringUtils';
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

  const returBegrunnelse = valgtBehandling.endringslogg.findLast(
    (endring) => endring.type === 'Sendt i retur',
  )?.begrunnelse;

  const visBegrunnelse =
    valgtBehandling.behandlingTilstand === BehandlingStatus.UNDER_BEHANDLING &&
    returBegrunnelse;

  return (
    <VStack gap="6" className={styles.wrapper}>
      <Heading size="medium">Oppsummering</Heading>
      {/*
      // Benny: Tar inn denne igjen når vi har fikset utfallsperiodene i backend
      
      <IkonMedTekst
        iconRenderer={() => (
          <UtfallIkon utfall={valgtBehandling.samletUtfall} />
        )}
        text={finnUtfallsperiodetekst(valgtBehandling.samletUtfall)}
      />
      */}
      {visBegrunnelse && (
        <Alert size="small" role="status" variant="warning">
          {`Beslutter har sendt behandlingen i retur med begrunnelsen: "${
            returBegrunnelse
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
