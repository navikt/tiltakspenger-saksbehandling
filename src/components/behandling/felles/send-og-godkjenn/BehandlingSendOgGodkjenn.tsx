import { BehandlingData, BehandlingStatus } from '~/types/BehandlingTypes';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { HStack } from '@navikt/ds-react';
import AvsluttBehandlingKnapp from '~/components/behandlingmeny/menyvalg/AvsluttBehandlingKnapp';
import router from 'next/router';
import { BehandlingSendTilBeslutning } from '~/components/behandling/felles/send-og-godkjenn/send-til-beslutning/BehandlingSendTilBeslutning';
import { BehandlingGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/godkjenn/BehandlingGodkjenn';
import { OppdaterBehandling } from '~/components/behandling/felles/oppdater/OppdaterBehandling';
import { BehandlingVedtakDTO } from '~/types/VedtakTyper';
import { ValideringResultat } from '~/types/Validering';

import style from './BehandlingSendOgGodkjenn.module.css';

type Props = {
    behandling: BehandlingData;
    hentVedtakDTO: () => BehandlingVedtakDTO;
    validering: () => ValideringResultat;
};

export const BehandlingSendOgGodkjenn = ({ behandling, hentVedtakDTO, validering }: Props) => {
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
                        <AvsluttBehandlingKnapp
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
                    <HStack gap={'2'}>
                        <OppdaterBehandling behandling={behandling} hentVedtakDTO={hentVedtakDTO} />
                        <BehandlingSendTilBeslutning
                            behandling={behandling}
                            hentVedtakDTO={hentVedtakDTO}
                            validering={validering}
                        />
                    </HStack>
                </HStack>
                <div className={style.godkjentWrapper}>
                    <BehandlingGodkjenn behandling={behandling} />
                </div>
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
