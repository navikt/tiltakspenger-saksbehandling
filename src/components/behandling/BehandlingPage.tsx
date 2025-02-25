import React from 'react';
import { BehandlingHeader } from './header/BehandlingHeader';
import { FørstegangsbehandlingVedtak } from './førstegangsbehandling/FørstegangsbehandlingVedtak';
import { BehandlingSaksopplysninger } from './saksopplysninger/BehandlingSaksopplysninger';
import { RevurderingsVedtak } from './revurdering/RevurderingsVedtak';
import { useBehandling } from './context/BehandlingContext';
import {
    FørstegangsbehandlingContextState,
    FørstegangsbehandlingProvider,
} from './førstegangsbehandling/FørstegangsbehandlingContext';
import { Behandlingstype } from '../../types/BehandlingTypes';
import { RevurderingContextState, RevurderingProvider } from './revurdering/RevurderingContext';

import style from './BehandlingPage.module.css';

export const BehandlingPage = () => {
    const behandlingsContext = useBehandling();
    const behandlingsType = behandlingsContext.behandling.type;

    return (
        <>
            <BehandlingHeader />
            <div className={style.main}>
                <BehandlingSaksopplysninger />
                <div className={style.vedtakOuter}>
                    <div className={style.vedtakInner}>
                        {behandlingsType === Behandlingstype.FØRSTEGANGSBEHANDLING && (
                            <FørstegangsbehandlingProvider
                                behandlingContext={
                                    behandlingsContext as FørstegangsbehandlingContextState
                                }
                            >
                                <FørstegangsbehandlingVedtak />
                            </FørstegangsbehandlingProvider>
                        )}
                        {behandlingsType === Behandlingstype.REVURDERING && (
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
