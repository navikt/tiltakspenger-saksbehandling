import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
    FormkravFormData,
    formkravFormDataTilOppdaterKlageFormkravRequest,
    formkravFormDataTilOpprettKlageRequest,
    formkravValidation,
    INGEN_VEDTAK,
    KlagefristUnntakSvarordFormData,
    KlageInnsendingskildeFormData,
    klageTilFormkravFormData,
    VedtakstypeFormkravFormData,
} from './FormkravFormUtils';
import {
    KlagefristUnntakSvarord,
    KlageInnsendingskilde,
    OppdaterKlageFormkravRequest,
} from '~/lib/klage/typer/Klage';
import { RammevedtakMedBehandling } from '~/lib/rammebehandling/typer/Rammevedtak';
import { MeldekortvedtakMedBehandling } from '~/lib/meldekort/typer/Meldekortvedtak';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { VedtakType } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { periode, rammevedtak, søknadsbehandlingInnvilgelse } from '~test/rammebehandling';
import { formkrav, klagebehandling } from '~test/klage';

const gyldigSkjema = (overstyringer: Partial<FormkravFormData> = {}): FormkravFormData => ({
    journalpostId: '453827',
    vedtakstype: VedtakstypeFormkravFormData.RAMMEVEDTAK,
    vedtakDetPåklages: 'vedtak_1',
    erKlagerPartISaken: true,
    klagesDetPåKonkreteElementer: true,
    erKlagefristOverholdt: true,
    erUnntakForKlagefrist: null,
    erKlagenSignert: true,
    innsendingsdato: new Date(2025, 3, 1),
    innsendingskilde: KlageInnsendingskildeFormData.DIGITAL,
    ...overstyringer,
});

const tomtSkjema: FormkravFormData = {
    journalpostId: '',
    vedtakstype: '',
    vedtakDetPåklages: '',
    erKlagerPartISaken: null,
    klagesDetPåKonkreteElementer: null,
    erKlagefristOverholdt: null,
    erUnntakForKlagefrist: null,
    erKlagenSignert: null,
    innsendingsdato: null,
    innsendingskilde: '',
};

const rammevedtakMedBehandling = (id: `vedtak_${string}`): RammevedtakMedBehandling => ({
    ...rammevedtak(id, periode('2025-01-01', '2025-03-31')),
    behandling: søknadsbehandlingInnvilgelse(),
    vedtakType: VedtakType.Rammebehandling,
});

const meldekortvedtakMedBehandling = (id: `vedtak_${string}`): MeldekortvedtakMedBehandling => ({
    id,
    sakId: 'sak_1',
    meldekortId: 'meldekort_1' as MeldekortbehandlingId,
    opprettet: '2025-03-01T10:00:00',
    journalpostId: null,
    // Behandlingen brukes ikke av mappingen, bare vedtakets id.
    behandling: {} as MeldekortbehandlingProps,
    vedtakType: VedtakType.Meldekort,
});

