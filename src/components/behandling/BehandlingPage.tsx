import React from 'react';
import { SøknadsbehandlingVedtak } from '~/components/behandling/søknadsbehandling/SøknadsbehandlingVedtak';
import { BehandlingSaksopplysninger } from './saksopplysninger/BehandlingSaksopplysninger';
import { RevurderingVedtak } from './revurdering/RevurderingVedtak';
import { useBehandling } from './BehandlingContext';
import { Behandlingstype } from '../../types/BehandlingTypes';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { Alert, Tag } from '@navikt/ds-react';
import { finnBehandlingStatusTekst } from '../../utils/tekstformateringUtils';

import style from './BehandlingPage.module.css';
import AvbruttOppsummering from '../oppsummeringer/oppsummeringAvAvbruttBehandling/OppsummeringAvAvbruttBehandling';
import SideBarMain from '../../layouts/sidebar-main/SideBarMain';

export const BehandlingPage = () => {
    const behandlingsContext = useBehandling();
    const { type, sakId, saksnummer, status, avbrutt } = behandlingsContext.behandling;

    return (
        <>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true}>
                <Tag variant={'alt3-filled'}>{finnBehandlingStatusTekst(status, false)}</Tag>
            </PersonaliaHeader>

            <SideBarMain
                sidebar={<BehandlingSaksopplysninger />}
                main={
                    <div className={style.main}>
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
