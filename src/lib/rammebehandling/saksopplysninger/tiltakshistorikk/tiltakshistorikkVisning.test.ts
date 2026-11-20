import { describe, expect, test } from '@jest/globals';
import {
    erNyEndring,
    erUtdatert,
    innslagForTiltak,
    sorterNyesteFørst,
} from './tiltakshistorikkVisning';
import { Tiltakshistorikkinnslag } from '~/lib/rammebehandling/typer/Tiltakshistorikk';
import { TiltaksdeltakelseKilde } from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { Tidspunkt } from '~/types/DatoTid';

const lagInnslag = (
    id: string,
    innhentet: string,
    overstyr: Partial<Tiltakshistorikkinnslag> = {},
): Tiltakshistorikkinnslag => ({
    id,
    internDeltakelseId: 'intern',
    eksternDeltagelseId: 'ekstern',
    innhentet: innhentet as Tidspunkt,
    typeNavn: 'Arbeidsmarkedsopplæring',
    periode: { fraOgMed: null, tilOgMed: null },
    deltakelseStatus: null,
    kildestatus: 'DELTAR',
    deltakelseProsent: null,
    antallDagerPerUke: null,
    gjennomforingsprosent: null,
    kilde: TiltaksdeltakelseKilde.KOMET,
    endringer: [],
    harRelevantEndring: true,
    utløsteBehandlingen: false,
    behandlingId: null,
    oppgaveId: null,
    verdi: {
        eksternDeltakelseId: 'ekstern',
        gjennomføringId: null,
        tiltakstype: 'ARBEIDSMARKEDSOPPLAERING',
        tiltakstypenavn: 'Arbeidsmarkedsopplæring',
        tiltakskodeFraKilden: 'AMO',
        fraOgMed: null,
        tilOgMed: null,
        kildestatus: {
            kilde: TiltaksdeltakelseKilde.KOMET,
            kodeIKontrakten: 'DELTAR',
            årsak: null,
            opprettet: '2025-05-01T08:00:00' as Tidspunkt,
        },
        deltakelsesprosent: null,
        dagerPerUke: null,
        deltidsprosentPåGjennomføring: null,
    },
    ...overstyr,
});

const sistEndret = '2025-05-01T12:00:00' as Tidspunkt;

describe('sorterNyesteFørst', () => {
    test('sorterer innslagene med det sist innhentede først', () => {
        const innslag = [
            lagInnslag('a', '2025-05-01T10:00:00'),
            lagInnslag('b', '2025-05-03T10:00:00'),
            lagInnslag('c', '2025-05-02T10:00:00'),
        ];

        expect(sorterNyesteFørst(innslag).map((it) => it.id)).toEqual(['b', 'c', 'a']);
    });
});

describe('erNyEndring', () => {
    test('er ny når innslaget har relevante endringer og er innhentet etter at behandlingen sist ble endret', () => {
        expect(erNyEndring(lagInnslag('a', '2025-05-01T12:00:01'), sistEndret)).toBe(true);
    });

    test('er ikke ny når innslaget ikke har relevante endringer', () => {
        expect(
            erNyEndring(
                lagInnslag('a', '2025-05-01T12:00:01', { harRelevantEndring: false }),
                sistEndret,
            ),
        ).toBe(false);
    });

    test('er ikke ny når innslaget er innhentet før eller samtidig med siste endring', () => {
        expect(erNyEndring(lagInnslag('a', '2025-05-01T12:00:00'), sistEndret)).toBe(false);
        expect(erNyEndring(lagInnslag('b', '2025-05-01T11:00:00'), sistEndret)).toBe(false);
    });

    test('innslaget som utløste behandlingen er aldri en ny endring', () => {
        expect(
            erNyEndring(
                lagInnslag('a', '2025-05-02T12:00:00', { utløsteBehandlingen: true }),
                sistEndret,
            ),
        ).toBe(false);
    });
});

describe('innslagForTiltak', () => {
    test('gir bare innslagene for tiltaket, med det nyeste først', () => {
        const innslag = [
            lagInnslag('a', '2025-05-01T10:00:00'),
            lagInnslag('annet', '2025-05-04T10:00:00', { internDeltakelseId: 'annet' }),
            lagInnslag('b', '2025-05-03T10:00:00'),
        ];

        expect(innslagForTiltak(innslag, 'intern').map((it) => it.id)).toEqual(['b', 'a']);
    });
});

describe('erUtdatert', () => {
    const oppslagstidspunkt = '2025-05-01T09:00:00' as Tidspunkt;

    test('er utdatert når det nyeste innslaget har relevante endringer og er innhentet etter oppslaget', () => {
        const innslag = [
            lagInnslag('a', '2025-04-01T10:00:00', { harRelevantEndring: false }),
            lagInnslag('b', '2025-05-01T09:00:01'),
        ];

        expect(erUtdatert(innslag, oppslagstidspunkt)).toBe(true);
    });

    test('er ikke utdatert når innslag etter oppslaget ikke har relevante endringer', () => {
        const innslag = [
            lagInnslag('a', '2025-04-01T10:00:00'),
            lagInnslag('b', '2025-05-01T09:00:01', { harRelevantEndring: false }),
        ];

        expect(erUtdatert(innslag, oppslagstidspunkt)).toBe(false);
    });

    test('er ikke utdatert når innslagene er innhentet før oppslaget, eller utløste behandlingen', () => {
        const innslag = [
            lagInnslag('a', '2025-05-01T09:00:00'),
            lagInnslag('b', '2025-05-01T10:00:00', { utløsteBehandlingen: true }),
        ];

        expect(erUtdatert(innslag, oppslagstidspunkt)).toBe(false);
    });
});
