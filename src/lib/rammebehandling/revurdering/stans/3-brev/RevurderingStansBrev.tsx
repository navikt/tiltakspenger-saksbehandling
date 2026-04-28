import { Vedtaksbrev } from '~/lib/rammebehandling/felles/vedtaksbrev/Vedtaksbrev';
import { revurderingStansValidering } from '~/lib/rammebehandling/revurdering/stans/revurderingStansValidering';
import { RevurderingStansBrevForhåndsvisningDTO } from '~/lib/rammebehandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { RevurderingResultat } from '~/types/Revurdering';
import {
    RevurderingStansContext,
    useRevurderingStansSkjema,
    useRevurderingStansSkjemaDispatch,
} from '~/lib/rammebehandling/context/revurdering/revurderingStansSkjemaContext';
import { RevurderingBrevHjelpetekst } from '~/lib/rammebehandling/revurdering/felles/RevurderingBrevHjelpetekst';
import { HStack, Heading, Checkbox } from '@navikt/ds-react';

export const RevurderingStansBrev = () => {
    const skjema = useRevurderingStansSkjema();

    const dispatch = useRevurderingStansSkjemaDispatch();

    return (
        <Vedtaksbrev
            header={
                <HStack justify="space-between" align="center">
                    <Heading size={'xsmall'} level={'2'}>
                        Vedtaksbrev for stans
                    </Heading>

                    <Checkbox
                        readOnly={skjema.erReadonly}
                        onChange={(e) =>
                            dispatch({
                                type: 'setSkalSendeVedtaksbrev',
                                payload: { skalSendeVedtaksbrev: !e.target.checked },
                            })
                        }
                        checked={!skjema.skalSendeVedtaksbrev}
                    >
                        Ikke send vedtaksbrev
                    </Checkbox>
                </HStack>
            }
            validering={revurderingStansValidering(skjema)}
            hentDto={(): RevurderingStansBrevForhåndsvisningDTO => tilForhåndsvisningDTO(skjema)}
            hjelpetekst={<RevurderingBrevHjelpetekst />}
            readonly={skjema.erReadonly || !skjema.skalSendeVedtaksbrev}
        />
    );
};

const tilForhåndsvisningDTO = (
    skjema: RevurderingStansContext,
): RevurderingStansBrevForhåndsvisningDTO => {
    const { hjemlerForStans, fraDato, textAreas, harValgtStansFraFørsteDagSomGirRett } = skjema;

    return {
        ...(harValgtStansFraFørsteDagSomGirRett
            ? {
                  harValgtStansFraFørsteDagSomGirRett,
                  stansFraOgMed: null,
              }
            : {
                  harValgtStansFraFørsteDagSomGirRett,
                  stansFraOgMed: fraDato!,
              }),
        fritekst: textAreas.brevtekst.getValue(),
        valgteHjemler: hjemlerForStans,
        resultat: RevurderingResultat.STANS,
    };
};
