import { expect, test } from '@jest/globals';
import { delOppTiltaksdeltakelser } from './tiltaksdeltakelseVisning';
import {
    Tiltaksdeltakelse,
    TiltaksdeltakelseKilde,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';

const tiltak = (
    id: string,
    deltagelseFraOgMed: string | null,
    deltagelseTilOgMed: string | null,
): Tiltaksdeltakelse => ({
    eksternDeltagelseId: id,
    gjennomføringId: null,
    typeNavn: 'Arbeidsmarkedsopplæring',
    typeKode: 'AMO',
    deltagelseFraOgMed,
    deltagelseTilOgMed,
    deltakelseStatus: 'DELTAR',
    deltakelseProsent: null,
    antallDagerPerUke: null,
    kilde: TiltaksdeltakelseKilde.ARENA,
    gjennomforingsprosent: null,
    internDeltakelseId: id,
});

const vurderingsperiode = { fraOgMed: '2025-01-01', tilOgMed: '2025-06-30' };

test('sorterer nyeste tiltak øverst', () => {
    const { aktuelle } = delOppTiltaksdeltakelser(
        [
            tiltak('a', '2025-01-01', '2025-03-31'),
            tiltak('c', '2025-05-01', '2025-08-31'),
            tiltak('b', '2025-03-01', '2025-06-30'),
        ],
        vurderingsperiode,
    );

    expect(aktuelle.map((t) => t.eksternDeltagelseId)).toEqual(['c', 'b', 'a']);
});

test('skiller ut tiltak som er avsluttet før vurderingsperioden som historikk', () => {
    const { aktuelle, historiske } = delOppTiltaksdeltakelser(
        [
            tiltak('gammelt', '2023-01-01', '2023-12-31'),
            tiltak('aktuelt', '2025-02-01', '2025-05-31'),
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
