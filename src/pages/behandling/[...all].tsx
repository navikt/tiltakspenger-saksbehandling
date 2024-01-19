import React, { useContext, useRef, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import SøknadSummarySection from '../../containers/søknad-summary-section/SøknadSummarySection';
import PersonaliaHeader from '../../containers/personalia-header/PersonaliaHeader';
import BehandlingTabs from '../../containers/søknad-tabs/BehandlingTabs';
import { SøkerLayout } from '../../layouts/soker/SøkerLayout';
import Loaders from '../../components/loaders/Loaders';
import { pageWithAuthentication } from '../../utils/pageWithAuthentication';
import { useBehandling } from '../../core/useBehandling';
import { BehandlingKnapper } from '../../containers/behandling-knapper/BehandlingKnapper';
import { Tag } from '@navikt/ds-react';
import styles from './Soker.module.css';
import { SaksbehandlerContext } from '../_app';
import { avklarLesevisning } from '../../utils/avklarLesevisning';
import BegrunnelseModal from '../../containers/begrunnelse-modal/BegrunnelseModal';
import { Saksdialog } from '../../containers/saksdialog/Saksdialog';
import { Detaljer } from '../../containers/meldekort-detaljer/meldekort-detaljer';
import { MeldekortMeny } from '../../containers/meldekort-meny/meldekort-meny';

const BehandlingPage: NextPage = () => {
  const router = useRouter();
  const [behandlingId] = router.query.all as string[];
  const modalRef = useRef<HTMLDialogElement>(null);

  const { valgtBehandling, isLoading } = useBehandling(behandlingId);
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const [valgtTab, setValgtTab] = useState<string>('Inngangsvilkår');

  if (isLoading || !valgtBehandling) {
    return <Loaders.Page />;
  }

  const girInnvilget = !valgtBehandling.saksopplysninger.find(
    (saksopplysning) => saksopplysning.samletUtfall !== 'OPPFYLT'
  );

  const lesevisning = avklarLesevisning(
    innloggetSaksbehandler!!,
    valgtBehandling.saksbehandler,
    valgtBehandling.beslutter,
    valgtBehandling.tilstand,
    girInnvilget
  );

  const setTab = (valgtTab: string) => {
    setValgtTab(valgtTab);
  };

  return (
    <SøkerLayout>
      <PersonaliaHeader
        personopplysninger={valgtBehandling.personopplysninger}
        lesevisning={lesevisning}
      />
      <Tag variant="info-filled" size="medium" className={styles.behandlingtag}>
        Førstegangsbehandling
      </Tag>
      <BehandlingKnapper
        behandlingid={valgtBehandling.behandlingId}
        tilstand={valgtBehandling.tilstand}
        status={valgtBehandling.status}
        lesevisning={lesevisning}
        modalRef={modalRef}
      />

      {valgtTab === 'Inngangsvilkår' && (
        <>
          <SøknadSummarySection
            søknad={valgtBehandling.søknad}
            registrerteTiltak={valgtBehandling.registrerteTiltak}
          />
          <BehandlingTabs
            onChange={(id) =>
              router.push(`/behandling/${valgtBehandling?.behandlingId}/${id}`)
            }
            defaultTab={'Inngangsvilkår'}
            behandling={valgtBehandling}
            lesevisning={lesevisning}
            sendTabCallback={setTab}
          />
          <Saksdialog endringslogg={valgtBehandling.endringslogg} />
        </>
      )}

      {valgtTab === 'Meldekort' && (
        <>
          <MeldekortMeny behandlingId={valgtBehandling.behandlingId} />
          <BehandlingTabs
            onChange={(id) =>
              router.push(`/behandling/${valgtBehandling?.behandlingId}/${id}`)
            }
            defaultTab={'Meldekort'}
            behandling={valgtBehandling}
            lesevisning={lesevisning}
            sendTabCallback={setTab}
          />
          <Detaljer />
        </>
      )}

      {valgtTab === 'Utbetaling' && (
        <>
          <SøknadSummarySection
            søknad={valgtBehandling.søknad}
            registrerteTiltak={valgtBehandling.registrerteTiltak}
          />
          <BehandlingTabs
            onChange={(id) =>
              router.push(`/behandling/${valgtBehandling?.behandlingId}/${id}`)
            }
            defaultTab={'Utbetaling'}
            behandling={valgtBehandling}
            lesevisning={lesevisning}
            sendTabCallback={setTab}
          />
        </>
      )}
      <BegrunnelseModal
        behandlingid={valgtBehandling.behandlingId}
        modalRef={modalRef}
      />
    </SøkerLayout>
  );
};

export default BehandlingPage;

export const getServerSideProps = pageWithAuthentication();
