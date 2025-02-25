import { useSendFørstegangsbehandling } from './useSendFørstegangsbehandling';
import { useFørstegangsbehandling } from '../FørstegangsbehandlingContext';
import { BehandlingGodkjenn } from '../../send-og-godkjenn/BehandlingGodkjenn';
import { useGodkjennBehandling } from '../../send-og-godkjenn/useGodkjennBehandling';
import { BehandlingSendTilBeslutning } from '../../send-og-godkjenn/BehandlingSendTilBeslutning';

export const FørstegangsbehandlingSendOgGodkjenn = () => {
    const { behandling, vedtak } = useFørstegangsbehandling();

    const { sendTilBeslutter, sendTilBeslutterLaster, sendTilBeslutterError } =
        useSendFørstegangsbehandling(vedtak, behandling);

    const { godkjennVedtak, godkjennVedtakLaster, godkjennVedtakError } =
        useGodkjennBehandling(behandling);

    return (
        <>
            <BehandlingSendTilBeslutning
                sendTilBeslutning={sendTilBeslutter}
                isLoading={sendTilBeslutterLaster}
                error={sendTilBeslutterError}
            />
            <BehandlingGodkjenn
                godkjennBehandling={godkjennVedtak}
                isLoading={godkjennVedtakLaster}
                error={godkjennVedtakError}
            />
        </>
    );
};
