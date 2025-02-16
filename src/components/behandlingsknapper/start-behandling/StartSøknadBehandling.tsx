import { SøknadForOversikt } from '../../../types/BehandlingTypes';
import { useStartSøknadBehandling } from './useStartSøknadBehandling';
import Varsel from '../../varsel/Varsel';
import style from '../BehandlingKnapper.module.css';
import { Button } from '@navikt/ds-react';
import React from 'react';
import router from 'next/router';

type Props = {
    søknad: SøknadForOversikt;
};

export const StartSøknadBehandling = ({ søknad }: Props) => {
    const { opprettBehandling, opprettBehandlingIsLoading, opprettBehandlingError } =
        useStartSøknadBehandling(søknad);

    const startBehandling = () => {
        opprettBehandling()
            .then((behandling) => {
                router.push(`/behandling/${behandling.id}/førstegangsbehandling`);
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
                loading={opprettBehandlingIsLoading}
                onClick={startBehandling}
            >
                {'Opprett behandling (V2)'}
            </Button>
        </div>
    );
};
