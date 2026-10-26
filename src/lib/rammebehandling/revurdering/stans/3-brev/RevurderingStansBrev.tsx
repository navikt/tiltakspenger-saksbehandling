import { RammebehandlingVedtaksbrev } from '~/lib/rammebehandling/felles/vedtaksbrev/RammebehandlingVedtaksbrev';
import { nonNullish } from '~/utils/object';
import { revurderingStansValidering } from '~/lib/rammebehandling/revurdering/stans/revurderingStansValidering';
import { RevurderingStansBrevForhåndsvisningDTO } from '~/lib/rammebehandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import {
    RevurderingStansContext,
    useRevurderingStansSkjema,
} from '~/lib/rammebehandling/context/revurdering/revurderingStansSkjemaContext';
import { RevurderingBrevHjelpetekst } from '~/lib/rammebehandling/revurdering/felles/RevurderingBrevHjelpetekst';

export const RevurderingStansBrev = () => {
    const skjema = useRevurderingStansSkjema();

    return (
        <RammebehandlingVedtaksbrev
            tittel={'Vedtaksbrev for stans'}
            validering={revurderingStansValidering(skjema)}
            hentDto={(): RevurderingStansBrevForhåndsvisningDTO => tilForhåndsvisningDTO(skjema)}
            hjelpetekst={<RevurderingBrevHjelpetekst />}
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
                  stansFraOgMed: nonNullish(fraDato),
              }),
        fritekst: textAreas.brevtekst.getValue(),
        valgteHjemler: hjemlerForStans,
        resultat: RevurderingResultat.STANS,
    };
};
