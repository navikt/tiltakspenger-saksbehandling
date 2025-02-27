import { Alert, Button } from '@navikt/ds-react';
import { useState } from 'react';
import { useBehandling } from '../BehandlingContext';
import { BehandlingData } from '../../../types/BehandlingTypes';
import { FetcherError } from '../../../utils/fetch/fetch';
import { SaksbehandlerRolle } from '../../../types/Saksbehandler';

import style from './BehandlingSendOgGodkjenn.module.css';

type Props = {
    sendTilBeslutning: () => Promise<BehandlingData | undefined>;
    isLoading: boolean;
    error?: FetcherError;
};

export const BehandlingSendTilBeslutning = ({ sendTilBeslutning, isLoading, error }: Props) => {
    const [harSendt, setHarSendt] = useState(false);

    const { setBehandling, rolleForBehandling } = useBehandling();

    return (
        <div className={style.wrapper}>
            {harSendt && (
                <Alert variant={'success'} className={style.varsel}>
                    {'Vedtaket ble sendt til beslutning'}
                </Alert>
            )}
            {error && (
                <Alert
                    variant={'error'}
                    className={style.varsel}
                >{`Feil ved send til beslutning: [${error.status}] ${error.info?.melding || error.message}`}</Alert>
            )}
            {rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER && (
                <Button
                    variant={'primary'}
                    loading={isLoading}
                    onClick={() => {
                        sendTilBeslutning()
                            .then((oppdatertBehandling) => {
                                if (oppdatertBehandling) {
                                    setHarSendt(true);
                                    setBehandling(oppdatertBehandling);
                                }
                            })
                            .catch();
                    }}
                    className={style.knapp}
                >
                    {'Send til beslutning'}
                </Button>
            )}
        </div>
    );
};
