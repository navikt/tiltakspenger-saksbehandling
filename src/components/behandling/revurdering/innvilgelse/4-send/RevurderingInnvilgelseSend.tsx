import { RevurderingResultat } from '~/types/BehandlingTypes';
import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import {
    RevurderingInnvilgelseVedtakContext,
    useRevurderingInnvilgelseSkjema,
} from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';
import { useSendRevurderingVedtak } from '~/components/behandling/revurdering/useSendRevurderingVedtak';
import { VedtakRevurderInnvilgelseDTO } from '~/types/VedtakTyper';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';

export const RevurderingInnvilgelseKnapper = () => {
    const { behandling } = useRevurderingBehandling();
    const vedtakSkjema = useRevurderingInnvilgelseSkjema();

    const {
        sendRevurderingTilBeslutning,
        sendRevurderingTilBeslutningLaster,
        sendRevurderingTilBeslutningError,
    } = useSendRevurderingVedtak(behandling);

    return (
        <BehandlingSendOgGodkjenn
            behandling={behandling}
            sendTilBeslutningProps={{
                send: () => sendRevurderingTilBeslutning(tilBeslutningDTO(vedtakSkjema)),
                laster: sendRevurderingTilBeslutningLaster,
                feil: sendRevurderingTilBeslutningError,
                validering: () => ({
                    errors: [],
                    warnings: [],
                }),
            }}
        />
    );
};

const tilBeslutningDTO = (
    vedtak: RevurderingInnvilgelseVedtakContext,
): VedtakRevurderInnvilgelseDTO => {
    return {
        type: RevurderingResultat.REVURDERING_INNVILGELSE,
        begrunnelse: vedtak.getBegrunnelse(),
        fritekstTilVedtaksbrev: vedtak.getBrevtekst(),
        innvilgelse: {
            innvilgelsesperiode: vedtak.behandlingsperiode,
            valgteTiltaksdeltakelser: vedtak.valgteTiltaksdeltakelser,
        },
    };
};
