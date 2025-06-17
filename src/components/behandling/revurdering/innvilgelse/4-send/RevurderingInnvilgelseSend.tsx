import { VedtakSeksjon } from '~/components/behandling/vedtak-layout/seksjon/VedtakSeksjon';
import { HStack } from '@navikt/ds-react';
import AvsluttBehandling from '~/components/saksoversikt/avsluttBehandling/AvsluttBehandling';
import router from 'next/router';
import { BehandlingSendTilBeslutning } from '~/components/behandling/send-og-godkjenn/BehandlingSendTilBeslutning';
import { BehandlingGodkjenn } from '~/components/behandling/send-og-godkjenn/BehandlingGodkjenn';
import { BehandlingStatus, RevurderingResultat } from '~/types/BehandlingTypes';
import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import {
    RevurderingInnvilgelseVedtakContext,
    useRevurderingInnvilgelseSkjema,
} from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { useGodkjennBehandling } from '~/components/behandling/send-og-godkjenn/useGodkjennBehandling';
import { useSendRevurderingVedtak } from '~/components/behandling/revurdering/useSendRevurderingVedtak';
import { VedtakRevurderInnvilgelseDTO } from '~/types/VedtakTyper';

export const RevurderingInnvilgelseKnapper = () => {
    const { behandling } = useRevurderingBehandling();
    const vedtakSkjema = useRevurderingInnvilgelseSkjema();
    const { innloggetSaksbehandler } = useSaksbehandler();

    const {
        sendRevurderingTilBeslutning,
        sendRevurderingTilBeslutningLaster,
        sendRevurderingTilBeslutningError,
    } = useSendRevurderingVedtak(behandling);

    const { godkjennVedtak, godkjennVedtakLaster, godkjennVedtakError } =
        useGodkjennBehandling(behandling);

    const kanAvslutteBehandling =
        (behandling.status === BehandlingStatus.KLAR_TIL_BEHANDLING ||
            behandling.status === BehandlingStatus.UNDER_BEHANDLING) &&
        behandling.avbrutt === null &&
        behandling.saksbehandler === innloggetSaksbehandler.navIdent;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <HStack justify="space-between">
                    {kanAvslutteBehandling && (
                        <AvsluttBehandling
                            saksnummer={behandling.saksnummer}
                            behandlingsId={behandling.id}
                            button={{
                                size: 'medium',
                            }}
                            onSuccess={() => {
                                router.push(`/sak/${behandling.saksnummer}`);
                            }}
                        />
                    )}
                    <BehandlingSendTilBeslutning
                        send={() => sendRevurderingTilBeslutning(tilBeslutningDTO(vedtakSkjema))}
                        laster={sendRevurderingTilBeslutningLaster}
                        serverfeil={sendRevurderingTilBeslutningError}
                        validering={() => ({
                            errors: [],
                            warnings: [],
                        })}
                    />
                </HStack>
                <div>
                    <BehandlingGodkjenn
                        godkjenn={godkjennVedtak}
                        laster={godkjennVedtakLaster}
                        error={godkjennVedtakError}
                    />
                </div>
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
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
