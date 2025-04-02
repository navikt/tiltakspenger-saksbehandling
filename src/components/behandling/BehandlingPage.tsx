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
import AvbruttOppsummering from '../oppsummeringer/oppsummeringAvAvbruttBehandling/OppsummeringAvAvbruttBehandling';

export const BehandlingPage = () => {
    const behandlingsContext = useBehandling();
    const { type, sakId, saksnummer, status, avbrutt } = behandlingsContext.behandling;

    return (
        <>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true}>
                <Tag variant={'alt3-filled'}>{finnBehandlingStatusTekst(status, false)}</Tag>
            </PersonaliaHeader>
            <div className={style.main}>
                <BehandlingSaksopplysninger />
                <div className={style.vedtakOuter}>
                    {avbrutt && <AvbruttOppsummering avbrutt={avbrutt} withPanel={true} />}
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
