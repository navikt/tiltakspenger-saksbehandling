import { BehandlingSendTilBeslutning } from '../../../send-og-godkjenn/BehandlingSendTilBeslutning';
import { useSendRevurderingVedtak } from '../../useSendRevurderingVedtak';
import { useGodkjennBehandling } from '../../../send-og-godkjenn/useGodkjennBehandling';
import { BehandlingGodkjenn } from '../../../send-og-godkjenn/BehandlingGodkjenn';
import { useRevurderingBehandling } from '../../../BehandlingContext';
import {
    RevurderingStansVedtakContext,
    useRevurderingStansVedtak,
} from '../RevurderingStansVedtakContext';
import { VedtakSeksjon } from '../../../vedtak-layout/seksjon/VedtakSeksjon';
import { Button } from '@navikt/ds-react';
import NextLink from 'next/link';
import React from 'react';

import style from './RevurderingStansSend.module.css';
import { revurderingStansValidering } from '../revurderingStansValidering';
import { VedtakRevurderingDTO } from '~/types/VedtakTyper';
import { RevurderingResultat } from '~/types/BehandlingTypes';

export const RevurderingStansSend = () => {
    const revurderingVedtak = useRevurderingStansVedtak();

    const { behandling } = useRevurderingBehandling();

    const {
        sendRevurderingTilBeslutning,
        sendRevurderingTilBeslutningLaster,
        sendRevurderingTilBeslutningError,
    } = useSendRevurderingVedtak(behandling);

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
                        send={() =>
                            sendRevurderingTilBeslutning(tilBeslutningDTO(revurderingVedtak))
                        }
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

const tilBeslutningDTO = (vedtak: RevurderingStansVedtakContext): VedtakRevurderingDTO => {
    return {
        type: RevurderingResultat.STANS,
        begrunnelse: vedtak.getBegrunnelse(),
        fritekstTilVedtaksbrev: vedtak.getBrevtekst(),
        stans: {
            stansFraOgMed: vedtak.stansdato,
            valgteHjemler: vedtak.valgtHjemmelHarIkkeRettighet,
        },
    };
};
