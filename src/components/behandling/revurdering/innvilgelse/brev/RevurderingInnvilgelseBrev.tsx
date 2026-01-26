import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { RevurderingInnvilgelseBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { RevurderingResultat } from '~/types/Revurdering';
import { revurderingInnvilgelseValidering } from '~/components/behandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import {
    RevurderingInnvilgelseContext,
    useRevurderingInnvilgelseSkjema,
} from '~/components/behandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { useSak } from '~/context/sak/SakContext';
import { RevurderingBrevHjelpetekst } from '~/components/behandling/revurdering/felles/RevurderingBrevHjelpetekst';

export const RevurderingInnvilgelseBrev = () => {
    const { behandling } = useRevurderingBehandling();
    const skjema = useRevurderingInnvilgelseSkjema();
    const { sak } = useSak();

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for revurdering av innvilgelse'}
            validering={revurderingInnvilgelseValidering(behandling, skjema, sak)}
            hentDto={() => tilForhåndsvisningDTO(skjema)}
            hjelpetekst={<RevurderingBrevHjelpetekst />}
        />
    );
};

const tilForhåndsvisningDTO = (
    skjema: RevurderingInnvilgelseContext,
): RevurderingInnvilgelseBrevForhåndsvisningDTO => {
    const { innvilgelse, textAreas } = skjema;

    if (!innvilgelse.harValgtPeriode) {
        throw Error('Kan ikke forhåndsvise brev før innvilgelsesperioder er valgt');
    }

    return {
        resultat: RevurderingResultat.INNVILGELSE,
        fritekst: textAreas.brevtekst.getValue(),
        innvilgelsesperioder: innvilgelse.innvilgelsesperioder,
        barnetillegg: innvilgelse.harBarnetillegg ? innvilgelse.barnetilleggPerioder : null,
    };
};
