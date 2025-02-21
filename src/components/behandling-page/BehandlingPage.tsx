import React from 'react';
import { Loader } from '@navikt/ds-react';
import { BehandlingHeader } from './header/BehandlingHeader';
import { FørstegangsbehandlingVedtak } from './førstegangsbehandling/FørstegangsbehandlingVedtak';
import { BehandlingSaksopplysninger } from './saksopplysninger/BehandlingSaksopplysninger';
import { BehandlingProvider } from './context/BehandlingContext';
import useSWR from 'swr';
import { BehandlingData, BehandlingId } from '../../types/BehandlingTypes';
import { fetcher, FetcherError } from '../../utils/http';
import Varsel from '../varsel/Varsel';
import { RevurderingsVedtak } from './revurdering/RevurderingsVedtak';

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

    return (
        <BehandlingProvider behandling={behandling}>
            <BehandlingHeader />
            <div className={style.main}>
                <BehandlingSaksopplysninger />
                <div className={style.vedtakOuter}>
                    <div className={style.vedtakInner}>
                        <FørstegangsbehandlingVedtak />
                        <RevurderingsVedtak />
                    </div>
                </div>
            </div>
        </BehandlingProvider>
    );
};
