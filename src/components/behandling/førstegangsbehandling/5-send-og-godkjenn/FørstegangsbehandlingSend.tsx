import { useSendFørstegangsbehandling } from './useSendFørstegangsbehandling';
import {
    useFørstegangsbehandling,
    useFørstegangsVedtakSkjema,
} from '../context/FørstegangsbehandlingContext';
import { BehandlingGodkjenn } from '../../send-og-godkjenn/BehandlingGodkjenn';
import { useGodkjennBehandling } from '../../send-og-godkjenn/useGodkjennBehandling';
import { BehandlingSendTilBeslutning } from '../../send-og-godkjenn/BehandlingSendTilBeslutning';
import { VedtakSeksjon } from '../../vedtak/seksjon/VedtakSeksjon';

import style from './FørstegangsbehandlingSend.module.css';

export const FørstegangsbehandlingSend = () => {
    const { behandling } = useFørstegangsbehandling();
    const vedtak = useFørstegangsVedtakSkjema();

    const { sendTilBeslutter, sendTilBeslutterLaster, sendTilBeslutterError } =
        useSendFørstegangsbehandling(vedtak, behandling);

    const { godkjennVedtak, godkjennVedtakLaster, godkjennVedtakError } =
        useGodkjennBehandling(behandling);

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre className={style.knapper}>
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
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
