import { Alert, Button } from '@navikt/ds-react';
import { useState } from 'react';
import { BehandlingData } from '../../../types/BehandlingTypes';
import { FetcherError } from '../../../utils/fetch';
import { useBehandling } from '../context/BehandlingContext';
import { SaksbehandlerRolle } from '../../../types/Saksbehandler';

import style from './BehandlingSendOgGodkjenn.module.css';

type Props = {
    godkjennBehandling: () => Promise<BehandlingData>;
    isLoading: boolean;
    error?: FetcherError;
};

export const BehandlingGodkjenn = ({ godkjennBehandling, isLoading, error }: Props) => {
    const [harGodkjent, setHarGodkjent] = useState(false);

    const { setBehandling, rolleForBehandling } = useBehandling();

    return (
        <>
            {harGodkjent && (
                <Alert variant={'success'} className={style.varsel}>
                    {'Vedtaket er godkjent'}
                </Alert>
            )}
            {error && (
                <Alert
                    variant={'error'}
                    className={style.varsel}
                >{`Feil ved godkjenning av vedtak: [${error.status}] ${error.info?.melding || error.message}`}</Alert>
            )}
            {rolleForBehandling === SaksbehandlerRolle.BESLUTTER && (
                <Button
                    variant={'primary'}
                    loading={isLoading}
                    onClick={() => {
                        godkjennBehandling()
                            .then((oppdatertBehandling) => {
                                setHarGodkjent(true);
                                setBehandling(oppdatertBehandling);
                            })
                            .catch();
                    }}
                    className={style.knapp}
                >
                    {'Godkjenn vedtaket'}
                </Button>
            )}
        </>
    );
};
