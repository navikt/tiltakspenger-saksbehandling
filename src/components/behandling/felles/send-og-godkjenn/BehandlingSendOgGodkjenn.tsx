import { BehandlingData, BehandlingStatus } from '~/types/BehandlingTypes';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { VedtakSeksjon } from '~/components/behandling/vedtak-layout/seksjon/VedtakSeksjon';
import { HStack } from '@navikt/ds-react';
import AvsluttBehandling from '~/components/saksoversikt/avsluttBehandling/AvsluttBehandling';
import router from 'next/router';
import {
    BehandlingSendTilBeslutning,
    SendTilBeslutningProps,
} from '~/components/behandling/felles/send-og-godkjenn/send-til-beslutning/BehandlingSendTilBeslutning';
import { BehandlingGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/godkjenn/BehandlingGodkjenn';

import style from './BehandlingSendOgGodkjenn.module.css';

type Props = {
    behandling: BehandlingData;
    sendTilBeslutningProps: SendTilBeslutningProps;
};

export const BehandlingSendOgGodkjenn = ({ behandling, sendTilBeslutningProps }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    const kanAvslutteBehandling =
        (behandling.status === BehandlingStatus.KLAR_TIL_BEHANDLING ||
            behandling.status === BehandlingStatus.UNDER_BEHANDLING) &&
        behandling.avbrutt === null &&
        behandling.saksbehandler === innloggetSaksbehandler.navIdent;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <HStack justify="space-between" className={style.knapper}>
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
                        behandling={behandling}
                        {...sendTilBeslutningProps}
                    />
                </HStack>
                <div className={style.godkjentWrapper}>
                    <BehandlingGodkjenn behandling={behandling} />
                </div>
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
