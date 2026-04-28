import { useRevurderingOmgjøring } from '~/lib/behandling/context/BehandlingContext';
import {
    OmgjøringBrevForhåndsvisningDTO,
    OmgjøringInnvilgelseBrevForhåndsvisningDTO,
    OmgjøringOpphørBrevForhåndsvisningDTO,
} from '~/lib/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { Vedtaksbrev } from '~/lib/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { RevurderingResultat } from '~/types/Revurdering';
import { revurderingOmgjøringValidering } from '~/lib/behandling/revurdering/omgjøring/revurderingOmgjøringValidering';
import {
    OmgjøringContext,
    useOmgjøringSkjema,
    useOmgjøringSkjemaDispatch,
} from '~/lib/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { useSak } from '~/context/sak/SakContext';
import { RevurderingBrevHjelpetekst } from '~/lib/behandling/revurdering/felles/RevurderingBrevHjelpetekst';
import { Checkbox, Heading, HStack } from '@navikt/ds-react';

export const RevurderingOmgjøringBrev = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingOmgjøring();

    const skjema = useOmgjøringSkjema();
    const { resultat } = skjema;

    const dispatch = useOmgjøringSkjemaDispatch();

    return (
        <Vedtaksbrev
            header={
                <HStack justify="space-between" align="center">
                    <Heading size={'xsmall'} level={'2'}>
                        Vedtaksbrev for{' '}
                        {resultat === RevurderingResultat.OMGJØRING
                            ? 'revurdering av innvilgelse'
                            : 'opphør'}
                    </Heading>

                    <Checkbox
                        readOnly={skjema.erReadonly}
                        onChange={(e) =>
                            dispatch({
                                type: 'setSkalSendeVedtaksbrev',
                                payload: { skalSendeVedtaksbrev: !e.target.checked },
                            })
                        }
                        checked={
                            (skjema.resultat === RevurderingResultat.OMGJØRING &&
                                skjema.innvilgelse.harValgtPeriode &&
                                !skjema.innvilgelse.skalSendeVedtaksbrev) ||
                            (skjema.resultat === RevurderingResultat.OMGJØRING_OPPHØR &&
                                !skjema.skalSendeVedtaksbrev)
                        }
                    >
                        Ikke send vedtaksbrev
                    </Checkbox>
                </HStack>
            }
            validering={revurderingOmgjøringValidering(behandling, skjema, sak)}
            hentDto={() => tilForhåndsvisningDTO(skjema)}
            hjelpetekst={<RevurderingBrevHjelpetekst />}
            readonly={
                skjema.erReadonly ||
                (skjema.resultat === RevurderingResultat.OMGJØRING &&
                    skjema.innvilgelse.harValgtPeriode &&
                    !skjema.innvilgelse.skalSendeVedtaksbrev) ||
                (skjema.resultat === RevurderingResultat.OMGJØRING_OPPHØR &&
                    !skjema.skalSendeVedtaksbrev)
            }
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
