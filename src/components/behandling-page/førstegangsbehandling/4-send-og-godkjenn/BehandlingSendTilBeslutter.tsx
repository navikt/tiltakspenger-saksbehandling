import { useBehandling } from '../../context/BehandlingContext';
import { useSendVedtakTilBeslutter } from './useSendVedtakTilBeslutter';
import { Alert, Button } from '@navikt/ds-react';
import { useState } from 'react';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';

import style from './BehandlingSendOgGodkjenn.module.css';

export const BehandlingSendTilBeslutter = () => {
    const [harSendt, setHarSendt] = useState(false);

    const { vedtak, behandling, setBehandling, rolleForBehandling } = useBehandling();
    const { sendTilBeslutter, isLoading, error } = useSendVedtakTilBeslutter(vedtak, behandling);

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
