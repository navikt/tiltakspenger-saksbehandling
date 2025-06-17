import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import { RevurderingResultat } from '~/types/BehandlingTypes';
import { RevurderingInnvilgelseBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { useRevurderingInnvilgelseSkjema } from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';

export const RevurderingInnvilgelseBrev = () => {
    const { behandling, rolleForBehandling } = useRevurderingBehandling();
    const vedtak = useRevurderingInnvilgelseSkjema();

    const { brevtekstRef } = vedtak;

    const forhåndsvisningDto: RevurderingInnvilgelseBrevForhåndsvisningDTO = {
        resultat: RevurderingResultat.REVURDERING_INNVILGELSE,
        fritekst: vedtak.getBrevtekst(),
        virkningsperiode: vedtak.behandlingsperiode,
    };

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for revurdering av innvilgelse'}
            behandling={behandling}
            rolle={rolleForBehandling}
            tekstRef={brevtekstRef}
            validering={{
                errors: [],
                warnings: [],
            }}
            forhåndsvisningDto={forhåndsvisningDto}
            hjelpetekst={<div>{'Skal vi ha en egen hjelpetekst for denne?'}</div>}
        />
    );
};
