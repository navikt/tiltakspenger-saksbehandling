import { BehandlingSendTilBeslutning } from '../../../send-og-godkjenn/BehandlingSendTilBeslutning';
import { useSendRevurderingVedtak } from '../useSendRevurderingVedtak';
import { useGodkjennBehandling } from '../../../send-og-godkjenn/useGodkjennBehandling';
import { BehandlingGodkjenn } from '../../../send-og-godkjenn/BehandlingGodkjenn';
import { useRevurderingBehandling } from '../../../BehandlingContext';
import { useRevurderingVedtak } from '../../RevurderingVedtakContext';
import { VedtakSeksjon } from '../../../vedtak-layout/seksjon/VedtakSeksjon';

import style from './RevurderingStansSend.module.css';

export const RevurderingStansSend = () => {
    const revurderingVedtak = useRevurderingVedtak();

    const { behandling } = useRevurderingBehandling();

    const {
        sendRevurderingTilBeslutning,
        sendRevurderingTilBeslutningLaster,
        sendRevurderingTilBeslutningError,
    } = useSendRevurderingVedtak(behandling, revurderingVedtak);

    const { godkjennVedtak, godkjennVedtakLaster, godkjennVedtakError } =
        useGodkjennBehandling(behandling);

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre className={style.knapper}>
                <BehandlingSendTilBeslutning
                    send={sendRevurderingTilBeslutning}
                    laster={sendRevurderingTilBeslutningLaster}
                    serverfeil={sendRevurderingTilBeslutningError}
                    // TODO: validering
                    validering={() => ({
                        warnings: [],
                        errors: [],
                    })}
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
