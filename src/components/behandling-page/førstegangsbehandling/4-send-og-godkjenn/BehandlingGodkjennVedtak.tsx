import { Alert, Button } from '@navikt/ds-react';
import { useGodkjennVedtakForBehandling } from './useGodkjennVedtakForBehandling';
import { useBehandling } from '../../BehandlingContext';
import { useState } from 'react';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';

import style from './BehandlingSendOgGodkjenn.module.css';

export const BehandlingGodkjennVedtak = () => {
    const [harGodkjent, setHarGodkjent] = useState(false);

    const { behandling, setBehandling, rolleForBehandling } = useBehandling();
    const { godkjennVedtak, isLoading, error } = useGodkjennVedtakForBehandling(behandling);

    return (
        <>
            {harGodkjent && (
                <Alert variant={'success'} className={style.varsel}>
                    {'Behandlingen er godkjent'}
                </Alert>
            )}
            {error && (
                <Alert
                    variant={'error'}
                    className={style.varsel}
                >{`Feil godkjenning av vedtak: [${error.status}] ${error.info?.melding || error.message}`}</Alert>
            )}
            {rolleForBehandling === SaksbehandlerRolle.BESLUTTER && (
                <Button
                    variant={'primary'}
                    loading={isLoading}
                    onClick={() => {
                        godkjennVedtak()
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
