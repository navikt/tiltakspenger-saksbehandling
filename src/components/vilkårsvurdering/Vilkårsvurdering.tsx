import {
  Accordion,
  BodyShort,
  HStack,
  Link,
  Timeline,
  VStack,
} from '@navikt/ds-react';
import { SaksopplysningTabell } from '../saksopplysning-tabell/SaksopplysningTabell';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import {
  Behandling,
  LovreferenseDTO,
  SaksopplysningInnDTO,
} from '../../types/Behandling';
import { Lesevisning } from '../../utils/avklarLesevisning';
import { BehandlingKnapper } from '../behandling-knapper/BehandlingKnapper';
import React, { useRef } from 'react';
import BegrunnelseModal from '../begrunnelse-modal/BegrunnelseModal';
import styles from './Vilkårsvurdering.module.css';
import UtfallAlert from './UtfallAlert';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import VilkårsvurderingAvTiltaksdeltagelse from '../vilkårsvurdering-av-tiltaksdeltagelse/VilkårsvurderingAvTiltaksdeltagelse';
import VilkårsvurderingAvSøknadsfrist from '../vilkårsvurdering-av-søknadsfrist/VilkårsvurderingAvSøknadsfrist';
import { toDate } from '../../utils/date';

interface VilkårsvurderingProps {
  valgtBehandling: Behandling;
  lesevisning: Lesevisning;
}

const fargeForUtfall = (utfall: String) => {
  switch (utfall) {
    case 'KREVER_MANUELL_VURDERING':
      return 'warning';
    case 'GIR_IKKE_RETT_TILTAKSPENGER':
      return 'danger';
    case 'GIR_RETT_TILTAKSPENGER':
      return 'success';
  }
};

const tekstForUtfall = (utfall: String) => {
  switch (utfall) {
    case 'KREVER_MANUELL_VURDERING':
      return 'Krever manuell saksbehandling';
    case 'GIR_IKKE_RETT_TILTAKSPENGER':
      return 'Vilkår for tiltakspenger er ikke oppfylt for perioden.';
    case 'GIR_RETT_TILTAKSPENGER':
      return 'Vilkår for tiltakspenger er oppfylt for perioden';
  }
};

export const Vilkårsvurdering = ({
  valgtBehandling,
  lesevisning,
}: VilkårsvurderingProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const {
    kravdatoSaksopplysninger: {
      søknadstidspunktFraSaksbehandler,
      opprinneligSøknadstidspunkt,
      vurderinger,
    },
  } = valgtBehandling;

  const opprinneligSøknadstidspunktDate = toDate(opprinneligSøknadstidspunkt);
  const søknadstidspunktFraSaksbehandlerDate = søknadstidspunktFraSaksbehandler
    ? toDate(søknadstidspunktFraSaksbehandler)
    : null;

  const hentLovDataURLen = (lovverk: string, paragraf: string) => {
    if (lovverk == 'Tiltakspengeforskriften')
      return `https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286/${paragraf}`;
    if (lovverk == 'Arbeidsmarkedsloven')
      return `https://lovdata.no/dokument/NL/lov/2004-12-10-76/${paragraf}`;
    if (lovverk == 'Rundskriv om tiltakspenger' && paragraf == '§8')
      return `https://lovdata.no/nav/rundskriv/r76-13-02/§8#KAPITTEL_3-7`;
    return 'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286/';
  };

  function lagDistinktLovReferenseListe(
    saksopplysningListe: SaksopplysningInnDTO[],
  ): LovreferenseDTO[] {
    const LovReferenseListe = saksopplysningListe.flatMap((dto) => {
      return dto.vilkårLovReferense.map((lovreferense) => lovreferense);
    });
    let LovReferenseDistinctSet = new Set(
      LovReferenseListe.map((e) => JSON.stringify(e)),
    );
    return Array.from(LovReferenseDistinctSet).map((e) => JSON.parse(e));
  }

  return (
    <VStack gap="5" className={styles.vilkårsvurdering}>
      {valgtBehandling.utfallsperioder &&
        valgtBehandling.utfallsperioder.length != 0 && (
          <Timeline>
            <Timeline.Row label="Utfall">
              {valgtBehandling.utfallsperioder.map((p, i) => (
                <Timeline.Period
                  key={i}
                  start={new Date(p.fom)}
                  end={new Date(p.tom)}
                  status={fargeForUtfall(p.utfall)}
                  icon={<PersonCircleIcon />}
                  statusLabel={p.utfall}
                >
                  {tekstForUtfall(p.utfall)}
                  <br />
                  {`Antall barn: ${p.antallBarn}`}
                </Timeline.Period>
              ))}
            </Timeline.Row>
          </Timeline>
        )}

      <UtfallAlert utfall={valgtBehandling.samletUtfall} />
      <VilkårsvurderingAvSøknadsfrist
        opprinneligSøknadstidspunkt={opprinneligSøknadstidspunktDate}
        søknadstidspunktFraSaksbehandler={søknadstidspunktFraSaksbehandlerDate}
        vurderinger={vurderinger}
      />
      <VilkårsvurderingAvTiltaksdeltagelse
        registrerteTiltak={valgtBehandling.registrerteTiltak}
      />
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
                  {lagDistinktLovReferenseListe(kategori.saksopplysninger).map(
                    (lovreferense, index: number) => {
                      return (
                        <BodyShort key={index}>
                          <Link
                            key={index}
                            href={hentLovDataURLen(
                              lovreferense.lovverk,
                              lovreferense.paragraf,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginBottom: '0.5em' }}
                          >
                            {lovreferense.lovverk} {lovreferense.paragraf}{' '}
                            {lovreferense.beskrivelse}
                          </Link>
                        </BodyShort>
                      );
                    },
                  )}
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
