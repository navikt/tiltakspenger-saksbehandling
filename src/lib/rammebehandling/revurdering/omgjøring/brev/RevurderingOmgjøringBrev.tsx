import { useRevurderingOmgjøring } from '~/lib/rammebehandling/context/BehandlingContext';
import {
    OmgjøringBrevForhåndsvisningDTO,
    OmgjøringInnvilgelseBrevForhåndsvisningDTO,
    OmgjøringOpphørBrevForhåndsvisningDTO,
} from '~/lib/rammebehandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { RammebehandlingVedtaksbrev } from '~/lib/rammebehandling/felles/vedtaksbrev/RammebehandlingVedtaksbrev';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { revurderingOmgjøringValidering } from '~/lib/rammebehandling/revurdering/omgjøring/revurderingOmgjøringValidering';
import {
    OmgjøringContext,
    useOmgjøringSkjema,
} from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { useSak } from '~/lib/sak/SakContext';
import { RevurderingBrevHjelpetekst } from '~/lib/rammebehandling/revurdering/felles/RevurderingBrevHjelpetekst';
import { erFullstendigPeriode } from '~/utils/periode';

export const RevurderingOmgjøringBrev = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingOmgjøring();

    const skjema = useOmgjøringSkjema();
    const { resultat } = skjema;

    return (
        <RammebehandlingVedtaksbrev
            tittel={`Vedtaksbrev for ${resultat === RevurderingResultat.OMGJØRING ? 'revurdering av innvilgelse' : 'opphør'}`}
            validering={revurderingOmgjøringValidering(behandling, skjema, sak)}
            hentDto={() => tilForhåndsvisningDTO(skjema)}
            hjelpetekst={<RevurderingBrevHjelpetekst />}
        />
    );
};

const tilForhåndsvisningDTO = (skjema: OmgjøringContext): OmgjøringBrevForhåndsvisningDTO => {
    const { resultat, textAreas } = skjema;

    switch (resultat) {
        case RevurderingResultat.OMGJØRING_OPPHØR: {
            const { vedtaksperiode } = skjema;

            if (!erFullstendigPeriode(vedtaksperiode)) {
                throw Error('Kan ikke forhåndsvise brev før perioden som opphøres er valgt');
            }

            return {
                resultat: RevurderingResultat.OMGJØRING_OPPHØR,
                fritekst: textAreas.brevtekst.getValue(),
                valgteHjemler: skjema.valgteHjemler,
                vedtaksperiode,
            } satisfies OmgjøringOpphørBrevForhåndsvisningDTO;
        }

        case RevurderingResultat.OMGJØRING: {
            const { innvilgelse } = skjema;

            if (!innvilgelse.harValgtPeriode) {
                throw Error('Kan ikke forhåndsvise brev før innvilgelsesperioder er valgt');
            }

            return {
                resultat: RevurderingResultat.OMGJØRING,
                fritekst: textAreas.brevtekst.getValue(),
                innvilgelsesperioder: innvilgelse.innvilgelsesperioder,
                barnetillegg: innvilgelse.harBarnetillegg ? innvilgelse.barnetilleggPerioder : null,
            } satisfies OmgjøringInnvilgelseBrevForhåndsvisningDTO;
        }

        case RevurderingResultat.OMGJØRING_IKKE_VALGT: {
            throw Error('Kan ikke forhåndsvise brev før resultat er valgt');
        }
    }
};
