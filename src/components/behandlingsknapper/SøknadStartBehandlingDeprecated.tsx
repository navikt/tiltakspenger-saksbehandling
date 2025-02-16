import { BehandlingId, SøknadForOversikt, SøknadId } from '../../types/BehandlingTypes';
import Varsel from '../varsel/Varsel';
import { Button } from '@navikt/ds-react';
import router from 'next/router';
import React from 'react';
import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../../utils/http';

import style from './BehandlingKnapper.module.css';

type StartBehandlingArgs = { id: SøknadId };
type StartBehandlingResponse = { id: BehandlingId };

type Props = {
    søknad: SøknadForOversikt;
};

export const SøknadStartBehandlingDeprecated = ({ søknad }: Props) => {
    const {
        trigger: opprettBehandling,
        isMutating: isSøknadMutating,
        error: opprettBehandlingError,
    } = useSWRMutation<StartBehandlingResponse, FetcherError, string, StartBehandlingArgs>(
        '/api/behandling/startbehandling',
        fetchStartBehandling,
    );

    const startBehandling = () => {
        opprettBehandling({ id: søknad.id })
            .then((behandling) => {
                router.push(`/behandling/${behandling.id}/inngangsvilkar/kravfrist`);
            })
            .catch(() => ({}));
    };

    return (
        <div>
            {opprettBehandlingError && (
                <Varsel
                    size={'small'}
                    variant={'error'}
                    melding={opprettBehandlingError.message}
                    className={style.varsel}
                    key={Date.now()}
                />
            )}
            <Button
                className={style.knapp}
                variant={'primary'}
                size={'small'}
                loading={isSøknadMutating}
                onClick={startBehandling}
            >
                {'Opprett behandling'}
            </Button>
        </div>
    );
};

const fetchStartBehandling = async (
    url: string,
    { arg }: { arg: StartBehandlingArgs },
): Promise<StartBehandlingResponse> => {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });

    await throwErrorIfFatal(res);

    return res.json();
};
