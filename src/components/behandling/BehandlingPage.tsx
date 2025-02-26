import React from 'react';
import { FørstegangsbehandlingVedtak } from './førstegangsbehandling/FørstegangsbehandlingVedtak';
import { BehandlingSaksopplysninger } from './saksopplysninger/BehandlingSaksopplysninger';
import { RevurderingsVedtak } from './revurdering/RevurderingsVedtak';
import { useBehandling } from './BehandlingContext';
import {
    FørstegangsbehandlingContextState,
    FørstegangsbehandlingProvider,
} from './førstegangsbehandling/context/FørstegangsbehandlingContext';
import { Behandlingstype } from '../../types/BehandlingTypes';
import { RevurderingContextState, RevurderingProvider } from './revurdering/RevurderingContext';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { Tag } from '@navikt/ds-react';
import { finnBehandlingStatusTekst } from '../../utils/tekstformateringUtils';

import style from './BehandlingPage.module.css';

export const BehandlingPage = () => {
    const behandlingsContext = useBehandling();
    const { type, sakId, saksnummer, status } = behandlingsContext.behandling;

    return (
        <>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer}>
                <Tag variant={'alt3-filled'}>{finnBehandlingStatusTekst(status, false)}</Tag>
            </PersonaliaHeader>
            <div className={style.main}>
                <BehandlingSaksopplysninger />
                <div className={style.vedtakOuter}>
                    <div className={style.vedtakInner}>
                        {type === Behandlingstype.FØRSTEGANGSBEHANDLING && (
                            <FørstegangsbehandlingProvider
                                behandlingContext={
                                    behandlingsContext as FørstegangsbehandlingContextState
                                }
                            >
                                <FørstegangsbehandlingVedtak />
                            </FørstegangsbehandlingProvider>
                        )}
                        {type === Behandlingstype.REVURDERING && (
                            <RevurderingProvider
                                behandlingContext={behandlingsContext as RevurderingContextState}
                            >
                                <RevurderingsVedtak />
                            </RevurderingProvider>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
