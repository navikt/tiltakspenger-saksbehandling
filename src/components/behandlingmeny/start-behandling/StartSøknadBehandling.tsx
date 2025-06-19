import { useStartSøknadBehandling } from './useStartSøknadBehandling';
import Varsel from '../../varsel/Varsel';
import { Button, VStack } from '@navikt/ds-react';
import React from 'react';
import router from 'next/router';
import { SøknadForOversiktProps } from '../../../types/SøknadTypes';

import style from '../BehandlingKnapper.module.css';
import AvsluttBehandlingKnapp from '../menyvalg/AvsluttBehandlingKnapp';

type Props = {
    søknad: SøknadForOversiktProps;
    medAvsluttBehandling?: boolean;
};

export const StartSøknadBehandling = ({ søknad, medAvsluttBehandling }: Props) => {
    const { opprettBehandling, opprettBehandlingIsLoading, opprettBehandlingError } =
        useStartSøknadBehandling(søknad);

    const startBehandling = () => {
        opprettBehandling().then((behandling) => {
            if (behandling) {
                router.push(`/behandling/${behandling.id}`);
            }
        });
    };

    return (
        <>
            {opprettBehandlingError && (
                <Varsel
                    size="small"
                    variant="error"
                    melding={opprettBehandlingError.message}
                    className={style.varsel}
                    key={Date.now()}
                />
            )}
            <VStack align="start" gap="2">
                <Button
                    className={style.knapp}
                    size="small"
                    loading={opprettBehandlingIsLoading}
                    onClick={startBehandling}
                >
                    Opprett behandling
                </Button>
                {medAvsluttBehandling && (
                    <AvsluttBehandlingKnapp
                        saksnummer={søknad.saksnummer}
                        søknadsId={søknad.id}
                        minWidth
                        button={{
                            text: 'Avslutt søknad',
                        }}
                        modal={{
                            tittel: 'Avslutt søknad',
                            tekst: 'Er du sikker på at du vil avslutte søknaden?',
                            textareaLabel: 'Hvorfor avsluttes søknaden? (Obligatorisk)',
                            primaryButtonText: 'Avslutt søknad',
                            secondaryButtonText: 'Ikke avslutt søknad',
                        }}
                    />
                )}
            </VStack>
        </>
    );
};
