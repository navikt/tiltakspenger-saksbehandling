import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { revurderingStansValidering } from '~/components/behandling/revurdering/stans/revurderingStansValidering';
import { RevurderingStansBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { RevurderingResultat } from '~/types/Revurdering';
import {
    RevurderingStansContext,
    useRevurderingStansSkjema,
} from '~/components/behandling/context/revurdering/revurderingStansSkjemaContext';
import { RevurderingBrevHjelpetekst } from '~/components/behandling/revurdering/felles/RevurderingBrevHjelpetekst';

export const RevurderingStansBrev = () => {
    const skjema = useRevurderingStansSkjema();

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for stans'}
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
                  stansFraOgMed: fraDato!,
              }),
        fritekst: textAreas.brevtekst.getValue(),
        valgteHjemler: hjemlerForStans,
        resultat: RevurderingResultat.STANS,
    };
};
