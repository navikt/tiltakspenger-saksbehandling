import { useRevurderingBehandling } from '../../../BehandlingContext';
import {
    RevurderingStansVedtakContext,
    useRevurderingStansVedtak,
} from '../RevurderingStansVedtakContext';
import React from 'react';
import { revurderingStansValidering } from '../revurderingStansValidering';
import { RevurderingVedtakStansDTO } from '~/types/VedtakTyper';
import { RevurderingResultat } from '~/types/BehandlingTypes';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';

export const RevurderingStansSend = () => {
    const vedtak = useRevurderingStansVedtak();
    const { behandling } = useRevurderingBehandling();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(vedtak),
        vedtak,
        validerVedtak: () => revurderingStansValidering(vedtak),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (vedtak: RevurderingStansVedtakContext): RevurderingVedtakStansDTO => {
    return {
        resultat: RevurderingResultat.STANS,
        begrunnelseVilkårsvurdering: vedtak.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: vedtak.textAreas.brevtekst.getValue(),
        stansFraOgMed: vedtak.stansdato,
        valgteHjemler: vedtak.valgtHjemmelHarIkkeRettighet,
    };
};
