import { Nullable } from '~/types/UtilTypes';

export type EndringAvJournalførNotat = {
    saksbehandler: boolean;
    beslutter: boolean;
};

export const beslutterEndringAvJournalførNotat = (args: {
    lagretEndring: Nullable<EndringAvJournalførNotat>;
    lagretValg: boolean;
    skjemaValg: boolean;
    beslutterRedigerer: boolean;
}): Nullable<EndringAvJournalførNotat> => {
    if (!args.beslutterRedigerer) {
        return args.lagretEndring;
    }

    const saksbehandlersValg = args.lagretEndring?.saksbehandler ?? args.lagretValg;

    return args.skjemaValg === saksbehandlersValg
        ? null
        : { saksbehandler: saksbehandlersValg, beslutter: args.skjemaValg };
};
