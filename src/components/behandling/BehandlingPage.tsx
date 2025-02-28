import React from 'react';
import { FørstegangsVedtak } from './førstegangsbehandling/FørstegangsVedtak';
import { BehandlingSaksopplysninger } from './saksopplysninger/BehandlingSaksopplysninger';
import { RevurderingVedtak } from './revurdering/RevurderingVedtak';
import { useBehandling } from './BehandlingContext';
import { Behandlingstype } from '../../types/BehandlingTypes';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { Alert, Tag } from '@navikt/ds-react';
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
                        {type === Behandlingstype.FØRSTEGANGSBEHANDLING ? (
                            <FørstegangsVedtak />
                        ) : type === Behandlingstype.REVURDERING ? (
                            <RevurderingVedtak />
                        ) : (
                            <Alert
                                variant={'error'}
                            >{`Behandlingstypen er ikke implementert: ${type}`}</Alert>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
