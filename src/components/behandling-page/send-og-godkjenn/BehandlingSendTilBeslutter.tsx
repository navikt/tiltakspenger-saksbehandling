import { Alert, Button } from '@navikt/ds-react';
import { useState } from 'react';
import { useBehandling } from '../context/BehandlingContext';
import { BehandlingData } from '../../../types/BehandlingTypes';
import { FetcherError } from '../../../utils/http';

import style from './BehandlingSendOgGodkjenn.module.css';
import { SaksbehandlerRolle } from '../../../types/Saksbehandler';

type Props = {
    sendTilBeslutter: () => Promise<BehandlingData>;
    isLoading: boolean;
    error?: FetcherError;
};

export const BehandlingSendTilBeslutter = ({ sendTilBeslutter, isLoading, error }: Props) => {
    const [harSendt, setHarSendt] = useState(false);

    const { setBehandling, rolleForBehandling } = useBehandling();

    return (
        <>
            {harSendt && (
                <Alert variant={'success'} className={style.varsel}>
                    {'Behandlingen ble sendt til godkjenning'}
                </Alert>
            )}
            {error && (
                <Alert
                    variant={'error'}
                    className={style.varsel}
                >{`Feil ved send til beslutter: [${error.status}] ${error.info?.melding || error.message}`}</Alert>
            )}
            {rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER && (
                <Button
                    variant={'primary'}
                    loading={isLoading}
                    onClick={() => {
                        sendTilBeslutter()
                            .then((oppdatertBehandling) => {
                                setHarSendt(true);
                                setBehandling(oppdatertBehandling);
                            })
                            .catch();
                    }}
                    className={style.knapp}
                >
                    {'Send til beslutter'}
                </Button>
            )}
        </>
    );
};
