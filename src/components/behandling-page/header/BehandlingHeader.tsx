import PersonaliaHeader from '../../personaliaheader/PersonaliaHeader';
import { Tag } from '@navikt/ds-react';
import { finnBehandlingStatusTekst } from '../../../utils/tekstformateringUtils';
import React from 'react';
import { useBehandling } from '../BehandlingContext';

export const BehandlingHeader = () => {
    const { behandling } = useBehandling();
    const { sakId, saksnummer, status } = behandling;

    return (
        <PersonaliaHeader sakId={sakId} saksnummer={saksnummer}>
            <Tag variant={'alt3-filled'}>{finnBehandlingStatusTekst(status, false)}</Tag>
        </PersonaliaHeader>
    );
};
