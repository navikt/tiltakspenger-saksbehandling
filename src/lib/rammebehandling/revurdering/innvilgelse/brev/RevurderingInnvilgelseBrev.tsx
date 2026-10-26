import { useRevurderingBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { RevurderingInnvilgelseBrevForhåndsvisningDTO } from '~/lib/rammebehandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { RammebehandlingVedtaksbrev } from '~/lib/rammebehandling/felles/vedtaksbrev/RammebehandlingVedtaksbrev';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { revurderingInnvilgelseValidering } from '~/lib/rammebehandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import {
    RevurderingInnvilgelseContext,
    useRevurderingInnvilgelseSkjema,
} from '~/lib/rammebehandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { useSak } from '~/lib/sak/SakContext';
import { RevurderingBrevHjelpetekst } from '~/lib/rammebehandling/revurdering/felles/RevurderingBrevHjelpetekst';

export const RevurderingInnvilgelseBrev = () => {
    const { behandling } = useRevurderingBehandling();
    const skjema = useRevurderingInnvilgelseSkjema();
    const { sak } = useSak();

    return (
        <RammebehandlingVedtaksbrev
            tittel={'Vedtaksbrev for revurdering av innvilgelse'}
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
