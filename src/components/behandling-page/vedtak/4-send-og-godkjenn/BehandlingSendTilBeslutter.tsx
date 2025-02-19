import { useBehandling } from '../../../../context/behandling/BehandlingContext';
import { useSendVedtakTilBeslutter } from './useSendVedtakTilBeslutter';
import { Alert, Button } from '@navikt/ds-react';
import style from './BehandlingSendOgGodkjenn.module.css';

export const BehandlingSendTilBeslutter = () => {
    const { vedtak, behandling } = useBehandling();

    const { sendTilBeslutter, isLoading, error } = useSendVedtakTilBeslutter(vedtak, behandling);

    return (
        <>
            <Button
                variant={'primary'}
                loading={isLoading}
                onClick={() => {
                    sendTilBeslutter().then(() => {});
                }}
                className={style.knapp}
            >
                {'Send til beslutter'}
            </Button>
            {error && (
                <Alert
                    variant={'error'}
                    className={style.varsel}
                >{`Feil ved send til beslutter: [${error.status}] ${error.info?.melding || error.message}`}</Alert>
            )}
        </>
    );
};
