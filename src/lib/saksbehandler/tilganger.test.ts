import { describe, expect, test } from '@jest/globals';
import {
    hentRolleForBehandling,
    kanBeslutte,
    kanSaksbehandle,
    kanSaksbehandleEllerBeslutte,
} from '~/lib/saksbehandler/tilganger';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';

const med = (...gyldigeKommandoer: SaksbehandlerBehandlingKommando[]) => ({ gyldigeKommandoer });

describe('tilganger fra gyldigeKommandoer', () => {
    test('saksbehandler kan behandle når backend gir Saksbehandle', () => {
        const behandling = med(
            SaksbehandlerBehandlingKommando.Saksbehandle,
            SaksbehandlerBehandlingKommando.SettPåVent,
        );

        expect(kanSaksbehandle(behandling)).toBe(true);
        expect(kanBeslutte(behandling)).toBe(false);
        expect(kanSaksbehandleEllerBeslutte(behandling)).toBe(true);
        expect(hentRolleForBehandling(behandling)).toBe(SaksbehandlerRolle.SAKSBEHANDLER);
    });

    test('beslutter kan beslutte når backend gir Beslutte', () => {
        const behandling = med(SaksbehandlerBehandlingKommando.Beslutte);

        expect(kanSaksbehandle(behandling)).toBe(false);
        expect(kanBeslutte(behandling)).toBe(true);
        expect(kanSaksbehandleEllerBeslutte(behandling)).toBe(true);
        expect(hentRolleForBehandling(behandling)).toBe(SaksbehandlerRolle.BESLUTTER);
    });

    test('andre kommandoer, som å tildele seg eller overta, gir ikke rett til å behandle', () => {
        const behandling = med(
            SaksbehandlerBehandlingKommando.TildelSaksbehandler,
            SaksbehandlerBehandlingKommando.TildelBeslutter,
            SaksbehandlerBehandlingKommando.OvertaSaksbehandler,
            SaksbehandlerBehandlingKommando.OvertaBeslutter,
        );

        expect(kanSaksbehandleEllerBeslutte(behandling)).toBe(false);
        expect(hentRolleForBehandling(behandling)).toBeNull();
    });

    test('ingen kommandoer gir ingen rolle', () => {
        expect(kanSaksbehandleEllerBeslutte(med())).toBe(false);
        expect(hentRolleForBehandling(med())).toBeNull();
    });

    test('saksbehandlerrollen går foran beslutterrollen om backend gir begge', () => {
        expect(
            hentRolleForBehandling(
                med(
                    SaksbehandlerBehandlingKommando.Beslutte,
                    SaksbehandlerBehandlingKommando.Saksbehandle,
                ),
            ),
        ).toBe(SaksbehandlerRolle.SAKSBEHANDLER);
    });
});
