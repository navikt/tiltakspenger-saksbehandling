import { useSendFørstegangsbehandling } from './useSendFørstegangsbehandling';
import { useFørstegangsbehandling } from '../FørstegangsbehandlingContext';
import { BehandlingGodkjenn } from '../../send-og-godkjenn/BehandlingGodkjenn';
import { useGodkjennFørstegangsbehandling } from './useGodkjennFørstegangsbehandling';
import { BehandlingSendTilBeslutter } from '../../send-og-godkjenn/BehandlingSendTilBeslutter';

export const FørstegangsbehandlingSendOgGodkjenn = () => {
    const { behandling, vedtak } = useFørstegangsbehandling();

    const { sendTilBeslutter, sendTilBeslutterLaster, sendTilBeslutterError } =
        useSendFørstegangsbehandling(vedtak, behandling);

    const { godkjennVedtak, godkjennVedtakLaster, godkjennVedtakError } =
        useGodkjennFørstegangsbehandling(behandling);

    return (
        <>
            <BehandlingSendTilBeslutter
                sendTilBeslutter={sendTilBeslutter}
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
