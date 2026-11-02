import { describe, expect, test } from '@jest/globals';
import {
    BrevFormData,
    brevFormDataTilForhåndsvisBrevKlageRequest,
    brevFormDataTilLagreBrevtekstKlageRequest,
    brevFormValidation,
    klageTilBrevFormData,
} from './BrevFormUtils';
import {
    Klagebehandling,
    KlagebehandlingsresultatAvvist,
    KlagebehandlingsresultatOpprettholdt,
} from '~/lib/klage/typer/Klage';
import { SLADDET_TEKST_DEFAULT } from '~/utils/sladdetVerdi';
import { periode, rammevedtak } from '~test/rammebehandling';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';
import { avvistResultat, formkrav, klagebehandling, opprettholdtResultat } from '~test/klage';

type KlageMedBrev = Klagebehandling & {
    resultat: KlagebehandlingsresultatOpprettholdt | KlagebehandlingsresultatAvvist;
};

const klageMedResultat = (
    resultat: KlagebehandlingsresultatOpprettholdt | KlagebehandlingsresultatAvvist,
): KlageMedBrev =>
    klagebehandling({
        formkrav: formkrav({ innsendingsdato: '2025-04-01' }),
        resultat,
    }) as KlageMedBrev;

const påklagetVedtak = rammevedtak('vedtak_1', periode('2025-01-01', '2025-03-31'), {
    opprettet: '2025-01-15T09:00:00',
});

describe('brevFormValidation', () => {
    test('brev med utfylte avsnitt er gyldig', () => {
        const data: BrevFormData = { tekstfelter: [{ tittel: 'Tittel', tekst: 'Tekst' }] };
        expect(brevFormValidation(data)).toEqual({ values: data, errors: {} });
    });

    test('brev uten avsnitt er ugyldig', () => {
        expect(brevFormValidation({ tekstfelter: [] }).errors).toEqual({
            tekstfelter: {
                type: 'required',
                message: 'Du må legge til minst ett avsnitt i brevet',
            },
        });
    });

    test('feil knyttes til riktig avsnitt og felt', () => {
        const resultat = brevFormValidation({
            tekstfelter: [
                { tittel: 'Gyldig', tekst: 'Gyldig' },
                { tittel: '   ', tekst: 'Tekst' },
                { tittel: 'Tittel', tekst: '\n' },
                { tittel: '', tekst: '' },
            ],
        });

        const feil = resultat.errors.tekstfelter as unknown as Array<
            Record<string, { message: string }> | undefined
        >;
        expect(feil[0]).toBeUndefined();
        expect(Object.keys(feil[1] ?? {})).toEqual(['tittel']);
        expect(Object.keys(feil[2] ?? {})).toEqual(['tekst']);
        expect(feil[3]?.tittel.message).toBe('Tittelen kan ikke være tom');
        expect(feil[3]?.tekst.message).toBe('Avsnittet kan ikke være tomt');
        expect(resultat.values).toEqual({});
    });
});

describe('klageTilBrevFormData', () => {
    test('bruker lagrede brevtekster når de finnes', () => {
        const klage = klageMedResultat(
            opprettholdtResultat({
                brevtekst: [
                    { tittel: 'Første', tekst: ikkeSladdet('Lagret tekst') },
                    { tittel: 'Andre', tekst: sladdet },
                ],
            }),
        );

        expect(klageTilBrevFormData(klage, null)).toEqual({
            tekstfelter: [
                { tittel: 'Første', tekst: 'Lagret tekst' },
                { tittel: 'Andre', tekst: SLADDET_TEKST_DEFAULT },
            ],
        });
    });

    test('opprettholdelse uten lagrede tekster får standardavsnitt med klage- og vedtaksdato', () => {
        const klage = klageMedResultat(opprettholdtResultat({ brevtekst: [] }));

        expect(klageTilBrevFormData(klage, påklagetVedtak)).toEqual({
            tekstfelter: [
                {
                    tittel: 'Hva klagesaken gjelder',
                    tekst: 'Vi viser til klage av 01.04.2025 på vedtak av 15.01.2025 der <kort om resultatet i vedtaket>',
                },
                { tittel: 'Klagers anførsler', tekst: '' },
                { tittel: 'Vurdering av klagen', tekst: '' },
            ],
        });
    });

    test('opprettholdelse uten lagrede tekster kaster når påklaget vedtak mangler', () => {
        const klage = klageMedResultat(opprettholdtResultat({ brevtekst: [] }));
        expect(() => klageTilBrevFormData(klage, null)).toThrow();
    });

    test('avvisning uten lagrede tekster får ett tomt avsnitt', () => {
        const klage = klageMedResultat(avvistResultat({ brevtekst: [] }));

        expect(klageTilBrevFormData(klage, null)).toEqual({
            tekstfelter: [{ tittel: '', tekst: '' }],
        });
    });
});

describe('brevFormDataTil...Request', () => {
    const data: BrevFormData = {
        tekstfelter: [
            { tittel: 'Tittel', tekst: 'Tekst' },
            { tittel: 'Uten tekst', tekst: '  ' },
            { tittel: '', tekst: 'Uten tittel' },
        ],
    };

    test('forhåndsvisning tar bare med avsnitt med både tittel og tekst', () => {
        expect(brevFormDataTilForhåndsvisBrevKlageRequest(data)).toEqual({
            tekstTilVedtaksbrev: [{ tittel: 'Tittel', tekst: 'Tekst' }],
        });
    });

    test('lagring sender alle avsnittene uendret (skjemaet valideres før lagring)', () => {
        expect(brevFormDataTilLagreBrevtekstKlageRequest(data)).toEqual({
            tekstTilVedtaksbrev: data.tekstfelter,
        });
    });
});
