import { useRevurderingOmgjøring } from '~/components/behandling/context/BehandlingContext';
import { RevurderingOmgjøringBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { RevurderingResultat } from '~/types/Revurdering';
import { revurderingOmgjøringValidering } from '~/components/behandling/revurdering/omgjøring/revurderingOmgjøringValidering';
import {
    RevurderingOmgjøringContext,
    useRevurderingOmgjøringSkjema,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { useSak } from '~/context/sak/SakContext';
import { RevurderingBrevHjelpetekst } from '~/components/behandling/revurdering/felles/RevurderingBrevHjelpetekst';

export const RevurderingOmgjøringBrev = () => {
    const { behandling } = useRevurderingOmgjøring();
    const skjema = useRevurderingOmgjøringSkjema();
    const { sak } = useSak();

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for revurdering av innvilgelse'}
            validering={revurderingOmgjøringValidering(behandling, skjema, sak)}
            hentDto={() => tilForhåndsvisningDTO(skjema)}
            hjelpetekst={<RevurderingBrevHjelpetekst />}
        />
    );
};

const tilForhåndsvisningDTO = (
    skjema: RevurderingOmgjøringContext,
): RevurderingOmgjøringBrevForhåndsvisningDTO => {
    const { innvilgelse, textAreas } = skjema;

    if (!innvilgelse.harValgtPeriode) {
        throw Error('Kan ikke forhåndsvise brev før innvilgelsesperioder er valgt');
    }

    return {
        resultat: RevurderingResultat.OMGJØRING,
        fritekst: textAreas.brevtekst.getValue(),
        innvilgelsesperioder: innvilgelse.innvilgelsesperioder,
        barnetillegg: innvilgelse.harBarnetillegg ? innvilgelse.barnetilleggPerioder : null,
    };
};
