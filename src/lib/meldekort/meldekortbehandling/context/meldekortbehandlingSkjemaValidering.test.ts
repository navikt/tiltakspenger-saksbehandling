import { describe, expect, test } from '@jest/globals';
import {
    validerMeldekortbehandlingSkjema,
    validerMeldeperiodeSkjema,
} from '~/lib/meldekort/meldekortbehandling/context/meldekortbehandlingSkjemaValidering';
import {
    MeldekortbehandlingSkjemaContext,
    MeldeperiodeSkjema,
} from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContextTyper';
import {
    MeldekortbehandlingDagStatus,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { TextAreaInput, getTextAreaRefValue } from '~/lib/_felles/fritekst/fritekstUtils';
import { PRIORITERING_MANGLER_BEGRUNNELSE } from '~/lib/_felles/prioritering/prioriteringUtils';
import { sak } from '~test/rammebehandling';
import {
    ANDRE_MANDAG,
    FØRSTE_MANDAG,
    erHelg,
    kjedeIdFor,
    meldekortbehandling,
    meldekortDager,
    meldeperiode,
    meldeperiodekjede,
} from '~test/meldekort';

const { DeltattUtenLønnITiltaket, IkkeBesvart, IkkeTiltaksdag, IkkeRettTilTiltakspenger } =
    MeldekortbehandlingDagStatus;

const sakMedKjeder = (...kjeder: { fraOgMed: string; antallDager: number }[]) =>
    sak({
        meldeperiodeKjeder: kjeder.map(({ fraOgMed, antallDager }) =>
            meldeperiodekjede(fraOgMed, {
                sisteMeldeperiode: meldeperiode(fraOgMed, { antallDager }),
            }),
        ),
    });

// Deltatt alle hverdager og ikke tiltaksdag i helgene, dvs. 10 dager med deltakelse
const fullstendigUtfylt = (fraOgMed: string): MeldeperiodeSkjema => ({
    kjedeId: kjedeIdFor(fraOgMed),
    dager: meldekortDager(fraOgMed, (dato) =>
        erHelg(dato) ? IkkeTiltaksdag : DeltattUtenLønnITiltaket,
    ),
});

const medStatuser = (
    fraOgMed: string,
    statusForDag: (dato: string, index: number) => MeldekortbehandlingDagStatus,
): MeldeperiodeSkjema => ({
    kjedeId: kjedeIdFor(fraOgMed),
    dager: meldekortDager(fraOgMed, statusForDag),
});

const fritekst = (verdi: string | null): TextAreaInput => {
    const ref = { current: null };
    return { ref, getValue: () => getTextAreaRefValue(ref, verdi) };
};

const skjema = (
    overstyringer: Partial<MeldekortbehandlingSkjemaContext> = {},
): MeldekortbehandlingSkjemaContext => ({
    meldeperioder: [fullstendigUtfylt(FØRSTE_MANDAG)],
    skalSendeVedtaksbrev: true,
    skalJournalføreNotat: false,
    erPrioritert: false,
    erReadonly: false,
    kanEndreSkalJournalføreNotat: true,
    begrunnelse: fritekst(null),
    brevtekst: fritekst(null),
    prioriteringBegrunnelse: fritekst(null),
    ...overstyringer,
});

const behandling = meldekortbehandling();
const standardSak = sakMedKjeder({ fraOgMed: FØRSTE_MANDAG, antallDager: 10 });

describe('validerMeldeperiodeSkjema', () => {
    test('gir ingen feil når alle dager er besvart og antall dager er innenfor maks', () => {
        expect(
            validerMeldeperiodeSkjema(fullstendigUtfylt(FØRSTE_MANDAG), behandling, standardSak),
        ).toBeNull();
    });

    test('gir feil for hver dag som ikke er besvart, i datorekkefølge', () => {
        const mpSkjema = medStatuser(FØRSTE_MANDAG, (_, index) =>
            index === 2 || index === 9 ? IkkeBesvart : IkkeTiltaksdag,
        );

        expect(validerMeldeperiodeSkjema(mpSkjema, behandling, standardSak)).toEqual({
            kjedeId: kjedeIdFor(FØRSTE_MANDAG),
            dagerFeil: [
                { dato: '2025-01-08', feil: 'Status må besvares' },
                { dato: '2025-01-15', feil: 'Status må besvares' },
            ],
            overordnedeFeil: [],
        });
    });

    test('tillater nøyaktig maks antall dager med deltatt eller fravær', () => {
        const mpSkjema = medStatuser(FØRSTE_MANDAG, (_, index) =>
            index < 10 ? DeltattUtenLønnITiltaket : IkkeTiltaksdag,
        );

        expect(validerMeldeperiodeSkjema(mpSkjema, behandling, standardSak)).toBeNull();
    });

    test('gir overordnet feil når det er én dag mer enn maks', () => {
        const mpSkjema = medStatuser(FØRSTE_MANDAG, (_, index) =>
            index < 11 ? DeltattUtenLønnITiltaket : IkkeTiltaksdag,
        );

        expect(validerMeldeperiodeSkjema(mpSkjema, behandling, standardSak)).toEqual({
            kjedeId: kjedeIdFor(FØRSTE_MANDAG),
            dagerFeil: [],
            overordnedeFeil: [
                'For mange dager med deltatt eller fravær. 11 dager utfylt, 10 er maks for meldeperioden.',
            ],
        });
    });

    test.each([
        MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket,
        MeldekortbehandlingDagStatus.DeltattMedLønnITiltaket,
        MeldekortbehandlingDagStatus.FraværSyk,
        MeldekortbehandlingDagStatus.FraværSyktBarn,
        MeldekortbehandlingDagStatus.FraværSterkeVelferdsgrunnerEllerJobbintervju,
        MeldekortbehandlingDagStatus.FraværGodkjentAvNav,
        MeldekortbehandlingDagStatus.FraværAnnet,
    ])('%s teller med i antall dager', (status) => {
        const sakMedMaksEnDag = sakMedKjeder({ fraOgMed: FØRSTE_MANDAG, antallDager: 1 });
        const mpSkjema = medStatuser(FØRSTE_MANDAG, (_, index) =>
            index < 2 ? status : IkkeTiltaksdag,
        );

        expect(
            validerMeldeperiodeSkjema(mpSkjema, behandling, sakMedMaksEnDag)?.overordnedeFeil,
        ).toEqual([
            'For mange dager med deltatt eller fravær. 2 dager utfylt, 1 er maks for meldeperioden.',
        ]);
    });

    test('ikke tiltaksdag og ikke rett teller ikke med i antall dager', () => {
        const sakUtenDager = sakMedKjeder({ fraOgMed: FØRSTE_MANDAG, antallDager: 0 });
        const mpSkjema = medStatuser(FØRSTE_MANDAG, (_, index) =>
            index < 7 ? IkkeTiltaksdag : IkkeRettTilTiltakspenger,
        );

        expect(validerMeldeperiodeSkjema(mpSkjema, behandling, sakUtenDager)).toBeNull();
    });

    test('rapporterer både ubesvarte dager og for mange dager samtidig', () => {
        const sakMedMaksEnDag = sakMedKjeder({ fraOgMed: FØRSTE_MANDAG, antallDager: 1 });
        const mpSkjema = medStatuser(FØRSTE_MANDAG, (_, index) =>
            index < 2 ? DeltattUtenLønnITiltaket : index === 13 ? IkkeBesvart : IkkeTiltaksdag,
        );

        expect(validerMeldeperiodeSkjema(mpSkjema, behandling, sakMedMaksEnDag)).toEqual({
            kjedeId: kjedeIdFor(FØRSTE_MANDAG),
            dagerFeil: [{ dato: '2025-01-19', feil: 'Status må besvares' }],
            overordnedeFeil: [
                'For mange dager med deltatt eller fravær. 2 dager utfylt, 1 er maks for meldeperioden.',
            ],
        });
    });

    test('bruker maks antall dager fra siste meldeperiode i kjeden skjemaet gjelder', () => {
        const sakMedToKjeder = sakMedKjeder(
            { fraOgMed: FØRSTE_MANDAG, antallDager: 10 },
            { fraOgMed: ANDRE_MANDAG, antallDager: 8 },
        );

        expect(
            validerMeldeperiodeSkjema(fullstendigUtfylt(FØRSTE_MANDAG), behandling, sakMedToKjeder),
        ).toBeNull();
        expect(
            validerMeldeperiodeSkjema(fullstendigUtfylt(ANDRE_MANDAG), behandling, sakMedToKjeder)
                ?.overordnedeFeil,
        ).toEqual([
            'For mange dager med deltatt eller fravær. 10 dager utfylt, 8 er maks for meldeperioden.',
        ]);
    });

    test.each([MeldekortbehandlingStatus.GODKJENT, MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET])(
        'validerer ikke når behandlingen har status %s',
        (status) => {
            const sakMedMaksEnDag = sakMedKjeder({ fraOgMed: FØRSTE_MANDAG, antallDager: 1 });
            const ugyldig = medStatuser(FØRSTE_MANDAG, (_, index) =>
                index < 5 ? DeltattUtenLønnITiltaket : IkkeBesvart,
            );

            expect(
                validerMeldeperiodeSkjema(
                    ugyldig,
                    meldekortbehandling({ status }),
                    sakMedMaksEnDag,
                ),
            ).toBeNull();
        },
    );

    test('kaster når saken ikke har kjeden skjemaet gjelder', () => {
        expect(() =>
            validerMeldeperiodeSkjema(fullstendigUtfylt(ANDRE_MANDAG), behandling, standardSak),
        ).toThrow(`Fant ikke meldeperiodekjede med id ${kjedeIdFor(ANDRE_MANDAG)}`);
    });
});

describe('validerMeldekortbehandlingSkjema', () => {
    test('gir ingen feil for et gyldig skjema', () => {
        expect(validerMeldekortbehandlingSkjema(skjema(), behandling, standardSak)).toBeNull();
    });

    test.each([null, '', '   \n '])(
        'krever begrunnelse når notatet skal journalføres (begrunnelse %j)',
        (begrunnelse) => {
            expect(
                validerMeldekortbehandlingSkjema(
                    skjema({ skalJournalføreNotat: true, begrunnelse: fritekst(begrunnelse) }),
                    behandling,
                    standardSak,
                ),
            ).toEqual({
                meldeperioderFeil: [],
                overordnedeFeil: ['Begrunnelsen må være utfylt når notatet skal journalføres'],
            });
        },
    );

    test('godtar journalføring av notat når begrunnelsen er utfylt', () => {
        expect(
            validerMeldekortbehandlingSkjema(
                skjema({ skalJournalføreNotat: true, begrunnelse: fritekst('Begrunnelse') }),
                behandling,
                standardSak,
            ),
        ).toBeNull();
    });

    test('krever begrunnelse for prioritering kun når behandlingen er prioritert', () => {
        expect(
            validerMeldekortbehandlingSkjema(
                skjema({ erPrioritert: true, prioriteringBegrunnelse: fritekst('  ') }),
                behandling,
                standardSak,
            ),
        ).toEqual({ meldeperioderFeil: [], overordnedeFeil: [PRIORITERING_MANGLER_BEGRUNNELSE] });

        expect(
            validerMeldekortbehandlingSkjema(
                skjema({ erPrioritert: true, prioriteringBegrunnelse: fritekst('Haster') }),
                behandling,
                standardSak,
            ),
        ).toBeNull();
    });

    test('samler overordnede feil og feil fra meldeperiodene som har feil', () => {
        const sakMedToKjeder = sakMedKjeder(
            { fraOgMed: FØRSTE_MANDAG, antallDager: 10 },
            { fraOgMed: ANDRE_MANDAG, antallDager: 10 },
        );
        const ugyldigMeldeperiode = medStatuser(ANDRE_MANDAG, (_, index) =>
            index === 0 ? IkkeBesvart : IkkeTiltaksdag,
        );

        expect(
            validerMeldekortbehandlingSkjema(
                skjema({
                    meldeperioder: [fullstendigUtfylt(FØRSTE_MANDAG), ugyldigMeldeperiode],
                    skalJournalføreNotat: true,
                    erPrioritert: true,
                }),
                behandling,
                sakMedToKjeder,
            ),
        ).toEqual({
            meldeperioderFeil: [
                {
                    kjedeId: kjedeIdFor(ANDRE_MANDAG),
                    dagerFeil: [{ dato: ANDRE_MANDAG, feil: 'Status må besvares' }],
                    overordnedeFeil: [],
                },
            ],
            overordnedeFeil: [
                'Begrunnelsen må være utfylt når notatet skal journalføres',
                PRIORITERING_MANGLER_BEGRUNNELSE,
            ],
        });
    });

    test('validerer ikke en godkjent behandling', () => {
        expect(
            validerMeldekortbehandlingSkjema(
                skjema({
                    meldeperioder: [medStatuser(FØRSTE_MANDAG, () => IkkeBesvart)],
                    skalJournalføreNotat: true,
                    erPrioritert: true,
                }),
                meldekortbehandling({ status: MeldekortbehandlingStatus.GODKJENT }),
                standardSak,
            ),
        ).toBeNull();
    });
});
