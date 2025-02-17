import { Tag } from '@navikt/ds-react';
import React from 'react';
import { BehandlingProps } from '../../types/BehandlingTypes';
import { BehandlingProvider } from '../../context/behandling/BehandlingProvider';
import PersonaliaHeader from '../personaliaheader/PersonaliaHeader';
import { finnBehandlingStatusTekst } from '../../utils/tekstformateringUtils';
import { BehandlingVedtak } from './vedtak/BehandlingVedtak';
import { BehandlingSaksopplysninger } from './saksopplysninger/BehandlingSaksopplysninger';

import style from './BehandlingPage.module.css';

type Props = {
    behandling: BehandlingProps;
};

export const BehandlingPage = ({ behandling }: Props) => {
    const { sakId, saksnummer, status } = behandling;

    return (
        <BehandlingProvider behandling={behandling}>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer}>
                <Tag variant={'alt3-filled'}>{finnBehandlingStatusTekst(status, false)}</Tag>
            </PersonaliaHeader>
            <div className={style.main}>
                <BehandlingSaksopplysninger behandling={behandling} />
                <BehandlingVedtak />
            </div>
        </BehandlingProvider>
    );
};
