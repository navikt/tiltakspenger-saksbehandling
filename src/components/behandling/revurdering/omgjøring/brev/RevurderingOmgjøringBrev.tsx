import { useRevurderingOmgjøring } from '~/components/behandling/context/BehandlingContext';
import {
    OmgjøringBrevForhåndsvisningDTO,
    OmgjøringInnvilgelseBrevForhåndsvisningDTO,
    OmgjøringOpphørBrevForhåndsvisningDTO,
} from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { RevurderingResultat } from '~/types/Revurdering';
import { revurderingOmgjøringValidering } from '~/components/behandling/revurdering/omgjøring/revurderingOmgjøringValidering';
import {
    OmgjøringContext,
    useOmgjøringSkjema,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { useSak } from '~/context/sak/SakContext';
import { RevurderingBrevHjelpetekst } from '~/components/behandling/revurdering/felles/RevurderingBrevHjelpetekst';

export const RevurderingOmgjøringBrev = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingOmgjøring();

    const skjema = useOmgjøringSkjema();
    const { resultat } = skjema;

    return (
        <Vedtaksbrev
            header={`Vedtaksbrev for ${resultat === RevurderingResultat.OMGJØRING ? 'revurdering av innvilgelse' : 'opphør'}`}
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
            return {
                resultat: RevurderingResultat.OMGJØRING_OPPHØR,
                fritekst: textAreas.brevtekst.getValue(),
                valgteHjemler: skjema.valgteHjemler,
                vedtaksperiode: skjema.vedtaksperiode,
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
