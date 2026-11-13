import { describe, expect, test } from '@jest/globals';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';
import { delOppTiltaksdeltakelser, tiltaksnavnTekst } from './tiltaksdeltakelseVisning';
import {
    Tiltaksdeltakelse,
    TiltaksdeltakelseKilde,
    TiltakDeltakerstatus,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { Dato, tilDato } from '~/types/DatoTid';

const tiltak = (id: string, fraOgMed: Dato | null, tilOgMed: Dato | null): Tiltaksdeltakelse => ({
    eksternDeltagelseId: id,
    gjennomføringId: null,
    typeNavn: 'Arbeidsmarkedsopplæring',
    periode: { fraOgMed, tilOgMed },
    deltakelseStatus: TiltakDeltakerstatus.DELTAR,
    deltakelseProsent: null,
    antallDagerPerUke: null,
    kilde: TiltaksdeltakelseKilde.ARENA,
    gjennomforingsprosent: null,
    internDeltakelseId: id,
    kanInnvilges: false,
});

const vurderingsperiode = { fraOgMed: tilDato('2025-01-01'), tilOgMed: tilDato('2025-06-30') };

test('sorterer nyeste tiltak øverst', () => {
    const { aktuelle } = delOppTiltaksdeltakelser(
        [
            tiltak('a', tilDato('2025-01-01'), tilDato('2025-03-31')),
            tiltak('c', tilDato('2025-05-01'), tilDato('2025-08-31')),
            tiltak('b', tilDato('2025-03-01'), tilDato('2025-06-30')),
        ],
        vurderingsperiode,
    );

    expect(aktuelle.map((t) => t.eksternDeltagelseId)).toEqual(['c', 'b', 'a']);
});

test('skiller ut tiltak som er avsluttet før vurderingsperioden som historikk', () => {
    const { aktuelle, historiske } = delOppTiltaksdeltakelser(
        [
            tiltak('gammelt', tilDato('2023-01-01'), tilDato('2023-12-31')),
            tiltak('aktuelt', tilDato('2025-02-01'), tilDato('2025-05-31')),
        ],
        vurderingsperiode,
    );

    expect(aktuelle.map((t) => t.eksternDeltagelseId)).toEqual(['aktuelt']);
    expect(historiske.map((t) => t.eksternDeltagelseId)).toEqual(['gammelt']);
});

test('tiltak uten sluttdato regnes alltid som aktuelt', () => {
    const { aktuelle, historiske } = delOppTiltaksdeltakelser(
        [tiltak('uten-datoer', null, null)],
        vurderingsperiode,
    );

    expect(aktuelle).toHaveLength(1);
    expect(historiske).toHaveLength(0);
});

describe('tiltaksnavnTekst', () => {
    const oppslag = {
        tiltaksdata: [
            {
                eksternDeltakelseId: 'a',
                internDeltakelseId: 'a',
                tittel: ikkeSladdet('Kurs hos A'),
            },
            { eksternDeltakelseId: 'b', internDeltakelseId: null, tittel: ikkeSladdet(null) },
            { eksternDeltakelseId: 'c', internDeltakelseId: 'c', tittel: sladdet },
        ],
        isLoading: false,
        error: undefined,
    };

    test('viser tittelen til deltakelsen', () => {
        expect(tiltaksnavnTekst(oppslag, 'a')).toBe('Kurs hos A');
    });

    test('viser ukjent når deltakelsen mangler tittel eller ikke finnes', () => {
        expect(tiltaksnavnTekst(oppslag, 'b')).toBe('Ukjent');
        expect(tiltaksnavnTekst(oppslag, 'x')).toBe('Ukjent');
    });

    test('viser sladdet tittel som sladdet', () => {
        expect(tiltaksnavnTekst(oppslag, 'c')).toBe('[Sladdet]');
    });

    test('viser at tittelen hentes eller ikke kunne hentes', () => {
        expect(tiltaksnavnTekst({ ...oppslag, isLoading: true }, 'a')).toBe('Henter...');
        expect(tiltaksnavnTekst({ ...oppslag, error: new Error() }, 'a')).toBe('<henting feilet>');
    });
});
