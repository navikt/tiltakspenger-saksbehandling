import { Alert, Button } from '@navikt/ds-react';
import { useBehandling } from '../../../../context/behandling/BehandlingContext';
import { useSendVedtakTilBeslutter } from './useSendVedtakTilBeslutter';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';

import style from './BehandlingVedtakKnapper.module.css';

export const BehandlingVedtakKnapper = () => {
    const { vedtak, rolleForBehandling } = useBehandling();
    const { sendTilBeslutter, isLoading, error } = useSendVedtakTilBeslutter();

    return (
        <div className={style.wrapper}>
            {rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER && (
                <Button
                    variant={'primary'}
                    loading={isLoading}
                    onClick={() => {
                        console.log('Sender inn vedtak - ', vedtak);
                        sendTilBeslutter();
                    }}
                    className={style.knapp}
                >
                    {'Send til beslutter'}
                </Button>
            )}
            {rolleForBehandling === SaksbehandlerRolle.BESLUTTER && (
                <Button
                    variant={'primary'}
                    loading={isLoading}
                    onClick={() => {
                        console.log('Godkjenner vedtaket - ', vedtak);
                    }}
                    className={style.knapp}
                >
                    {'Godkjenn vedtaket'}
                </Button>
            )}
            {error && (
                <Alert
                    variant={'error'}
                    className={style.varsel}
                >{`Feil ved send til beslutter: [${error.status}] ${error.info?.melding || error.message}`}</Alert>
            )}
        </div>
    );
};
