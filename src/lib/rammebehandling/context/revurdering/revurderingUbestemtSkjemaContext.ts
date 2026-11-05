import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';

// En ubestemt revurdering har ingen skjemafelter, siden den må konverteres til en annen type før den kan behandles.
export type RevurderingUbestemtState = {
    resultat: RevurderingResultat.UBESTEMT;
};
