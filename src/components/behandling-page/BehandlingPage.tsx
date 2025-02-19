import React from 'react';
import { Loader, Tag } from '@navikt/ds-react';
import PersonaliaHeader from '../personaliaheader/PersonaliaHeader';
import { finnBehandlingStatusTekst } from '../../utils/tekstformateringUtils';
import { BehandlingVedtak } from './vedtak/BehandlingVedtak';
import { BehandlingSaksopplysninger } from './saksopplysninger/BehandlingSaksopplysninger';
import { BehandlingProvider } from '../../context/behandling/BehandlingContext';
import useSWR from 'swr';
import { BehandlingData, BehandlingId } from '../../types/BehandlingTypes';
import { fetcher, FetcherError } from '../../utils/http';
import Varsel from '../varsel/Varsel';

import style from './BehandlingPage.module.css';

type Props = {
    behandlingId: BehandlingId;
};

export const BehandlingPage = ({ behandlingId }: Props) => {
    const {
        data: behandling,
        isLoading,
        error,
    } = useSWR<BehandlingData, FetcherError>(`/api/behandling/${behandlingId}`, fetcher);

    if (error) {
        return (
            <Varsel
                variant={'error'}
                melding={`Kunne ikke hente behandling med id ${behandlingId} - [${error.status}] ${error.message}`}
            />
        );
    }

    if (isLoading || !behandling) {
        return <Loader />;
    }

    const { sakId, saksnummer, status } = behandling;

    return (
        <BehandlingProvider behandling={behandling}>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer}>
                <Tag variant={'alt3-filled'}>{finnBehandlingStatusTekst(status, false)}</Tag>
            </PersonaliaHeader>
            <div className={style.main}>
                <BehandlingSaksopplysninger />
                <BehandlingVedtak />
            </div>
        </BehandlingProvider>
    );
};
