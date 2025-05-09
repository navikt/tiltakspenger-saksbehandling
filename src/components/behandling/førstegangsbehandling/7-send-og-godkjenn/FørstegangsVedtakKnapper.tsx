import { useSendFørstegangsVedtak } from './useSendFørstegangsVedtak';
import { useFørstegangsVedtakSkjema } from '../context/FørstegangsVedtakContext';
import { BehandlingGodkjenn } from '../../send-og-godkjenn/BehandlingGodkjenn';
import { useGodkjennBehandling } from '../../send-og-godkjenn/useGodkjennBehandling';
import { BehandlingSendTilBeslutning } from '../../send-og-godkjenn/BehandlingSendTilBeslutning';
import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { useFørstegangsbehandling } from '../../BehandlingContext';
import { førstegangsVedtakValidering } from '../førstegangsVedtakValidering';

import style from './FørstegangsVedtakKnapper.module.css';
import { HStack } from '@navikt/ds-react';
import AvsluttBehandling from '../../../saksoversikt/avsluttBehandling/AvsluttBehandling';
import { BehandlingStatus } from '../../../../types/BehandlingTypes';
import { useSaksbehandler } from '../../../../context/saksbehandler/SaksbehandlerContext';
import router from 'next/router';

export const FørstegangsVedtakKnapper = () => {
    const { behandling } = useFørstegangsbehandling();
    const vedtakSkjema = useFørstegangsVedtakSkjema();
    const { innloggetSaksbehandler } = useSaksbehandler();

    const { sendTilBeslutning, sendTilBeslutningLaster, sendTilBeslutningError } =
        useSendFørstegangsVedtak(behandling, vedtakSkjema);

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
                        send={sendTilBeslutning}
                        laster={sendTilBeslutningLaster}
                        serverfeil={sendTilBeslutningError}
                        validering={() => førstegangsVedtakValidering(behandling, vedtakSkjema)}
                    />
                </HStack>
                <div className={style.godkjentWrapper}>
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
