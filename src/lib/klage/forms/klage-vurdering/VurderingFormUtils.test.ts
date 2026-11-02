import { describe, expect, test } from '@jest/globals';
import {
    harKlagevurderingsstegUtfylt,
    klagebehandlingTilVurderingFormData,
    KlageVurderingTypeFormData,
    OmgjøringÅrsakFormData,
    VurderingFormData,
    vurderingFormDataTilVurderKlageRequest,
    vurderingFormValidation,
} from './VurderingFormUtils';
import { Klagehjemmel, OmgjøringÅrsak } from '~/lib/klage/typer/Klage';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';
import { avvistResultat, klagebehandling, omgjørResultat, opprettholdtResultat } from '~test/klage';

const skjema = (overstyringer: Partial<VurderingFormData> = {}): VurderingFormData => ({
    klageVurderingType: '',
    omgjør: { årsak: '', begrunnelse: '' },
    oppretthold: { hjemler: [] },
    ...overstyringer,
});

describe('klagebehandlingTilVurderingFormData', () => {
    test('klage uten resultat gir tomt skjema', () => {
        expect(klagebehandlingTilVurderingFormData(klagebehandling())).toEqual(skjema());
    });

    test('avvist klage gir tomt skjema', () => {
        expect(
            klagebehandlingTilVurderingFormData(klagebehandling({ resultat: avvistResultat() })),
        ).toEqual(skjema());
    });

    test('omgjøring fyller ut årsak og begrunnelse', () => {
        const klage = klagebehandling({
            resultat: omgjørResultat({
                årsak: OmgjøringÅrsak.FEIL_REGELVERKSFORSTAAELSE,
                begrunnelse: ikkeSladdet('Feil forståelse av forskriften'),
            }),
        });

        expect(klagebehandlingTilVurderingFormData(klage)).toEqual(
            skjema({
                klageVurderingType: KlageVurderingTypeFormData.OMGJØR,
                omgjør: {
                    årsak: OmgjøringÅrsakFormData.FEIL_REGELVERKSFORSTÅELSE,
                    begrunnelse: 'Feil forståelse av forskriften',
                },
            }),
        );
    });

    test('opprettholdelse fyller ut hjemlene som visningstekster (comboboxen bruker tekstene som verdi)', () => {
        const klage = klagebehandling({
            resultat: opprettholdtResultat({
                hjemler: [
                    Klagehjemmel.ARBEIDSMARKEDSLOVEN_13_LØNN,
                    Klagehjemmel.FORVALTNINGSLOVEN_18_OG_19,
                ],
            }),
        });

        expect(klagebehandlingTilVurderingFormData(klage)).toEqual(
            skjema({
                klageVurderingType: KlageVurderingTypeFormData.OPPRETTHOLD,
                oppretthold: {
                    hjemler: ['Arb.mark.lov §13 - lønn', 'Forvaltningsloven §§18 og 19'],
                },
            }),
        );
    });
});

describe('vurderingFormDataTilVurderKlageRequest', () => {
    test('omgjøring sender årsak og begrunnelse, men ikke hjemler', () => {
        const request = vurderingFormDataTilVurderKlageRequest(
            skjema({
                klageVurderingType: KlageVurderingTypeFormData.OMGJØR,
                omgjør: {
                    årsak: OmgjøringÅrsakFormData.PROSESSUELL_FEIL,
                    begrunnelse: 'Klager ble ikke hørt',
                },
                oppretthold: { hjemler: ['Arb.mark.lov §2'] },
            }),
        );

        expect(request).toEqual({
            vurderingstype: 'OMGJØR',
            årsak: OmgjøringÅrsak.PROSESSUELL_FEIL,
            begrunnelse: 'Klager ble ikke hørt',
            hjemler: null,
        });
    });

    test('opprettholdelse sender hjemler, men ikke årsak eller begrunnelse', () => {
        const request = vurderingFormDataTilVurderKlageRequest(
            skjema({
                klageVurderingType: KlageVurderingTypeFormData.OPPRETTHOLD,
                omgjør: {
                    årsak: OmgjøringÅrsakFormData.ANNET,
                    begrunnelse: 'Gjenstående tekst fra tidligere valg',
                },
                oppretthold: { hjemler: ['Arb.mark.lov §2', 'Folketrygdloven §22-17 a'] },
            }),
        );

        expect(request).toEqual({
            vurderingstype: 'OPPRETTHOLD',
            årsak: null,
            begrunnelse: null,
            hjemler: [Klagehjemmel.ARBEIDSMARKEDSLOVEN_2, Klagehjemmel.FOLKETRYGDLOVEN_22_17_A],
        });
    });

    test('regelverksforståelse sendes med backendens stavemåte (uten æ/å)', () => {
        const request = vurderingFormDataTilVurderKlageRequest(
            skjema({
                klageVurderingType: KlageVurderingTypeFormData.OMGJØR,
                omgjør: {
                    årsak: OmgjøringÅrsakFormData.FEIL_REGELVERKSFORSTÅELSE,
                    begrunnelse: 'Begrunnelse',
                },
            }),
        );

        expect(request.årsak).toBe('FEIL_REGELVERKSFORSTAAELSE');
    });

    test.each(Object.values(OmgjøringÅrsak))(
        'klage -> skjema -> request bevarer omgjøringsårsaken %s',
        (årsak) => {
            const klage = klagebehandling({ resultat: omgjørResultat({ årsak }) });

            const request = vurderingFormDataTilVurderKlageRequest(
                klagebehandlingTilVurderingFormData(klage),
            );

            expect(request.årsak).toBe(årsak);
        },
    );

    test('klage -> skjema -> request bevarer alle hjemler', () => {
        const alleHjemler = Object.values(Klagehjemmel);
        const klage = klagebehandling({ resultat: opprettholdtResultat({ hjemler: alleHjemler }) });

        const skjemadata = klagebehandlingTilVurderingFormData(klage);
        const request = vurderingFormDataTilVurderKlageRequest(skjemadata);

        // Hver hjemmel må ha en unik visningstekst, ellers blir mappingen tilbake tvetydig.
        expect(new Set(skjemadata.oppretthold.hjemler).size).toBe(alleHjemler.length);
        expect(request.hjemler).toEqual(alleHjemler);
    });
});

