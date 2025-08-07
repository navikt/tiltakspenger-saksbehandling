import React from 'react';
import { SøknadsbehandlingVedtak } from '~/components/behandling/søknadsbehandling/SøknadsbehandlingVedtak';
import { BehandlingSaksopplysninger } from './saksopplysninger/BehandlingSaksopplysninger';
import { RevurderingVedtak } from './revurdering/RevurderingVedtak';
import { useBehandling } from './BehandlingContext';
import { Behandlingstype } from '~/types/BehandlingTypes';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { Alert } from '@navikt/ds-react';
import { finnBehandlingStatusTag } from '~/utils/tekstformateringUtils';
import AvbruttOppsummering from '../oppsummeringer/oppsummeringAvAvbruttBehandling/OppsummeringAvAvbruttBehandling';
import SideBarMain from '../../layouts/sidebar-main/SideBarMain';
import { BehandlingerTidslinje } from '~/components/behandling/tidslinje/BehandlingerTidslinje';
import { useSak } from '~/context/sak/SakContext';

import style from './BehandlingPage.module.css';
import BehandlingSattPåVentOppsummering from '~/components/oppsummeringer/behandlingSattPåVent/OppsummeringBehandlingSattPåVent';

export const BehandlingPage = () => {
    const { sak } = useSak();
    const behandlingsContext = useBehandling();
    const { type, sakId, saksnummer, status, avbrutt, ventestatus } = behandlingsContext.behandling;

    return (
        <>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true}>
                {finnBehandlingStatusTag(status, false, ventestatus?.erSattPåVent)}
            </PersonaliaHeader>

            <SideBarMain
                sidebar={<BehandlingSaksopplysninger />}
                main={
                    <div className={style.main}>
                        {ventestatus && ventestatus.erSattPåVent && (
                            <BehandlingSattPåVentOppsummering ventestatus={ventestatus} />
                        )}
                        <BehandlingerTidslinje sak={sak} />
                        {avbrutt && <AvbruttOppsummering avbrutt={avbrutt} withPanel={true} />}
                        <div className={style.vedtakContainer}>
                            {type === Behandlingstype.SØKNADSBEHANDLING ? (
                                <SøknadsbehandlingVedtak />
                            ) : type === Behandlingstype.REVURDERING ? (
                                <RevurderingVedtak />
                            ) : (
                                <Alert
                                    variant={'error'}
                                >{`Behandlingstypen er ikke implementert: ${type}`}</Alert>
                            )}
                        </div>
                    </div>
                }
            />
        </>
    );
};
