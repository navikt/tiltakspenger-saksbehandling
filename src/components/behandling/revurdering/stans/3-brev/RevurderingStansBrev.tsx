import { useRevurderingStansVedtak } from '../RevurderingStansVedtakContext';
import { useRevurderingBehandling } from '../../../BehandlingContext';
import React from 'react';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { revurderingStansValidering } from '~/components/behandling/revurdering/stans/revurderingStansValidering';
import { RevurderingResultat } from '~/types/BehandlingTypes';
import { RevurderingStansBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';

export const RevurderingStansBrev = () => {
    const revurderingVedtak = useRevurderingStansVedtak();
    const { brevtekstRef } = revurderingVedtak;

    const { behandling, rolleForBehandling } = useRevurderingBehandling();

    const forhåndsvisningDto: RevurderingStansBrevForhåndsvisningDTO = {
        fritekst: revurderingVedtak.brevtekstRef.current?.value ?? '',
        stansDato: revurderingVedtak.stansdato,
        valgteHjemler: revurderingVedtak.valgtHjemmelHarIkkeRettighet,
        resultat: RevurderingResultat.STANS,
    };

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for stans'}
            behandling={behandling}
            rolle={rolleForBehandling}
            tekstRef={brevtekstRef}
            validering={revurderingStansValidering(revurderingVedtak)}
            forhåndsvisningDto={forhåndsvisningDto}
        />
    );
};
