import { describe, expect, test } from '@jest/globals';
import {
    meldekortbehandlingSkjemaInitialState,
    meldekortbehandlingSkjemaReducer,
} from '~/lib/meldekort/meldekortbehandling/context/meldekortbehandlingSkjemaReducer';
import {
    MeldekortbehandlingSkjemaActions,
    MeldekortbehandlingSkjemaState,
    MeldeperiodeSkjema,
} from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContextTyper';
import {
    MeldekortbehandlingDagStatus,
    MeldekortbehandlingId,
    MeldeperiodebehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { BeregningKildeType } from '~/lib/beregning-og-simulering/typer/Beregning';
import { ikkeSladdet } from '~test/sladdetVerdi';
import {
    ANDRE_MANDAG,
    FØRSTE_MANDAG,
    erHelg,
    kjedeIdFor,
    leggTilDager,
    meldekortbehandling,
    meldekortDager,
    meldeperiode,
    meldeperiodebehandling,
    meldeperiodekjede,
    meldeperiodePeriode,
} from '~test/meldekort';

const { IkkeBesvart, IkkeRettTilTiltakspenger, DeltattUtenLønnITiltaket, FraværSyk } =
    MeldekortbehandlingDagStatus;

const state: MeldekortbehandlingSkjemaState = {
    meldeperioder: [],
    skalSendeVedtaksbrev: true,
    skalJournalføreNotat: false,
    erPrioritert: false,
};

const meldeperiodeSkjema = (
    fraOgMed: string,
    status: MeldekortbehandlingDagStatus = IkkeBesvart,
): MeldeperiodeSkjema => ({
    kjedeId: kjedeIdFor(fraOgMed),
    dager: meldekortDager(fraOgMed, () => status),
});

const stateMedToMeldeperioder: MeldekortbehandlingSkjemaState = {
    ...state,
    meldeperioder: [meldeperiodeSkjema(FØRSTE_MANDAG), meldeperiodeSkjema(ANDRE_MANDAG)],
};

const TREDJE_MANDAG = leggTilDager(ANDRE_MANDAG, 14);

describe('meldekortbehandlingSkjemaReducer', () => {
    test('setErPrioritert endrer kun prioriteringen', () => {
        const prioritert = meldekortbehandlingSkjemaReducer(state, {
            type: 'setErPrioritert',
            payload: { erPrioritert: true },
        });

        expect(prioritert).toEqual({ ...state, erPrioritert: true });
        expect(
            meldekortbehandlingSkjemaReducer(prioritert, {
                type: 'setErPrioritert',
                payload: { erPrioritert: false },
            }),
        ).toEqual(state);
    });

    test('oppdaterDagStatus endrer kun valgt dag i valgt meldeperiode, uten å mutere state', () => {
        const kopiAvState = structuredClone(stateMedToMeldeperioder);

        const nyState = meldekortbehandlingSkjemaReducer(stateMedToMeldeperioder, {
            type: 'oppdaterDagStatus',
            payload: { kjedeId: kjedeIdFor(ANDRE_MANDAG), dagIndex: 3, status: FraværSyk },
        });

        expect(nyState.meldeperioder[0]).toBe(stateMedToMeldeperioder.meldeperioder[0]);
        expect(nyState.meldeperioder[1]).toEqual({
            kjedeId: kjedeIdFor(ANDRE_MANDAG),
            dager: meldekortDager(ANDRE_MANDAG, (_, index) =>
                index === 3 ? FraværSyk : IkkeBesvart,
            ),
        });
        expect(stateMedToMeldeperioder).toEqual(kopiAvState);
    });

    test('oppdaterDagStatus kaster når dagen ikke finnes i meldeperioden', () => {
        expect(() =>
            meldekortbehandlingSkjemaReducer(stateMedToMeldeperioder, {
                type: 'oppdaterDagStatus',
                payload: { kjedeId: kjedeIdFor(FØRSTE_MANDAG), dagIndex: 14, status: FraværSyk },
            }),
        ).toThrow();
    });

    test('setDager erstatter dagene for valgt meldeperiode og beholder rekkefølgen', () => {
        const nyeDager = meldeperiodeSkjema(FØRSTE_MANDAG, DeltattUtenLønnITiltaket);

        const nyState = meldekortbehandlingSkjemaReducer(stateMedToMeldeperioder, {
            type: 'setDager',
            payload: nyeDager,
        });

        expect(nyState.meldeperioder).toEqual([nyeDager, stateMedToMeldeperioder.meldeperioder[1]]);
    });

    describe('leggTilMeldeperioder', () => {
        test('legger til kjeder med dager utledet fra hvilke dager som gir rett', () => {
            const kjede = meldeperiodekjede(ANDRE_MANDAG, {
                sisteMeldeperiode: meldeperiode(ANDRE_MANDAG, { girRett: (dato) => !erHelg(dato) }),
            });

            const nyState = meldekortbehandlingSkjemaReducer(state, {
                type: 'leggTilMeldeperioder',
                payload: { meldeperiodeKjeder: [kjede] },
            });

            expect(nyState.meldeperioder).toEqual([
                {
                    kjedeId: kjedeIdFor(ANDRE_MANDAG),
                    dager: meldekortDager(ANDRE_MANDAG, (dato) =>
                        erHelg(dato) ? IkkeRettTilTiltakspenger : IkkeBesvart,
                    ),
                },
            ]);
        });

        test('sorterer meldeperiodene kronologisk etter kjede', () => {
            const nyState = meldekortbehandlingSkjemaReducer(
                { ...state, meldeperioder: [meldeperiodeSkjema(ANDRE_MANDAG)] },
                {
                    type: 'leggTilMeldeperioder',
                    payload: {
                        meldeperiodeKjeder: [
                            meldeperiodekjede(TREDJE_MANDAG),
                            meldeperiodekjede(FØRSTE_MANDAG),
                        ],
                    },
                },
            );

            expect(nyState.meldeperioder.map((mp) => mp.kjedeId)).toEqual([
                kjedeIdFor(FØRSTE_MANDAG),
                kjedeIdFor(ANDRE_MANDAG),
                kjedeIdFor(TREDJE_MANDAG),
            ]);
        });

        test('overskriver ikke utfylte dager for kjeder som allerede er med', () => {
            const utfylt = meldeperiodeSkjema(FØRSTE_MANDAG, DeltattUtenLønnITiltaket);

            const nyState = meldekortbehandlingSkjemaReducer(
                { ...state, meldeperioder: [utfylt] },
                {
                    type: 'leggTilMeldeperioder',
                    payload: {
                        meldeperiodeKjeder: [
                            meldeperiodekjede(FØRSTE_MANDAG),
                            meldeperiodekjede(ANDRE_MANDAG),
                        ],
                    },
                },
            );

            expect(nyState.meldeperioder).toEqual([utfylt, meldeperiodeSkjema(ANDRE_MANDAG)]);
        });
    });

    test('fjernMeldeperiode fjerner kun valgt meldeperiode', () => {
        const nyState = meldekortbehandlingSkjemaReducer(stateMedToMeldeperioder, {
            type: 'fjernMeldeperiode',
            payload: { kjedeId: kjedeIdFor(FØRSTE_MANDAG) },
        });

        expect(nyState.meldeperioder).toEqual([stateMedToMeldeperioder.meldeperioder[1]]);
    });

    // FEIL I PROD-KODEN: finnMeldeperiodeIndex sender resultatet fra findIndex til nonNullish, men findIndex
    // gir -1 (ikke null) når kjeden mangler. Feilen kastes derfor aldri, og -1 tolkes som siste meldeperiode
    // i atNonNull/with/toSpliced, slik at handlingen treffer feil meldeperiode i stedet for å feile.
    test.failing.each<MeldekortbehandlingSkjemaActions>([
        {
            type: 'oppdaterDagStatus',
            payload: { kjedeId: kjedeIdFor(TREDJE_MANDAG), dagIndex: 0, status: FraværSyk },
        },
        { type: 'setDager', payload: meldeperiodeSkjema(TREDJE_MANDAG) },
        { type: 'fjernMeldeperiode', payload: { kjedeId: kjedeIdFor(TREDJE_MANDAG) } },
    ])('$type kaster når kjeden ikke finnes i skjemaet', (action) => {
        expect(() => meldekortbehandlingSkjemaReducer(stateMedToMeldeperioder, action)).toThrow(
            `Fant ingen meldeperiode for kjede ${kjedeIdFor(TREDJE_MANDAG)}`,
        );
    });
});

describe('meldekortbehandlingSkjemaInitialState', () => {
    test('henter dager og valg fra behandlingen, uten beregning og andre felter', () => {
        const korrigering = meldeperiodebehandling(ANDRE_MANDAG, {
            type: MeldeperiodebehandlingType.KORRIGERING,
            dager: meldekortDager(ANDRE_MANDAG, () => DeltattUtenLønnITiltaket).map((dag) => ({
                ...dag,
                beregningsdag: { beløp: 298, prosent: 100, barnetillegg: 0 },
            })),
            beregning: {
                kjedeId: kjedeIdFor(ANDRE_MANDAG),
                periode: meldeperiodePeriode(ANDRE_MANDAG),
                beløp: { totalt: 2980, ordinært: 2980, barnetillegg: 0 },
                dager: [],
                beregningKilde: {
                    type: BeregningKildeType.MELDEKORT,
                    id: 'meldekort_behandling_1' as MeldekortbehandlingId,
                },
            },
        });

        expect(
            meldekortbehandlingSkjemaInitialState(
                meldekortbehandling({
                    meldeperioder: [meldeperiodebehandling(FØRSTE_MANDAG), korrigering],
                    skalSendeVedtaksbrev: false,
                    skalJournalføreNotat: true,
                }),
            ),
        ).toEqual({
            meldeperioder: [
                meldeperiodeSkjema(FØRSTE_MANDAG),
                meldeperiodeSkjema(ANDRE_MANDAG, DeltattUtenLønnITiltaket),
            ],
            skalSendeVedtaksbrev: false,
            skalJournalføreNotat: true,
            erPrioritert: false,
        });
    });

    test('behandlingen er prioritert når den har en prioritering', () => {
        expect(
            meldekortbehandlingSkjemaInitialState(
                meldekortbehandling({ prioritering: { begrunnelse: ikkeSladdet('Haster') } }),
            ).erPrioritert,
        ).toBe(true);
    });
});
