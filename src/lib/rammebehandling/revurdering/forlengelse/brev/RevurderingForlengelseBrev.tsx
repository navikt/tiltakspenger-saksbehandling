import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { RevurderingForlengelseBrevForhåndsvisningDTO } from '~/lib/rammebehandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { tilOppdaterBarnetilleggDTO } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import { RammebehandlingVedtaksbrev } from '~/lib/rammebehandling/felles/vedtaksbrev/RammebehandlingVedtaksbrev';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import {
    hentForlengelseTilOgMed,
    RevurderingForlengelseContext,
    useForlengelseBehandling,
    useRevurderingForlengelseSkjema,
} from '~/lib/rammebehandling/context/revurdering/revurderingForlengelseSkjemaContext';
import { revurderingForlengelseValidering } from '~/lib/rammebehandling/revurdering/forlengelse/revurderingForlengelseValidering';
import { useSak } from '~/lib/sak/SakContext';
import { RevurderingBrevHjelpetekst } from '~/lib/rammebehandling/revurdering/felles/RevurderingBrevHjelpetekst';
import { nonNullish } from '~/utils/object';

export const RevurderingForlengelseBrev = () => {
    const behandling = useForlengelseBehandling();
    const skjema = useRevurderingForlengelseSkjema();
    const { sak } = useSak();

    return (
        <RammebehandlingVedtaksbrev
            tittel={'Vedtaksbrev for forlengelse'}
            validering={revurderingForlengelseValidering(behandling, skjema, sak)}
            hentDto={() => tilForhåndsvisningDTO(behandling, skjema)}
            hjelpetekst={<RevurderingBrevHjelpetekst />}
        />
    );
};

const tilForhåndsvisningDTO = (
    behandling: Rammebehandling,
    skjema: RevurderingForlengelseContext,
): RevurderingForlengelseBrevForhåndsvisningDTO => {
    const { innvilgelse, textAreas, harEndretBarnetillegg } = skjema;

    if (!innvilgelse.harValgtPeriode) {
        throw Error('Kan ikke forhåndsvise brev før til og med-dato og tiltak er valgt');
    }

    return {
        resultat: RevurderingResultat.FORLENGELSE,
        fritekst: textAreas.brevtekst.getValue(),
        tilOgMed: nonNullish(hentForlengelseTilOgMed(skjema)),
        internDeltakelseId: innvilgelse.innvilgelsesperioder.atNonNull(-1).internDeltakelseId,
        barnetillegg: harEndretBarnetillegg
            ? tilOppdaterBarnetilleggDTO(innvilgelse, textAreas.barnetilleggBegrunnelse.getValue())
            : null,
    };
};
