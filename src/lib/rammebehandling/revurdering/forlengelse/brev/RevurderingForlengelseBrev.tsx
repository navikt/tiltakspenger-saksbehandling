import { Checkbox, Heading, HStack } from '@navikt/ds-react';
import { RevurderingForlengelseBrevForhåndsvisningDTO } from '~/lib/rammebehandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { Vedtaksbrev } from '~/lib/rammebehandling/felles/vedtaksbrev/Vedtaksbrev';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import {
    hentForlengelseTilOgMed,
    RevurderingForlengelseContext,
    useForlengelseBehandling,
    useRevurderingForlengelseSkjema,
    useRevurderingForlengelseSkjemaDispatch,
} from '~/lib/rammebehandling/context/revurdering/revurderingForlengelseSkjemaContext';
import { revurderingForlengelseValidering } from '~/lib/rammebehandling/revurdering/forlengelse/revurderingForlengelseValidering';
import { useSak } from '~/lib/sak/SakContext';
import { RevurderingBrevHjelpetekst } from '~/lib/rammebehandling/revurdering/felles/RevurderingBrevHjelpetekst';
import { nonNullish } from '~/utils/object';

export const RevurderingForlengelseBrev = () => {
    const behandling = useForlengelseBehandling();
    const skjema = useRevurderingForlengelseSkjema();
    const { sak } = useSak();

    const dispatch = useRevurderingForlengelseSkjemaDispatch();

    const ikkeSendBrev =
        skjema.innvilgelse.harValgtPeriode && !skjema.innvilgelse.skalSendeVedtaksbrev;

    return (
        <Vedtaksbrev
            header={
                <HStack justify="space-between" align="center">
                    <Heading size={'xsmall'} level={'2'}>
                        Vedtaksbrev for forlengelse
                    </Heading>

                    <Checkbox
                        readOnly={skjema.erReadonly}
                        onChange={(e) =>
                            dispatch({
                                type: 'setSkalSendeVedtaksbrev',
                                payload: { skalSendeVedtaksbrev: !e.target.checked },
                            })
                        }
                        checked={ikkeSendBrev}
                    >
                        Ikke send vedtaksbrev
                    </Checkbox>
                </HStack>
            }
            validering={revurderingForlengelseValidering(behandling, skjema, sak)}
            hentDto={() => tilForhåndsvisningDTO(skjema)}
            hjelpetekst={<RevurderingBrevHjelpetekst />}
            readonly={skjema.erReadonly || ikkeSendBrev}
        />
    );
};

const tilForhåndsvisningDTO = (
    skjema: RevurderingForlengelseContext,
): RevurderingForlengelseBrevForhåndsvisningDTO => {
    const { innvilgelse, textAreas, harEndretBarnetillegg } = skjema;

    if (!innvilgelse.harValgtPeriode) {
        throw Error('Kan ikke forhåndsvise brev før til og med-dato er valgt');
    }

    return {
        resultat: RevurderingResultat.FORLENGELSE,
        fritekst: textAreas.brevtekst.getValue(),
        tilOgMed: nonNullish(hentForlengelseTilOgMed(skjema)),
        barnetillegg: harEndretBarnetillegg
            ? innvilgelse.harBarnetillegg
                ? innvilgelse.barnetilleggPerioder
                : []
            : null,
    };
};