describe('formkravValidation', () => {
    beforeEach(() => {
        jest.useFakeTimers({ now: new Date(2025, 5, 15, 12, 0) });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('fullt utfylt skjema er gyldig og gir verdiene tilbake', () => {
        const skjema = gyldigSkjema();
        expect(formkravValidation(skjema)).toEqual({ values: skjema, errors: {} });
    });

    test('tomt skjema gir feil på alle påkrevde felter, og ingen verdier', () => {
        const resultat = formkravValidation(tomtSkjema);

        expect(resultat.values).toEqual({});
        expect(Object.keys(resultat.errors).sort()).toEqual(
            [
                'journalpostId',
                'vedtakstype',
                'erKlagerPartISaken',
                'klagesDetPåKonkreteElementer',
                'erKlagefristOverholdt',
                'erKlagenSignert',
                'innsendingsdato',
                'innsendingskilde',
            ].sort(),
        );
    });

    test('nei-svar på formkravene er gyldige (gir avvisning, ikke valideringsfeil)', () => {
        const skjema = gyldigSkjema({
            vedtakstype: INGEN_VEDTAK,
            vedtakDetPåklages: '',
            erKlagerPartISaken: false,
            klagesDetPåKonkreteElementer: false,
            erKlagefristOverholdt: false,
            erUnntakForKlagefrist: KlagefristUnntakSvarordFormData.NEI,
            erKlagenSignert: false,
        });

        expect(formkravValidation(skjema).errors).toEqual({});
    });

    test.each(['12a45', '123 45', '-123', '12.5'])(
        'journalpost-id "%s" med annet enn tall er ugyldig',
        (journalpostId) => {
            expect(formkravValidation(gyldigSkjema({ journalpostId })).errors).toEqual({
                journalpostId: {
                    type: 'pattern',
                    message: 'Journalpost ID kan kun inneholde tall',
                },
            });
        },
    );

    test.each([
        VedtakstypeFormkravFormData.RAMMEVEDTAK,
        VedtakstypeFormkravFormData.MELDEKORTVEDTAK,
    ])('vedtakstype %s krever at et vedtak er valgt', (vedtakstype) => {
        const resultat = formkravValidation(gyldigSkjema({ vedtakstype, vedtakDetPåklages: '' }));
        expect(Object.keys(resultat.errors)).toEqual(['vedtakDetPåklages']);
    });

    test('klage som ikke gjelder et vedtak krever ikke at et vedtak er valgt', () => {
        const skjema = gyldigSkjema({ vedtakstype: INGEN_VEDTAK, vedtakDetPåklages: '' });
        expect(formkravValidation(skjema).errors).toEqual({});
    });

    test('når klagefristen ikke er overholdt må det svares på om det er unntak', () => {
        const resultat = formkravValidation(
            gyldigSkjema({ erKlagefristOverholdt: false, erUnntakForKlagefrist: null }),
        );
        expect(Object.keys(resultat.errors)).toEqual(['erUnntakForKlagefrist']);
    });

    test('når klagefristen er overholdt kreves ikke svar på unntak', () => {
        const resultat = formkravValidation(
            gyldigSkjema({ erKlagefristOverholdt: true, erUnntakForKlagefrist: null }),
        );
        expect(resultat.errors).toEqual({});
    });

    test('innsendingsdato i fremtiden er ugyldig', () => {
        const resultat = formkravValidation(
            gyldigSkjema({ innsendingsdato: new Date(2025, 5, 16) }),
        );
        expect(resultat.errors).toEqual({
            innsendingsdato: { type: 'max', message: 'Innsendingsdato kan ikke være i fremtiden' },
        });
    });

    test('innsendingsdato i dag er gyldig', () => {
        const resultat = formkravValidation(
            gyldigSkjema({ innsendingsdato: new Date(2025, 5, 15) }),
        );
        expect(resultat.errors).toEqual({});
    });

    test('ukjent innsendingskilde er ugyldig', () => {
        const resultat = formkravValidation(
            gyldigSkjema({ innsendingskilde: 'BREVDUE' as KlageInnsendingskildeFormData }),
        );
        expect(resultat.errors).toEqual({
            innsendingskilde: { type: 'pattern', message: 'Ugyldig innsendingskilde' },
        });
    });
});

describe.each([
    ['formkravFormDataTilOpprettKlageRequest', formkravFormDataTilOpprettKlageRequest],
    [
        'formkravFormDataTilOppdaterKlageFormkravRequest',
        formkravFormDataTilOppdaterKlageFormkravRequest,
    ],
])('%s', (_, tilRequest) => {
    test('mapper utfylt skjema til request med dato på ISO-format', () => {
        expect(tilRequest(gyldigSkjema())).toEqual({
            journalpostId: '453827',
            vedtakDetKlagesPå: 'vedtak_1',
            erKlagerPartISaken: true,
            klagesDetPåKonkreteElementerIVedtaket: true,
            erKlagefristenOverholdt: true,
            erUnntakForKlagefrist: null,
            erKlagenSignert: true,
            innsendingsdato: '2025-04-01',
            innsendingskilde: KlageInnsendingskilde.DIGITAL,
        });
    });

    test('sender ikke med et tidligere valgt vedtak når klagen ikke gjelder et vedtak', () => {
        const request = tilRequest(
            gyldigSkjema({ vedtakstype: INGEN_VEDTAK, vedtakDetPåklages: 'vedtak_1' }),
        );
        expect(request.vedtakDetKlagesPå).toBeNull();
    });

    test('sender ikke med unntak for klagefrist når fristen er overholdt', () => {
        // Backenden krever at unntak er null når fristen er overholdt.
        const request = tilRequest(
            gyldigSkjema({
                erKlagefristOverholdt: true,
                erUnntakForKlagefrist: KlagefristUnntakSvarordFormData.JA_AV_SÆRLIGE_GRUNNER,
            }),
        );
        expect(request.erUnntakForKlagefrist).toBeNull();
    });

    test.each([
        [
            KlagefristUnntakSvarordFormData.JA_KLAGER_KAN_IKKE_LASTES_FOR_Å_HA_SENDT_INN_ETTER_FRISTEN,
            KlagefristUnntakSvarord.JA_KLAGER_KAN_IKKE_LASTES_FOR_Å_HA_SENDT_INN_ETTER_FRISTEN,
        ],
        [
            KlagefristUnntakSvarordFormData.JA_AV_SÆRLIGE_GRUNNER,
            KlagefristUnntakSvarord.JA_AV_SÆRLIGE_GRUNNER,
        ],
        [KlagefristUnntakSvarordFormData.NEI, KlagefristUnntakSvarord.NEI],
    ])('sender med unntak %s når fristen ikke er overholdt', (unntak, forventet) => {
        const request = tilRequest(
            gyldigSkjema({ erKlagefristOverholdt: false, erUnntakForKlagefrist: unntak }),
        );
        expect(request.erUnntakForKlagefrist).toBe(forventet);
    });

    test('kaster når fristen ikke er overholdt og unntak mangler', () => {
        expect(() =>
            tilRequest(gyldigSkjema({ erKlagefristOverholdt: false, erUnntakForKlagefrist: null })),
        ).toThrow();
    });

    test('kaster når et påkrevd ja/nei-svar mangler', () => {
        expect(() => tilRequest(gyldigSkjema({ erKlagenSignert: null }))).toThrow();
    });
});

describe('klageTilFormkravFormData', () => {
    const rammevedtakListe = [rammevedtakMedBehandling('vedtak_ramme')];
    const meldekortvedtakListe = [meldekortvedtakMedBehandling('vedtak_meldekort')];

    test('vedtak som finnes blant rammevedtakene gir vedtakstype RAMMEVEDTAK', () => {
        const klage = klagebehandling({
            formkrav: formkrav({ vedtakDetKlagesPå: 'vedtak_ramme' }),
        });

        const skjema = klageTilFormkravFormData(klage, rammevedtakListe, meldekortvedtakListe);

        expect(skjema.vedtakstype).toBe(VedtakstypeFormkravFormData.RAMMEVEDTAK);
        expect(skjema.vedtakDetPåklages).toBe('vedtak_ramme');
    });

    test('vedtak som finnes blant meldekortvedtakene gir vedtakstype MELDEKORTVEDTAK', () => {
        const klage = klagebehandling({
            formkrav: formkrav({ vedtakDetKlagesPå: 'vedtak_meldekort' }),
        });

        const skjema = klageTilFormkravFormData(klage, rammevedtakListe, meldekortvedtakListe);

        expect(skjema.vedtakstype).toBe(VedtakstypeFormkravFormData.MELDEKORTVEDTAK);
        expect(skjema.vedtakDetPåklages).toBe('vedtak_meldekort');
    });

    test('klage uten vedtak gir vedtakstype INGEN_VEDTAK', () => {
        const klage = klagebehandling({ formkrav: formkrav({ vedtakDetKlagesPå: null }) });

        const skjema = klageTilFormkravFormData(klage, rammevedtakListe, meldekortvedtakListe);

        expect(skjema.vedtakstype).toBe(INGEN_VEDTAK);
        expect(skjema.vedtakDetPåklages).toBe('');
    });

    test('vedtak som ikke finnes i noen av listene gir tomt valg, slik at saksbehandler må velge på nytt', () => {
        const klage = klagebehandling({
            formkrav: formkrav({ vedtakDetKlagesPå: 'vedtak_ukjent' }),
        });

        const skjema = klageTilFormkravFormData(klage, rammevedtakListe, meldekortvedtakListe);

        expect(skjema.vedtakstype).toBe('');
        expect(skjema.vedtakDetPåklages).toBe('');
    });

    test('mapper resten av formkravene til skjemaverdier', () => {
        const klage = klagebehandling({
            klagensJournalpostId: '999',
            formkrav: formkrav({
                vedtakDetKlagesPå: 'vedtak_ramme',
                erKlagerPartISaken: false,
                klagesDetPåKonkreteElementerIVedtaket: true,
                erKlagefristenOverholdt: false,
                erUnntakForKlagefrist: KlagefristUnntakSvarord.JA_AV_SÆRLIGE_GRUNNER,
                erKlagenSignert: false,
                innsendingsdato: '2025-04-01',
                innsendingskilde: KlageInnsendingskilde.PAPIR_FRIHAND,
            }),
        });

        const skjema = klageTilFormkravFormData(klage, rammevedtakListe, meldekortvedtakListe);

        expect(skjema).toEqual({
            journalpostId: '999',
            vedtakstype: VedtakstypeFormkravFormData.RAMMEVEDTAK,
            vedtakDetPåklages: 'vedtak_ramme',
            erKlagerPartISaken: false,
            klagesDetPåKonkreteElementer: true,
            erKlagefristOverholdt: false,
            erUnntakForKlagefrist: KlagefristUnntakSvarordFormData.JA_AV_SÆRLIGE_GRUNNER,
            erKlagenSignert: false,
            innsendingsdato: new Date('2025-04-01'),
            innsendingskilde: KlageInnsendingskildeFormData.PAPIR_FRIHAND,
        });
    });

    const unntak = [null, ...Object.values(KlagefristUnntakSvarord)];

    // Hver innsendingskilde kombineres med et unntak, slik at alle verdier av begge dekkes.
    test.each(
        Object.values(KlageInnsendingskilde).map(
            (kilde, i) => [kilde, unntak[i % unntak.length]] as const,
        ),
    )(
        'klage -> skjema -> oppdater-request bevarer formkravene (kilde %s, unntak %s)',
        (innsendingskilde, erUnntakForKlagefrist) => {
            const opprinneligeFormkrav = formkrav({
                vedtakDetKlagesPå: 'vedtak_meldekort',
                erKlagefristenOverholdt: erUnntakForKlagefrist === null,
                erUnntakForKlagefrist,
                innsendingsdato: '2025-02-28',
                innsendingskilde,
            });
            const klage = klagebehandling({
                klagensJournalpostId: '12345',
                formkrav: opprinneligeFormkrav,
            });

            const request = formkravFormDataTilOppdaterKlageFormkravRequest(
                klageTilFormkravFormData(klage, rammevedtakListe, meldekortvedtakListe),
            );

            const forventet: OppdaterKlageFormkravRequest = {
                journalpostId: '12345',
                ...opprinneligeFormkrav,
            };
            expect(request).toEqual(forventet);
        },
    );
});
