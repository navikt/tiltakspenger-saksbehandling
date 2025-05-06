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

export const FørstegangsVedtakKnapper = () => {
    const { behandling } = useFørstegangsbehandling();
    const vedtakSkjema = useFørstegangsVedtakSkjema();

    const { sendTilBeslutning, sendTilBeslutningLaster, sendTilBeslutningError } =
        useSendFørstegangsVedtak(behandling, vedtakSkjema);

    const { godkjennVedtak, godkjennVedtakLaster, godkjennVedtakError } =
        useGodkjennBehandling(behandling);

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <HStack justify="space-between" className={style.knapper}>
                    <AvsluttBehandling
                        saksnummer={behandling.saksnummer}
                        behandlingsId={behandling.id}
                        button={{
                            size: 'medium',
                        }}
                    />

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
