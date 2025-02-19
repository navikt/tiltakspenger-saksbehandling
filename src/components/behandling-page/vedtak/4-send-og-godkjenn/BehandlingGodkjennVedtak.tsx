import { Alert, Button } from '@navikt/ds-react';
import { useGodkjennVedtakForBehandling } from './useGodkjennVedtakForBehandling';
import { useBehandling } from '../../../../context/behandling/BehandlingContext';

import style from './BehandlingSendOgGodkjenn.module.css';

export const BehandlingGodkjennVedtak = () => {
    const { behandling } = useBehandling();
    const { godkjennVedtak, isLoading, error } = useGodkjennVedtakForBehandling(behandling);

    return (
        <>
            {error && (
                <Alert
                    variant={'error'}
                    className={style.varsel}
                >{`Feil godkjenning av vedtak: [${error.status}] ${error.info?.melding || error.message}`}</Alert>
            )}
            <Button
                variant={'primary'}
                loading={isLoading}
                onClick={() => {
                    console.log('Godkjenner vedtaket');
                    godkjennVedtak();
                }}
                className={style.knapp}
            >
                {'Godkjenn vedtaket'}
            </Button>
        </>
    );
};
