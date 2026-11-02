import { describe, expect, test } from '@jest/globals';
import {
    erMeldekortbehandlingGodkjent,
    erMeldekortbehandlingUnderAktivOmgjøring,
    finnUbehandledeMeldekort,
    formaterMeldeperioder,
    journalførNotatEndringFraBeslutter,
} from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { MeldekortbehandlingStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { BrukersMeldekortKjedeStatus } from '~/lib/meldekort/typer/BrukersMeldekort';
import {
    ANDRE_MANDAG,
    FØRSTE_MANDAG,
    leggTilDager,
    meldekortbehandling,
    meldekortDager,
    meldeperiodebehandling,
    meldeperiodekjede,
} from '~test/meldekort';

describe('erMeldekortbehandlingGodkjent og erMeldekortbehandlingUnderAktivOmgjøring', () => {
    test.each([
        [MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING, false, true],
        [MeldekortbehandlingStatus.UNDER_BEHANDLING, false, true],
        [MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING, false, false],
        [MeldekortbehandlingStatus.UNDER_BESLUTNING, false, false],
        [MeldekortbehandlingStatus.GODKJENT, true, false],
        [MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET, true, false],
        [MeldekortbehandlingStatus.AVBRUTT, false, false],
    ])('%s: godkjent=%s, under aktiv omgjøring=%s', (status, godkjent, underAktivOmgjøring) => {
        const behandling = meldekortbehandling({ status });

        expect(erMeldekortbehandlingGodkjent(behandling)).toBe(godkjent);
        expect(erMeldekortbehandlingUnderAktivOmgjøring(behandling)).toBe(underAktivOmgjøring);
    });
});

describe('finnUbehandledeMeldekort', () => {
    const kjedeMedStatus = (
        fraOgMed: string,
        brukersMeldekortStatus: BrukersMeldekortKjedeStatus,
    ) => meldeperiodekjede(fraOgMed, { brukersMeldekortStatus });

    const mandag = (uker: number) => leggTilDager(FØRSTE_MANDAG, uker * 14);

    const kjeder = Object.values(BrukersMeldekortKjedeStatus).map((status, index) =>
        kjedeMedStatus(mandag(index), status),
    );

    test('finner kjeder der brukers meldekort eller korrigering venter på behandling', () => {
        expect(
            finnUbehandledeMeldekort(kjeder).map((kjede) => kjede.brukersMeldekortStatus),
        ).toEqual([
            BrukersMeldekortKjedeStatus.VENTER_BEHANDLING,
            BrukersMeldekortKjedeStatus.KORRIGERING_VENTER_BEHANDLING,
        ]);
    });

    test('utelater kjeder som allerede er lagt til i skjemaet', () => {
        const venter = kjedeMedStatus(mandag(0), BrukersMeldekortKjedeStatus.VENTER_BEHANDLING);
        const korrigeringVenter = kjedeMedStatus(
            mandag(1),
            BrukersMeldekortKjedeStatus.KORRIGERING_VENTER_BEHANDLING,
        );

        expect(
            finnUbehandledeMeldekort(
                [venter, korrigeringVenter],
                [{ kjedeId: venter.id, dager: meldekortDager(mandag(0)) }],
            ),
        ).toEqual([korrigeringVenter]);
    });
});

describe('formaterMeldeperioder', () => {
    test('viser én meldeperiode med begge ukenumrene', () => {
        expect(formaterMeldeperioder(meldekortbehandling())).toBe(
            '06.01.2025 - 19.01.2025 (uke 2 og 3)',
        );
    });

    test('viser totalperioden, antall meldeperioder og ukespenn for flere meldeperioder', () => {
        expect(
            formaterMeldeperioder(
                meldekortbehandling({
                    meldeperioder: [
                        meldeperiodebehandling(FØRSTE_MANDAG),
                        meldeperiodebehandling(ANDRE_MANDAG),
                    ],
                }),
            ),
        ).toBe('06.01.2025 - 02.02.2025 (2 meldeperioder, uke 2 - 5)');
    });
});

describe('journalførNotatEndringFraBeslutter', () => {
    test('sammenligner beslutters valg med saksbehandlers lagrede valg', () => {
        const behandling = meldekortbehandling({
            status: MeldekortbehandlingStatus.UNDER_BESLUTNING,
            skalJournalføreNotat: true,
        });

        expect(journalførNotatEndringFraBeslutter(behandling, false, true)).toEqual({
            saksbehandler: true,
            beslutter: false,
        });
        expect(journalførNotatEndringFraBeslutter(behandling, true, true)).toBeNull();
    });

    test('viser lagret endring fra beslutter når beslutter ikke redigerer', () => {
        const behandling = meldekortbehandling({
            skalJournalføreNotat: true,
            beslutterEndringer: {
                skalJournalføreNotat: {
                    tidspunkt: '2025-01-21T10:00:00',
                    saksbehandler: false,
                    beslutter: true,
                },
            },
        });

        expect(journalførNotatEndringFraBeslutter(behandling, true, false)).toEqual({
            tidspunkt: '2025-01-21T10:00:00',
            saksbehandler: false,
            beslutter: true,
        });
    });
});
