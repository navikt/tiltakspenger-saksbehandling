import { Accordion, Link, HStack, VStack, BodyShort } from '@navikt/ds-react';
import { SaksopplysningTabell } from '../saksopplysning-tabell/SaksopplysningTabell';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import {Behandling} from '../../types/Behandling';
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

    const hentLovDataURLen = (lovverk: string, paragraf: string) => {
        if (lovverk == 'Tiltakspengeforskriften') return `https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286/${paragraf}`;
        if (lovverk == 'Arbeidsmarkedsloven') return `https://lovdata.no/dokument/NL/lov/2004-12-10-76/${paragraf}`;
        if (lovverk == 'Rundskriv om tiltakspenger' && paragraf == '§8') return `https://lovdata.no/nav/rundskriv/r76-13-02/${paragraf}#KAPITTEL_3-7`;
        return 'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286/';
    }

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
                    {
                        kategori.kategoriLovreferanse.map((lov, index: number) => {
                            return (
                                <BodyShort key={index}>
                                    <Link
                                        key={index}
                                        href={hentLovDataURLen(lov.lovverk, lov.paragraf)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ marginBottom: '0.5em'}}
                                    >
                                        {lov.lovverk} {lov.paragraf} {lov.beskrivelse}
                                    </Link>
                                </BodyShort>
                            )
                        })
                    }
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
