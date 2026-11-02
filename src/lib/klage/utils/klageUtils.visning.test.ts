import { describe, expect, test } from '@jest/globals';
import {
    erKlagefristenOverholdt,
    erKlageFerdigbehandlet,
    erKlageMottattFraKAEllerEtter,
    erKlageOpprettholdtEllerEtter,
    erKlageUnderAktivOmgjøring,
    finnSisteGyldigeStegForKlage,
    harKlageEnÅpenRammebehandling,
    hentSisteKlagehendelseUtfallFraKlagebehandling,
    kanVurdereKlage,
} from './klageUtils';
import {
    KlagebehandlingStatus,
    KlagefristUnntakSvarord,
    KlageFormkrav,
} from '~/lib/klage/typer/Klage';
import {
    KlageHendelseFeilregistrertType,
    KlageHendelseKlagebehandlingAvsluttetUtfall,
    OmgjøringskravbehandlingAvsluttetUtfall,
} from '~/lib/klage/typer/Klageinstanshendelse';
import {
    avvistResultat,
    behandlingFeilregistrertHendelse,
    formkrav,
    klagebehandling,
    klagebehandlingAvsluttetHendelse,
    omgjøringskravbehandlingAvsluttetHendelse,
    omgjørResultat,
    opprettholdtResultat,
    ventestatus,
} from '~test/klage';

const Status = KlagebehandlingStatus;
const url = (steg: string) => `/sak/202501011001/klage/klage_1/${steg}`;

describe('erKlagefristenOverholdt', () => {
    test.each([
        [true, null, true],
        [false, KlagefristUnntakSvarord.JA_AV_SÆRLIGE_GRUNNER, true],
        [
            false,
            KlagefristUnntakSvarord.JA_KLAGER_KAN_IKKE_LASTES_FOR_Å_HA_SENDT_INN_ETTER_FRISTEN,
            true,
        ],
        [false, KlagefristUnntakSvarord.NEI, false],
        [false, null, false],
    ])('frist overholdt=%s og unntak=%s gir %s', (overholdt, unntak, forventet) => {
        const klage = klagebehandling({
            formkrav: formkrav({
                erKlagefristenOverholdt: overholdt,
                erUnntakForKlagefrist: unntak,
            }),
        });
        expect(erKlagefristenOverholdt(klage)).toBe(forventet);
    });
});

describe('kanVurdereKlage', () => {
    test('kan vurderes når alle formkrav er oppfylt', () => {
        expect(kanVurdereKlage(klagebehandling())).toBe(true);
    });

    // Speiler `KlageFormkrav.erAvvisning` i backenden: hvert enkelt brudd gir avvisning.
    test.each<[string, Partial<KlageFormkrav>]>([
        ['klagen gjelder ikke et vedtak', { vedtakDetKlagesPå: null }],
        ['klager er ikke part i saken', { erKlagerPartISaken: false }],
        ['det klages ikke på konkrete elementer', { klagesDetPåKonkreteElementerIVedtaket: false }],
        ['klagen er ikke signert', { erKlagenSignert: false }],
        [
            'fristen er oversittet uten unntak',
            { erKlagefristenOverholdt: false, erUnntakForKlagefrist: KlagefristUnntakSvarord.NEI },
        ],
    ])('kan ikke vurderes når %s', (_, overstyring) => {
        expect(kanVurdereKlage(klagebehandling({ formkrav: formkrav(overstyring) }))).toBe(false);
    });
});

describe('finnSisteGyldigeStegForKlage', () => {
    test('avvist klage går til brev', () => {
        const klage = klagebehandling({
            formkrav: formkrav({ erKlagenSignert: false }),
            resultat: avvistResultat(),
        });
        expect(finnSisteGyldigeStegForKlage(klage)).toBe(url('brev'));
    });

    test('ikke vurdert klage med oppfylte formkrav går til vurdering', () => {
        expect(finnSisteGyldigeStegForKlage(klagebehandling())).toBe(url('vurdering'));
    });

    test('ikke vurdert klage uten oppfylte formkrav går til formkrav', () => {
        const klage = klagebehandling({ formkrav: formkrav({ erKlagerPartISaken: false }) });
        expect(finnSisteGyldigeStegForKlage(klage)).toBe(url('formkrav'));
    });

    test('omgjøring går til resultat', () => {
        const klage = klagebehandling({ resultat: omgjørResultat() });
        expect(finnSisteGyldigeStegForKlage(klage)).toBe(url('resultat'));
    });

    test('opprettholdelse under behandling går til brev', () => {
        const klage = klagebehandling({ resultat: opprettholdtResultat() });
        expect(finnSisteGyldigeStegForKlage(klage)).toBe(url('brev'));
    });

    test('opprettholdelse som er oversendt klageinstansen går til resultat', () => {
        const klage = klagebehandling({
            status: Status.OVERSENDT,
            resultat: opprettholdtResultat(),
        });
        expect(finnSisteGyldigeStegForKlage(klage)).toBe(url('resultat'));
    });
});

