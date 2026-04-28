import { useRevurderingBehandling } from '~/lib/behandling/context/BehandlingContext';
import { RevurderingInnvilgelseBrevForhåndsvisningDTO } from '~/lib/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { Vedtaksbrev } from '~/lib/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { RevurderingResultat } from '~/types/Revurdering';
import { revurderingInnvilgelseValidering } from '~/lib/behandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import {
    RevurderingInnvilgelseContext,
    useRevurderingInnvilgelseSkjema,
    useRevurderingInnvilgelseSkjemaDispatch,
} from '~/lib/behandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { useSak } from '~/context/sak/SakContext';
import { RevurderingBrevHjelpetekst } from '~/lib/behandling/revurdering/felles/RevurderingBrevHjelpetekst';
import { HStack, Heading, Checkbox } from '@navikt/ds-react';

export const RevurderingInnvilgelseBrev = () => {
    const { behandling } = useRevurderingBehandling();
    const skjema = useRevurderingInnvilgelseSkjema();
    const { sak } = useSak();

    const dispatch = useRevurderingInnvilgelseSkjemaDispatch();

    return (
        <Vedtaksbrev
            header={
                <HStack justify="space-between" align="center">
                    <Heading size={'xsmall'} level={'2'}>
                        Vedtaksbrev for revurdering av innvilgelse
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
                            skjema.innvilgelse.harValgtPeriode &&
                            !skjema.innvilgelse.skalSendeVedtaksbrev
                        }
                    >
                        Ikke send vedtaksbrev
                    </Checkbox>
                </HStack>
            }
            validering={revurderingInnvilgelseValidering(behandling, skjema, sak)}
            hentDto={() => tilForhåndsvisningDTO(skjema)}
            hjelpetekst={<RevurderingBrevHjelpetekst />}
            readonly={
                skjema.erReadonly ||
                (skjema.innvilgelse.harValgtPeriode && !skjema.innvilgelse.skalSendeVedtaksbrev)
            }
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
