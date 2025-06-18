import { useSendRevurderingVedtak } from '../../useSendRevurderingVedtak';
import { useRevurderingBehandling } from '../../../BehandlingContext';
import {
    RevurderingStansVedtakContext,
    useRevurderingStansVedtak,
} from '../RevurderingStansVedtakContext';
import React from 'react';
import { revurderingStansValidering } from '../revurderingStansValidering';
import { VedtakRevurderTilStansDTO } from '~/types/VedtakTyper';
import { RevurderingResultat } from '~/types/BehandlingTypes';

import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';

export const RevurderingStansSend = () => {
    const revurderingVedtak = useRevurderingStansVedtak();

    const { behandling } = useRevurderingBehandling();

    const {
        sendRevurderingTilBeslutning,
        sendRevurderingTilBeslutningLaster,
        sendRevurderingTilBeslutningError,
    } = useSendRevurderingVedtak(behandling);

    return (
        <BehandlingSendOgGodkjenn
            behandling={behandling}
            sendTilBeslutningProps={{
                send: () => sendRevurderingTilBeslutning(tilBeslutningDTO(revurderingVedtak)),
                laster: sendRevurderingTilBeslutningLaster,
                feil: sendRevurderingTilBeslutningError,
                validering: () => revurderingStansValidering(revurderingVedtak),
            }}
        />
    );
};

const tilBeslutningDTO = (vedtak: RevurderingStansVedtakContext): VedtakRevurderTilStansDTO => {
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
