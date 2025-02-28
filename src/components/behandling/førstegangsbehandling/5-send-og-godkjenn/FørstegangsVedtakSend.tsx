import { useSendFørstegangsVedtak } from './useSendFørstegangsVedtak';
import { useFørstegangsVedtakSkjema } from '../context/FørstegangsVedtakContext';
import { BehandlingGodkjenn } from '../../send-og-godkjenn/BehandlingGodkjenn';
import { useGodkjennBehandling } from '../../send-og-godkjenn/useGodkjennBehandling';
import { BehandlingSendTilBeslutning } from '../../send-og-godkjenn/BehandlingSendTilBeslutning';
import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { useFørstegangsbehandling } from '../../BehandlingContext';

import style from './FørstegangsVedtakSend.module.css';

export const FørstegangsVedtakSend = () => {
    const { behandling } = useFørstegangsbehandling();

    const vedtakSkjema = useFørstegangsVedtakSkjema();

    const { sendTilBeslutning, sendTilBeslutningLaster, sendTilBeslutningError } =
        useSendFørstegangsVedtak(behandling, vedtakSkjema);

    const { godkjennVedtak, godkjennVedtakLaster, godkjennVedtakError } =
        useGodkjennBehandling(behandling);

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre className={style.knapper}>
                <BehandlingSendTilBeslutning
                    sendTilBeslutning={sendTilBeslutning}
                    isLoading={sendTilBeslutningLaster}
                    error={sendTilBeslutningError}
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
