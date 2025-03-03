import { useSendFørstegangsVedtak } from './useSendFørstegangsVedtak';
import { useFørstegangsVedtakSkjema } from '../context/FørstegangsVedtakContext';
import { BehandlingGodkjenn } from '../../send-og-godkjenn/BehandlingGodkjenn';
import { useGodkjennBehandling } from '../../send-og-godkjenn/useGodkjennBehandling';
import { BehandlingSendTilBeslutning } from '../../send-og-godkjenn/BehandlingSendTilBeslutning';
import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { useFørstegangsbehandling } from '../../BehandlingContext';
import { førstegangsVedtakValidering } from '../førstegangsVedtakValidering';

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
                    send={sendTilBeslutning}
                    laster={sendTilBeslutningLaster}
                    serverfeil={sendTilBeslutningError}
                    validering={() => førstegangsVedtakValidering(behandling, vedtakSkjema)}
                />

                <BehandlingGodkjenn
                    godkjenn={godkjennVedtak}
                    laster={godkjennVedtakLaster}
                    error={godkjennVedtakError}
                />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
