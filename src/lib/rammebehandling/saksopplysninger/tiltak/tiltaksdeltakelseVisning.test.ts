import { describe, expect, test } from '@jest/globals';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';
import {
    avkortGjennomføringsnavn,
    delOppTiltaksdeltakelser,
    tiltaksdataTekst,
} from './tiltaksdeltakelseVisning';
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

describe('tiltaksdataTekst', () => {
    const oppslag = {
        tiltaksdata: [
            {
                eksternDeltakelseId: 'a',
                internDeltakelseId: 'a',
                tittel: ikkeSladdet('Kurs hos A'),
                gjennomføringsnavn: ikkeSladdet('Sveisekurs, Strandveien'),
            },
            {
                eksternDeltakelseId: 'b',
                internDeltakelseId: null,
                tittel: ikkeSladdet(null),
                gjennomføringsnavn: ikkeSladdet(null),
            },
            {
                eksternDeltakelseId: 'c',
                internDeltakelseId: 'c',
                tittel: sladdet,
                gjennomføringsnavn: sladdet,
            },
        ],
        isLoading: false,
        error: undefined,
    };

    test('viser tittelen og gjennomføringsnavnet til deltakelsen', () => {
        expect(tiltaksdataTekst(oppslag, 'a', 'tittel')).toBe('Kurs hos A');
        expect(tiltaksdataTekst(oppslag, 'a', 'gjennomføringsnavn')).toBe(
            'Sveisekurs, Strandveien',
        );
    });

    test('viser ukjent når deltakelsen mangler verdien eller ikke finnes', () => {
        expect(tiltaksdataTekst(oppslag, 'b', 'gjennomføringsnavn')).toBe('Ukjent');
        expect(tiltaksdataTekst(oppslag, 'x', 'tittel')).toBe('Ukjent');
    });

    test('viser sladdet verdi som sladdet', () => {
        expect(tiltaksdataTekst(oppslag, 'c', 'gjennomføringsnavn')).toBe('[Sladdet]');
    });

    test('viser at verdien hentes eller ikke kunne hentes', () => {
        expect(tiltaksdataTekst({ ...oppslag, isLoading: true }, 'a', 'tittel')).toBe('Henter...');
        expect(tiltaksdataTekst({ ...oppslag, error: new Error() }, 'a', 'tittel')).toBe(
            '<henting feilet>',
        );
    });
});

describe('avkortGjennomføringsnavn', () => {
    test('viser navn på inntil 75 tegn i sin helhet', () => {
        const navn = 'a'.repeat(75);
        expect(avkortGjennomføringsnavn(navn)).toEqual({ visning: navn, avkortet: false });
    });

    test('avkorter navn over 75 tegn til 72 tegn etterfulgt av ...', () => {
        const { visning, avkortet } = avkortGjennomføringsnavn('a'.repeat(72) + 'bcde');
        expect(visning).toBe('a'.repeat(72) + '...');
        expect(avkortet).toBe(true);
    });
});
