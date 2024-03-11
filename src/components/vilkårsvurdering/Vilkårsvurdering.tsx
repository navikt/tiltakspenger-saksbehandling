import { Accordion, Alert, HStack, VStack } from '@navikt/ds-react';
import { SaksopplysningTabell } from '../saksopplysning-tabell/SaksopplysningTabell';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import { Behandling } from '../../types/Behandling';
import { Lesevisning } from '../../utils/avklarLesevisning';
import { BehandlingKnapper } from '../behandling-knapper/BehandlingKnapper';
import { useRef } from 'react';
import BegrunnelseModal from '../begrunnelse-modal/BegrunnelseModal';
import styles from './Vilkårsvurdering.module.css';
import UtfallAlert from "./UtfallAlert";

interface VilkårsvurderingProps {
  valgtBehandling: Behandling;
  lesevisning: Lesevisning;
}

export const Vilkårsvurdering = ({
  valgtBehandling,
  lesevisning,
}: VilkårsvurderingProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <VStack gap="5" className={styles.vilkårsvurdering}>
      <UtfallAlert utfall={valgtBehandling.samletUtfall}/>
      <Accordion indent={false}>
        <VStack>
          {valgtBehandling.saksopplysninger.map((kategori) => {
            return (
              <Accordion.Item
                key={kategori.kategoriTittel}
                style={{ background: '#FFFFFF' }}
              >
                <Accordion.Header>
                  <HStack align={'center'} gap={'2'}>
                    <UtfallIkon utfall={kategori.samletUtfall} />
                    {kategori.kategoriTittel}
                  </HStack>
                </Accordion.Header>
                <Accordion.Content>
                  <SaksopplysningTabell
                    saksopplysninger={kategori.saksopplysninger}
                    behandlingId={valgtBehandling.behandlingId}
                    behandlingsperiode={{
                      fom: valgtBehandling.fom,
                      tom: valgtBehandling.tom,
                    }}
                    lesevisning={lesevisning}
                  />
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </VStack>
      </Accordion>
      <BehandlingKnapper
        behandlingid={valgtBehandling.behandlingId}
        status={valgtBehandling.status}
        lesevisning={lesevisning}
        modalRef={modalRef}
      />
      <BegrunnelseModal
        behandlingid={valgtBehandling.behandlingId}
        modalRef={modalRef}
      />
    </VStack>
  );
};