describe('erKlageOpprettholdtEllerEtter og erKlageMottattFraKAEllerEtter', () => {
    test.each([
        [Status.KLAR_TIL_BEHANDLING, false, false],
        [Status.UNDER_BEHANDLING, false, false],
        [Status.AVBRUTT, false, false],
        [Status.OPPRETTHOLDT, true, false],
        [Status.OVERSENDT, true, false],
        [Status.MOTTATT_FRA_KLAGEINSTANS, true, true],
        [Status.OMGJØRING_ETTER_KLAGEINSTANS, true, true],
        [Status.FERDIGSTILT, true, true],
    ])(
        'opprettholdt klage med status %s: opprettholdt eller etter=%s, mottatt fra KA eller etter=%s',
        (status, opprettholdtEllerEtter, mottattFraKAEllerEtter) => {
            const klage = klagebehandling({ status, resultat: opprettholdtResultat() });
            expect(erKlageOpprettholdtEllerEtter(klage)).toBe(opprettholdtEllerEtter);
            expect(erKlageMottattFraKAEllerEtter(klage)).toBe(mottattFraKAEllerEtter);
        },
    );

    test('vedtatt teller som mottatt fra KA bare når klagen er opprettholdt', () => {
        expect(
            erKlageMottattFraKAEllerEtter(
                klagebehandling({ status: Status.VEDTATT, resultat: opprettholdtResultat() }),
            ),
        ).toBe(true);
        expect(
            erKlageMottattFraKAEllerEtter(
                klagebehandling({ status: Status.VEDTATT, resultat: avvistResultat() }),
            ),
        ).toBe(false);
    });

    test('bruker statusen fra før klagen ble satt på vent', () => {
        const klage = klagebehandling({
            status: Status.KLAR_TIL_BEHANDLING,
            resultat: opprettholdtResultat(),
            ventestatus: [ventestatus({ status: Status.MOTTATT_FRA_KLAGEINSTANS })],
        });
        expect(erKlageOpprettholdtEllerEtter(klage)).toBe(true);
        expect(erKlageMottattFraKAEllerEtter(klage)).toBe(true);
    });

    test('ser bort fra ventestatus når klagen er gjenopptatt', () => {
        const klage = klagebehandling({
            status: Status.UNDER_BEHANDLING,
            resultat: opprettholdtResultat(),
            ventestatus: [
                ventestatus({ erSattPåVent: false, status: Status.OPPRETTHOLDT }),
                ventestatus({ erSattPåVent: true, status: Status.OPPRETTHOLDT }),
            ],
        });
        expect(erKlageOpprettholdtEllerEtter(klage)).toBe(false);
    });
});

describe('hentSisteKlagehendelseUtfallFraKlagebehandling', () => {
    test('klage som ikke er opprettholdt har ikke utfall fra klageinstansen', () => {
        expect(
            hentSisteKlagehendelseUtfallFraKlagebehandling(
                klagebehandling({ resultat: omgjørResultat() }),
            ),
        ).toBeNull();
    });

    test('opprettholdt klage uten hendelser har ikke utfall', () => {
        expect(
            hentSisteKlagehendelseUtfallFraKlagebehandling(
                klagebehandling({ resultat: opprettholdtResultat({ klageinstanshendelser: [] }) }),
            ),
        ).toBeNull();
    });

    test.each([
        [
            'avsluttet klagebehandling',
            klagebehandlingAvsluttetHendelse(
                KlageHendelseKlagebehandlingAvsluttetUtfall.STADFESTELSE,
            ),
            KlageHendelseKlagebehandlingAvsluttetUtfall.STADFESTELSE,
        ],
        [
            'avsluttet omgjøringskravbehandling',
            omgjøringskravbehandlingAvsluttetHendelse(
                OmgjøringskravbehandlingAvsluttetUtfall.MEDHOLD_ETTER_FVL_35,
            ),
            OmgjøringskravbehandlingAvsluttetUtfall.MEDHOLD_ETTER_FVL_35,
        ],
        [
            'feilregistrert behandling (gir typen)',
            behandlingFeilregistrertHendelse(KlageHendelseFeilregistrertType.ANKE),
            KlageHendelseFeilregistrertType.ANKE,
        ],
    ])('henter utfallet fra siste hendelse: %s', (_, sisteHendelse, forventet) => {
        const klage = klagebehandling({
            status: Status.MOTTATT_FRA_KLAGEINSTANS,
            resultat: opprettholdtResultat({
                klageinstanshendelser: [
                    klagebehandlingAvsluttetHendelse(
                        KlageHendelseKlagebehandlingAvsluttetUtfall.RETUR,
                    ),
                    sisteHendelse,
                ],
            }),
        });
        expect(hentSisteKlagehendelseUtfallFraKlagebehandling(klage)).toBe(forventet);
    });
});

describe('harKlageEnÅpenRammebehandling og erKlageUnderAktivOmgjøring', () => {
    test.each([
        ['omgjøring', omgjørResultat(), 'beh_1', true, true],
        ['omgjøring', omgjørResultat(), null, false, false],
        ['opprettholdelse', opprettholdtResultat(), 'beh_1', true, false],
        ['avvisning', avvistResultat(), 'beh_1', false, false],
    ] as const)(
        '%s med åpen behandling %s: har åpen rammebehandling=%s, under aktiv omgjøring=%s',
        (_, resultat, åpenBehandlingId, harÅpen, underAktivOmgjøring) => {
            const klage = klagebehandling({ resultat, åpenBehandlingId });
            expect(harKlageEnÅpenRammebehandling(klage)).toBe(harÅpen);
            expect(erKlageUnderAktivOmgjøring(klage)).toBe(underAktivOmgjøring);
        },
    );
});

describe('erKlageFerdigbehandlet', () => {
    test.each([
        [Status.VEDTATT, true],
        [Status.FERDIGSTILT, true],
        [Status.AVBRUTT, false],
        [Status.OVERSENDT, false],
        [Status.MOTTATT_FRA_KLAGEINSTANS, false],
    ])('klage med status %s: %s', (status, forventet) => {
        expect(erKlageFerdigbehandlet(klagebehandling({ status }))).toBe(forventet);
    });
});
