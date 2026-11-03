import { describe, expect, test } from '@jest/globals';
import {
    erBehandlingSattPåVent,
    erBehandlingUnderkjent,
    erMeldekortId,
    erRammebehandlingId,
} from '~/lib/behandling-felles/utils/behandlingUtils';
import { BehandlingId } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { VentestatusHendelse } from '~/lib/behandling-felles/typer/Ventestatus';
import { Attestering, Attesteringsstatus } from '~/lib/behandling-felles/typer/Attestering';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { Tidspunkt, tilTidspunkt } from '~/types/DatoTid';

const ventestatus = (erSattPåVent: boolean, tidspunkt: Tidspunkt): VentestatusHendelse => ({
    sattPåVentAv: 'Z123456',
    tidspunkt,
    begrunnelse: ikkeSladdet('Venter på dokumentasjon'),
    erSattPåVent,
    frist: null,
    status: 'UNDER_BEHANDLING',
});

const attestering = (status: Attesteringsstatus, endretTidspunkt: Tidspunkt): Attestering => ({
    status,
    begrunnelse: ikkeSladdet(null),
    endretAv: 'Z654321',
    endretTidspunkt,
});

describe('behandlings-id', () => {
    test('skiller rammebehandlinger og meldekortbehandlinger på prefikset', () => {
        const rammebehandlingId = 'beh_01HXYZ' as BehandlingId;
        const meldekortId = 'meldekort_01HXYZ' as BehandlingId;

        expect(erRammebehandlingId(rammebehandlingId)).toBe(true);
        expect(erMeldekortId(rammebehandlingId)).toBe(false);
        expect(erMeldekortId(meldekortId)).toBe(true);
        expect(erRammebehandlingId(meldekortId)).toBe(false);
    });

    test('prefikset må stå først i id-en', () => {
        expect(erRammebehandlingId('meldekort_beh_1' as BehandlingId)).toBe(false);
    });
});

describe('erBehandlingSattPåVent', () => {
    // Backend sender ventestatus sortert med nyeste hendelse først
    test('avgjøres av den nyeste hendelsen', () => {
        expect(
            erBehandlingSattPåVent({
                ventestatus: [
                    ventestatus(true, tilTidspunkt('2025-01-03T10:00:00')),
                    ventestatus(false, tilTidspunkt('2025-01-02T10:00:00')),
                    ventestatus(true, tilTidspunkt('2025-01-01T10:00:00')),
                ],
            }),
        ).toBe(true);

        expect(
            erBehandlingSattPåVent({
                ventestatus: [
                    ventestatus(false, tilTidspunkt('2025-01-02T10:00:00')),
                    ventestatus(true, tilTidspunkt('2025-01-01T10:00:00')),
                ],
            }),
        ).toBe(false);
    });

    test('uten hendelser er behandlingen ikke på vent', () => {
        expect(erBehandlingSattPåVent({ ventestatus: [] })).toBe(false);
    });
});

describe('erBehandlingUnderkjent', () => {
    // Backend sender attesteringene sortert med eldste først
    test('avgjøres av den siste attesteringen', () => {
        expect(
            erBehandlingUnderkjent({
                attesteringer: [
                    attestering(Attesteringsstatus.GODKJENT, tilTidspunkt('2025-01-01T10:00:00')),
                    attestering(
                        Attesteringsstatus.SENDT_TILBAKE,
                        tilTidspunkt('2025-01-02T10:00:00'),
                    ),
                ],
            }),
        ).toBe(true);
    });

    test('en behandling som er sendt tilbake og deretter godkjent er ikke underkjent', () => {
        expect(
            erBehandlingUnderkjent({
                attesteringer: [
                    attestering(
                        Attesteringsstatus.SENDT_TILBAKE,
                        tilTidspunkt('2025-01-01T10:00:00'),
                    ),
                    attestering(Attesteringsstatus.GODKJENT, tilTidspunkt('2025-01-02T10:00:00')),
                ],
            }),
        ).toBe(false);
    });

    test('uten attesteringer er behandlingen ikke underkjent', () => {
        expect(erBehandlingUnderkjent({ attesteringer: [] })).toBe(false);
    });
});
