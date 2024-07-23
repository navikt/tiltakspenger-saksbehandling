import { Loader, Heading, VStack, Alert } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { BehandlingKnapper } from '../behandling-knapper/BehandlingKnapper';
import { useRef } from 'react';
import BegrunnelseModal from '../begrunnelse-modal/BegrunnelseModal';
import styles from './Oppsummering.module.css';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import VilkårsvurderingTable from './VilkårsvurderingTable';
import { BehandlingTilstand } from '../../types/BehandlingTypes';
import { finnUtfallsperiodetekst } from '../../utils/tekstformateringUtils';

const Oppsummering = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const modalRef = useRef(null);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const returBegrunnelse = valgtBehandling.endringslogg.findLast(
    (endring) => endring.type === 'Sendt i retur',
  )?.begrunnelse;

  const visBegrunnelse =
    valgtBehandling.behandlingTilstand === BehandlingTilstand.VILKÅRSVURDERT &&
    returBegrunnelse;

  return (
    <VStack gap="6" className={styles.wrapper}>
      <Heading size="medium">Oppsummering</Heading>
      <IkonMedTekst
        iconRenderer={() => (
          <UtfallIkon utfall={valgtBehandling.samletUtfall} />
        )}
        text={finnUtfallsperiodetekst(valgtBehandling.samletUtfall)}
      />
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
      <BehandlingKnapper
        behandlingid={valgtBehandling.behandlingId}
        status={valgtBehandling.status}
        modalRef={modalRef}
      />
      <BegrunnelseModal
        behandlingid={valgtBehandling.behandlingId}
        modalRef={modalRef}
      />
    </VStack>
  );
};

export default Oppsummering;
