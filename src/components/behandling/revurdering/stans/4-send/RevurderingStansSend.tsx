import { BehandlingSendTilBeslutning } from '../../../send-og-godkjenn/BehandlingSendTilBeslutning';
import { useSendRevurderingVedtak } from '../useSendRevurderingVedtak';
import { useGodkjennBehandling } from '../../../send-og-godkjenn/useGodkjennBehandling';
import { BehandlingGodkjenn } from '../../../send-og-godkjenn/BehandlingGodkjenn';
import { useRevurderingBehandling } from '../../../BehandlingContext';
import { useRevurderingVedtak } from '../../RevurderingVedtakContext';
import { VedtakSeksjon } from '../../../vedtak-layout/seksjon/VedtakSeksjon';
import { Button } from '@navikt/ds-react';
import NextLink from 'next/link';
import React from 'react';

import style from './RevurderingStansSend.module.css';
import { revurderingStansValidering } from '../../revurderingStansValidering';

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
                <div>
                    <Button
                        as={NextLink}
                        href={`/sak/${behandling.saksnummer}`}
                        variant="secondary"
                    >
                        Tilbake til saksoversikt
                    </Button>
                </div>
                <div>
                    <BehandlingSendTilBeslutning
                        send={sendRevurderingTilBeslutning}
                        laster={sendRevurderingTilBeslutningLaster}
                        serverfeil={sendRevurderingTilBeslutningError}
                        validering={() => revurderingStansValidering(revurderingVedtak)}
                    />
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