describe('vurderingFormValidation', () => {
    test('krever at vurderingstype er valgt', () => {
        const resultat = vurderingFormValidation(skjema());

        expect(resultat.values).toEqual({});
        expect(Object.keys(resultat.errors)).toEqual(['klageVurderingType']);
    });

    test('gyldig omgjøring gir verdiene tilbake', () => {
        const data = skjema({
            klageVurderingType: KlageVurderingTypeFormData.OMGJØR,
            omgjør: { årsak: OmgjøringÅrsakFormData.ANNET, begrunnelse: 'Begrunnelse' },
        });

        expect(vurderingFormValidation(data)).toEqual({ values: data, errors: {} });
    });

    test('omgjøring krever årsak og begrunnelse', () => {
        const resultat = vurderingFormValidation(
            skjema({ klageVurderingType: KlageVurderingTypeFormData.OMGJØR }),
        );

        expect(resultat.errors).toEqual({
            omgjør: {
                årsak: { type: 'required', message: 'Du må velge en årsak' },
                begrunnelse: { type: 'required', message: 'Begrunnelse kan ikke være tom' },
            },
        });
    });

    test('omgjøring med begrunnelse som bare består av mellomrom er ugyldig', () => {
        const resultat = vurderingFormValidation(
            skjema({
                klageVurderingType: KlageVurderingTypeFormData.OMGJØR,
                omgjør: { årsak: OmgjøringÅrsakFormData.ANNET, begrunnelse: ' \n\t ' },
            }),
        );

        expect(resultat.errors.omgjør?.begrunnelse?.message).toBe('Begrunnelse kan ikke være tom');
        expect(resultat.errors.omgjør?.årsak).toBeUndefined();
    });

    test('omgjøring krever ikke hjemler', () => {
        const resultat = vurderingFormValidation(
            skjema({
                klageVurderingType: KlageVurderingTypeFormData.OMGJØR,
                omgjør: { årsak: OmgjøringÅrsakFormData.ANNET, begrunnelse: 'Begrunnelse' },
                oppretthold: { hjemler: [] },
            }),
        );

        expect(resultat.errors).toEqual({});
    });

    test('opprettholdelse krever minst én hjemmel', () => {
        const resultat = vurderingFormValidation(
            skjema({ klageVurderingType: KlageVurderingTypeFormData.OPPRETTHOLD }),
        );

        expect(resultat.errors).toEqual({
            oppretthold: {
                hjemler: { type: 'required', message: 'Du må velge minst én hjemmel' },
            },
        });
    });

    test('opprettholdelse krever ikke årsak eller begrunnelse', () => {
        const resultat = vurderingFormValidation(
            skjema({
                klageVurderingType: KlageVurderingTypeFormData.OPPRETTHOLD,
                oppretthold: { hjemler: ['Arb.mark.lov §2'] },
            }),
        );

        expect(resultat.errors).toEqual({});
    });
});

describe('harKlagevurderingsstegUtfylt', () => {
    test('klage uten resultat er ikke vurdert', () => {
        expect(harKlagevurderingsstegUtfylt(klagebehandling())).toBe(false);
    });

    test('avvist klage har ikke et vurderingssteg', () => {
        expect(harKlagevurderingsstegUtfylt(klagebehandling({ resultat: avvistResultat() }))).toBe(
            false,
        );
    });

    test('omgjøring med begrunnelse er utfylt', () => {
        expect(harKlagevurderingsstegUtfylt(klagebehandling({ resultat: omgjørResultat() }))).toBe(
            true,
        );
    });

    test('omgjøring med tom begrunnelse er ikke utfylt', () => {
        const klage = klagebehandling({
            resultat: omgjørResultat({ begrunnelse: ikkeSladdet('   ') }),
        });
        expect(harKlagevurderingsstegUtfylt(klage)).toBe(false);
    });

    test('omgjøring med sladdet begrunnelse regnes som utfylt', () => {
        const klage = klagebehandling({ resultat: omgjørResultat({ begrunnelse: sladdet }) });
        expect(harKlagevurderingsstegUtfylt(klage)).toBe(true);
    });

    test('opprettholdelse er utfylt når minst én hjemmel er valgt', () => {
        const medHjemmel = klagebehandling({
            resultat: opprettholdtResultat({ hjemler: [Klagehjemmel.ARBEIDSMARKEDSLOVEN_2] }),
        });
        const utenHjemmel = klagebehandling({ resultat: opprettholdtResultat({ hjemler: [] }) });

        expect(harKlagevurderingsstegUtfylt(medHjemmel)).toBe(true);
        expect(harKlagevurderingsstegUtfylt(utenHjemmel)).toBe(false);
    });
});
