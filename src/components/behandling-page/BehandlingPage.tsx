import { Tag } from '@navikt/ds-react';
import React from 'react';
import PersonaliaHeader from '../personaliaheader/PersonaliaHeader';
import { finnBehandlingStatusTekst } from '../../utils/tekstformateringUtils';
import { BehandlingVedtak } from './vedtak/BehandlingVedtak';
import { BehandlingSaksopplysninger } from './saksopplysninger/BehandlingSaksopplysninger';
import { useBehandling } from '../../context/behandling/BehandlingContext';

import style from './BehandlingPage.module.css';

export const BehandlingPage = () => {
    const { sakId, saksnummer, status } = useBehandling().behandling;

    return (
        <>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer}>
                <Tag variant={'alt3-filled'}>{finnBehandlingStatusTekst(status, false)}</Tag>
            </PersonaliaHeader>
            <div className={style.main}>
                <BehandlingSaksopplysninger />
                <BehandlingVedtak />
            </div>
        </>
    );
};
