/** @jest-environment jsdom */
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortDagSkjema } from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContextTyper';
import { useMeldekortHurtigutfylling } from '~/lib/meldekort/meldekortbehandling/meldeperioder/meldeperiodebehandling/hurtigtaster/useMeldekortHurtigutfylling';

const dag = (dato: string, status: MeldekortbehandlingDagStatus): MeldekortDagSkjema => ({
    dato,
    status,
});

const dager: MeldekortDagSkjema[] = [
    dag('2025-01-06', MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger),
    dag('2025-01-07', MeldekortbehandlingDagStatus.IkkeBesvart),
    dag('2025-01-08', MeldekortbehandlingDagStatus.IkkeBesvart),
    dag('2025-01-09', MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger),
];

const dagerMedHelg: MeldekortDagSkjema[] = [
    dag('2025-01-10', MeldekortbehandlingDagStatus.IkkeBesvart),
    dag('2025-01-11', MeldekortbehandlingDagStatus.IkkeBesvart),
    dag('2025-01-12', MeldekortbehandlingDagStatus.IkkeBesvart),
    dag('2025-01-13', MeldekortbehandlingDagStatus.IkkeBesvart),
];

let oppdaterDagStatus: jest.Mock<(dagIndex: number, status: MeldekortbehandlingDagStatus) => void>;

const renderHurtigutfylling = (erReadonly = false) =>
    renderHook(() =>
        useMeldekortHurtigutfylling({
            dager,
            erReadonly,
            kanFylleUtHelg: false,
            oppdaterDagStatus,
        }),
    );

beforeEach(() => {
    oppdaterDagStatus = jest.fn();
});

describe('useMeldekortHurtigutfylling', () => {
    test('start hopper til første dag som kan endres', () => {
        const { result } = renderHurtigutfylling();

        expect(result.current.aktivDagIndex).toBe(null);

        act(() => result.current.start());

        expect(result.current.aktivDagIndex).toBe(1);
    });

    test('valg av status oppdaterer dagen og går videre til neste dag som kan endres', () => {
        const { result } = renderHurtigutfylling();

        act(() => result.current.start());
        act(() =>
            result.current.velgStatusForAktivDag(
                MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket,
            ),
        );

        expect(oppdaterDagStatus).toHaveBeenCalledWith(
            1,
            MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket,
        );
        expect(result.current.aktivDagIndex).toBe(2);
    });

    test('prosessen avsluttes etter siste dag som kan endres', () => {
        const { result } = renderHurtigutfylling();

        act(() => result.current.start());
        act(() => result.current.hoppTilNesteDag());
        act(() => result.current.hoppTilNesteDag());

        expect(result.current.aktivDagIndex).toBe(null);
        expect(oppdaterDagStatus).not.toHaveBeenCalled();
    });

    test('avbryt avslutter prosessen', () => {
        const { result } = renderHurtigutfylling();

        act(() => result.current.start());
        act(() => result.current.avbryt());

        expect(result.current.aktivDagIndex).toBe(null);
    });

    test('kan ikke starte når behandlingen er readonly', () => {
        const { result } = renderHurtigutfylling(true);

        expect(result.current.kanStarte).toBe(false);

        act(() => result.current.start());

        expect(result.current.aktivDagIndex).toBe(null);
    });

    test('setter ikke tiltaksdag automatisk på ubesvarte helgedager når saken ikke kan sende inn helg', () => {
        const { result } = renderHook(() =>
            useMeldekortHurtigutfylling({
                dager: dagerMedHelg,
                erReadonly: false,
                kanFylleUtHelg: false,
                oppdaterDagStatus,
            }),
        );

        act(() => result.current.start());

        expect(result.current.aktivDagIndex).toBe(0);

        act(() => result.current.hoppTilNesteDag());

        // Lørdag og søndag (index 1 og 2) fylles ut automatisk
        expect(oppdaterDagStatus.mock.calls).toEqual([
            [1, MeldekortbehandlingDagStatus.IkkeTiltaksdag],
            [2, MeldekortbehandlingDagStatus.IkkeTiltaksdag],
        ]);
        expect(result.current.aktivDagIndex).toBe(3);
    });

    test('hopper over helgedager som allerede er ikke tiltaksdag', () => {
        const { result } = renderHook(() =>
            useMeldekortHurtigutfylling({
                dager: [
                    dag('2025-01-10', MeldekortbehandlingDagStatus.IkkeBesvart),
                    dag('2025-01-11', MeldekortbehandlingDagStatus.IkkeTiltaksdag),
                    dag('2025-01-12', MeldekortbehandlingDagStatus.IkkeTiltaksdag),
                    dag('2025-01-13', MeldekortbehandlingDagStatus.IkkeBesvart),
                ],
                erReadonly: false,
                kanFylleUtHelg: false,
                oppdaterDagStatus,
            }),
        );

        act(() => result.current.start());
        act(() => result.current.hoppTilNesteDag());

        expect(oppdaterDagStatus).not.toHaveBeenCalled();
        expect(result.current.aktivDagIndex).toBe(3);
    });

    test('spør saksbehandler om helgedager med annen status enn ikke besvart', () => {
        const { result } = renderHook(() =>
            useMeldekortHurtigutfylling({
                dager: [
                    dag('2025-01-10', MeldekortbehandlingDagStatus.IkkeBesvart),
                    dag('2025-01-11', MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket),
                    dag('2025-01-12', MeldekortbehandlingDagStatus.IkkeBesvart),
                ],
                erReadonly: false,
                kanFylleUtHelg: false,
                oppdaterDagStatus,
            }),
        );

        act(() => result.current.start());
        act(() => result.current.hoppTilNesteDag());

        expect(oppdaterDagStatus).not.toHaveBeenCalled();
        expect(result.current.aktivDagIndex).toBe(1);
    });

    test('tar med helgedager når saken kan sende inn helg', () => {
        const { result } = renderHook(() =>
            useMeldekortHurtigutfylling({
                dager: dagerMedHelg,
                erReadonly: false,
                kanFylleUtHelg: true,
                oppdaterDagStatus,
            }),
        );

        act(() => result.current.start());
        act(() => result.current.hoppTilNesteDag());

        expect(oppdaterDagStatus).not.toHaveBeenCalled();
        expect(result.current.aktivDagIndex).toBe(1);
    });

    test('avslutter prosessen når kun ubesvarte helgedager gjenstår', () => {
        const { result } = renderHook(() =>
            useMeldekortHurtigutfylling({
                dager: [
                    dag('2025-01-11', MeldekortbehandlingDagStatus.IkkeBesvart),
                    dag('2025-01-12', MeldekortbehandlingDagStatus.IkkeBesvart),
                ],
                erReadonly: false,
                kanFylleUtHelg: false,
                oppdaterDagStatus,
            }),
        );

        act(() => result.current.start());

        expect(oppdaterDagStatus.mock.calls).toEqual([
            [0, MeldekortbehandlingDagStatus.IkkeTiltaksdag],
            [1, MeldekortbehandlingDagStatus.IkkeTiltaksdag],
        ]);
        expect(result.current.aktivDagIndex).toBe(null);
    });
});
