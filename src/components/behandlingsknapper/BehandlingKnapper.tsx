import { Button, HStack, Loader } from '@navikt/ds-react';
import { RefObject, useContext } from 'react';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { kanBeslutteForBehandling, kanSaksbehandleForBehandling } from '../../utils/tilganger';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import Varsel from '../varsel/Varsel';
import { useGodkjennBehandling } from '../../hooks/useGodkjennBehandling';
import { useSendTilBeslutter } from '../../hooks/useSendTilBeslutter';
import { useSaksbehandler } from '../../hooks/useSaksbehandler';

type Props = {
    godkjennRef: RefObject<HTMLDialogElement>;
};

export const Behandlingsknapper = ({ godkjennRef }: Props) => {
    const { behandlingId, sakId } = useContext(BehandlingContext);
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
    const { godkjennerBehandling, godkjennBehandlingError } = useGodkjennBehandling(
        behandlingId,
        sakId,
    );
    const { sendTilBeslutter, senderTilBeslutter, sendTilBeslutterError } =
        useSendTilBeslutter(behandlingId);

    if (isLoading || !valgtBehandling) {
        return <Loader />;
    }

    const kanBeslutte = kanBeslutteForBehandling(
        valgtBehandling.status,
        innloggetSaksbehandler,
        valgtBehandling.saksbehandler,
        valgtBehandling.beslutter,
    );

    const kanSaksbehandle = kanSaksbehandleForBehandling(
        valgtBehandling.status,
        innloggetSaksbehandler,
        valgtBehandling.saksbehandler,
    );

    const åpneGodkjennModal = () => {
        godkjennRef.current?.showModal();
    };

    return (
        <>
            {godkjennBehandlingError ? (
                <Varsel
                    variant="error"
                    melding={`Kunne ikke godkjenne vedtaket (${godkjennBehandlingError.status} ${godkjennBehandlingError.info})`}
                />
            ) : null}
            {sendTilBeslutterError ? (
                <Varsel
                    variant="error"
                    melding={`Kunne ikke sende til beslutter (${sendTilBeslutterError.status} ${sendTilBeslutterError.info})`}
                />
            ) : null}
            <HStack justify="start" gap="3" align="end">
                {kanBeslutte && (
                    <Button
                        type="submit"
                        size="small"
                        loading={godkjennerBehandling}
                        onClick={åpneGodkjennModal}
                    >
                        Godkjenn vedtaket
                    </Button>
                )}
                {kanSaksbehandle && (
                    <Button
                        type="submit"
                        size="small"
                        loading={senderTilBeslutter}
                        onClick={() => {
                            sendTilBeslutter();
                        }}
                    >
                        Send til beslutter
                    </Button>
                )}
            </HStack>
        </>
    );
};
