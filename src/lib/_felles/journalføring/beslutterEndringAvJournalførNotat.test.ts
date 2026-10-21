import { describe, expect, test } from '@jest/globals';
import { beslutterEndringAvJournalførNotat } from '~/lib/_felles/journalføring/beslutterEndringAvJournalførNotat';

describe('beslutterEndringAvJournalførNotat', () => {
    test('viser lagret endring når beslutter ikke redigerer', () => {
        const lagretEndring = { saksbehandler: true, beslutter: false };

        expect(
            beslutterEndringAvJournalførNotat({
                lagretEndring,
                lagretValg: false,
                skjemaValg: true,
                beslutterRedigerer: false,
            }),
        ).toEqual(lagretEndring);
    });

    test('viser ulagret endring når beslutter endrer skjemaet', () => {
        expect(
            beslutterEndringAvJournalførNotat({
                lagretEndring: null,
                lagretValg: true,
                skjemaValg: false,
                beslutterRedigerer: true,
            }),
        ).toEqual({ saksbehandler: true, beslutter: false });
    });

    test('viser ingen endring når skjemaet er satt tilbake til saksbehandlers valg', () => {
        expect(
            beslutterEndringAvJournalførNotat({
                lagretEndring: { saksbehandler: true, beslutter: false },
                lagretValg: false,
                skjemaValg: true,
                beslutterRedigerer: true,
            }),
        ).toBeNull();
    });

    test('sammenligner med saksbehandlers valg, ikke beslutters lagrede valg', () => {
        expect(
            beslutterEndringAvJournalførNotat({
                lagretEndring: { saksbehandler: true, beslutter: false },
                lagretValg: false,
                skjemaValg: false,
                beslutterRedigerer: true,
            }),
        ).toEqual({ saksbehandler: true, beslutter: false });
    });
});
