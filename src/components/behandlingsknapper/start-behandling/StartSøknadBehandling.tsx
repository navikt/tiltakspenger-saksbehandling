import { useStartSøknadBehandling } from './useStartSøknadBehandling';
import Varsel from '../../varsel/Varsel';
import { Button } from '@navikt/ds-react';
import React from 'react';
import router from 'next/router';
import { SøknadForOversiktProps } from '../../../types/SøknadTypes';

import style from '../BehandlingKnapper.module.css';

type Props = {
    søknad: SøknadForOversiktProps;
};

export const StartSøknadBehandling = ({ søknad }: Props) => {
    const { opprettBehandling, opprettBehandlingIsLoading, opprettBehandlingError } =
        useStartSøknadBehandling(søknad);

    const startBehandling = () => {
        opprettBehandling()
            .then((behandling) => {
                router.push(`/behandling/${behandling.id}`);
            })
            .catch(() => ({}));
    };

    return (
        <>
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
                {'Opprett behandling (ny flyt)'}
            </Button>
        </>
    );
};
