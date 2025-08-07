import { useRevurderingStansVedtak } from '../RevurderingStansVedtakContext';
import { useRevurderingBehandling } from '../../../BehandlingContext';
import React from 'react';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { revurderingStansValidering } from '~/components/behandling/revurdering/stans/revurderingStansValidering';
import { RevurderingResultat } from '~/types/BehandlingTypes';
import { RevurderingStansBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';

export const RevurderingStansBrev = () => {
    const vedtak = useRevurderingStansVedtak();
    const { brevtekst } = vedtak.textAreas;

    const { behandling, rolleForBehandling } = useRevurderingBehandling();

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for stans'}
            behandling={behandling}
            rolle={rolleForBehandling}
            tekstRef={brevtekst.ref}
            validering={revurderingStansValidering(vedtak)}
            hentDto={(): RevurderingStansBrevForhåndsvisningDTO => ({
                fritekst: brevtekst.get(),
                stansDato: vedtak.stansdato,
                valgteHjemler: vedtak.valgtHjemmelHarIkkeRettighet,
                resultat: RevurderingResultat.STANS,
            })}
        />
    );
};
