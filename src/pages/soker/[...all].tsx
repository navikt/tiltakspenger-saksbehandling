import React, {useContext, useRef} from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { atom } from 'jotai';
import SøknadSummarySection from '../../containers/søknad-summary-section/SøknadSummarySection';
import PersonaliaHeader from '../../containers/personalia-header/PersonaliaHeader';
import BehandlingTabs from '../../containers/søknad-tabs/BehandlingTabs';
import { SøkerLayout } from '../../layouts/soker/SøkerLayout';
import Loaders from '../../components/loaders/Loaders';
import { pageWithAuthentication } from '../../utils/pageWithAuthentication';
import { useBehandling } from '../../core/useBehandling';
import { Tag } from '@navikt/ds-react';
import styles from './Soker.module.css';
import {BehandlingKnapper} from "../../containers/behandling-knapper/BehandlingKnapper";
import {avklarLesevisning} from "../../utils/avklarLesevisning";
import {SaksbehandlerContext} from "../_app";
import BegrunnelseModal from "../../containers/begrunnelse-modal/BegrunnelseModal";

export const søknadIdAtom = atom('');

const SøkerPage: NextPage = () => {
    const router = useRouter();
    const [søkerId, søknadId] = router.query.all as string[];
    const modalRef = useRef<HTMLDialogElement>(null);

    const { valgtBehandling, isLoading } = useBehandling('beh_01H27W28VJSRPR1ESE5ASR04N8'); // todo: gjørnome
    const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

    if (isLoading || !valgtBehandling) {
        return <Loaders.Page />;
    }

    const girInnvilget = !valgtBehandling.saksopplysninger.find(
        (saksopplysning) => saksopplysning.samletUtfall !== "OPPFYLT"
    )

    const lesevisning = avklarLesevisning(innloggetSaksbehandler!!, valgtBehandling.saksbehandler, valgtBehandling.beslutter, valgtBehandling.tilstand, girInnvilget)

    return (
        <SøkerLayout>
            <PersonaliaHeader personopplysninger={valgtBehandling.personopplysninger} lesevisning={lesevisning}/>
            <Tag variant="info-filled" size="medium" className={styles.behandlingtag}>
                Førstegangsbehandling
            </Tag>
            <BehandlingKnapper behandlingid={valgtBehandling.behandlingId} tilstand={valgtBehandling.tilstand} status={valgtBehandling.status} lesevisning={lesevisning} modalRef={modalRef}/>
            <SøknadSummarySection søknad={valgtBehandling.søknad} registrerteTiltak={valgtBehandling.registrerteTiltak}/>
            <BehandlingTabs
                onChange={(id) => router.push(`/behandling/${valgtBehandling?.behandlingId}/${id}`)}
                defaultTab={'Inngangsvilkår'}
                behandling={valgtBehandling}
                lesevisning={lesevisning}
            />
            <BegrunnelseModal behandlingid={valgtBehandling.behandlingId} ref={modalRef}/>
        </SøkerLayout>
    );
};

export default SøkerPage;

export const getServerSideProps = pageWithAuthentication();
