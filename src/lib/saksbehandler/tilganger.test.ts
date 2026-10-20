import { describe, expect, test } from '@jest/globals';
import { hentRolleForBehandling } from '~/lib/saksbehandler/tilganger';
import { Saksbehandler, SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';
import {
    Rammebehandling,
    Rammebehandlingsstatus,
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { AUTOMATISK_SAKSBEHANDLER_IDENT } from '~/lib/benk/typer/felles';

const INNLOGGET_IDENT = 'Z111111';
const MANUELL_SAKSBEHANDLER_IDENT = 'Z222222';

const innlogget = (roller: SaksbehandlerRolle[]): Saksbehandler => ({
    brukernavn: 'Test Testesen',
    epost: 'test@nav.no',
    navIdent: INNLOGGET_IDENT,
    roller,
    sladdes: false,
    kanSeBenken: true,
});

type TestbehandlingProps = {
    type: Rammebehandlingstype;
    automatiskSaksbehandlet?: boolean;
    saksbehandler?: string;
};

// Bare feltene tilgangssjekkene leser. Behandlingen er tatt til beslutning av den innloggede.
const behandlingUnderBeslutning = ({
    type,
    automatiskSaksbehandlet = false,
    saksbehandler = automatiskSaksbehandlet
        ? AUTOMATISK_SAKSBEHANDLER_IDENT
        : MANUELL_SAKSBEHANDLER_IDENT,
}: TestbehandlingProps): Rammebehandling =>
    ({
        type,
        status: Rammebehandlingsstatus.UNDER_BESLUTNING,
        saksbehandler,
        beslutter: INNLOGGET_IDENT,
        ventestatus: [],
        ...(type === Rammebehandlingstype.SØKNADSBEHANDLING && { automatiskSaksbehandlet }),
    }) as unknown as Rammebehandling;

const kunSaksbehandler = innlogget([SaksbehandlerRolle.SAKSBEHANDLER]);
const kunBeslutter = innlogget([SaksbehandlerRolle.BESLUTTER]);
const saksbehandlerOgBeslutter = innlogget([
    SaksbehandlerRolle.SAKSBEHANDLER,
    SaksbehandlerRolle.BESLUTTER,
]);

describe('hentRolleForBehandling under beslutning', () => {
    test('beslutter på manuelt innstilt søknad får rollen beslutter', () => {
        const behandling = behandlingUnderBeslutning({
            type: Rammebehandlingstype.SØKNADSBEHANDLING,
        });

        expect(hentRolleForBehandling(behandling, kunBeslutter)).toBe(SaksbehandlerRolle.BESLUTTER);
    });

    test('beslutter på delautomatisk innstilt søknad får rollen beslutter', () => {
        const behandling = behandlingUnderBeslutning({
            type: Rammebehandlingstype.SØKNADSBEHANDLING,
            automatiskSaksbehandlet: true,
        });

        expect(hentRolleForBehandling(behandling, kunBeslutter)).toBe(SaksbehandlerRolle.BESLUTTER);
    });

    test('saksbehandler uten beslutterrolle på delautomatisk innstilt søknad får rollen beslutter', () => {
        const behandling = behandlingUnderBeslutning({
            type: Rammebehandlingstype.SØKNADSBEHANDLING,
            automatiskSaksbehandlet: true,
        });

        expect(hentRolleForBehandling(behandling, kunSaksbehandler)).toBe(
            SaksbehandlerRolle.BESLUTTER,
        );
    });

    test('saksbehandler uten beslutterrolle på manuelt innstilt søknad får ingen rolle', () => {
        const behandling = behandlingUnderBeslutning({
            type: Rammebehandlingstype.SØKNADSBEHANDLING,
        });

        expect(hentRolleForBehandling(behandling, kunSaksbehandler)).toBeNull();
    });

    test('saksbehandler uten beslutterrolle på revurdering får ingen rolle', () => {
        const behandling = behandlingUnderBeslutning({
            type: Rammebehandlingstype.REVURDERING,
            saksbehandler: AUTOMATISK_SAKSBEHANDLER_IDENT,
        });

        expect(hentRolleForBehandling(behandling, kunSaksbehandler)).toBeNull();
    });

    test('beslutter som selv var saksbehandler på behandlingen får ingen rolle', () => {
        const behandling = behandlingUnderBeslutning({
            type: Rammebehandlingstype.SØKNADSBEHANDLING,
            saksbehandler: INNLOGGET_IDENT,
        });

        expect(hentRolleForBehandling(behandling, saksbehandlerOgBeslutter)).toBeNull();
    });

    test('saksbehandler uten beslutterrolle som ikke er tildelt behandlingen får ingen rolle', () => {
        const behandling = {
            ...behandlingUnderBeslutning({
                type: Rammebehandlingstype.SØKNADSBEHANDLING,
                automatiskSaksbehandlet: true,
            }),
            beslutter: 'Z333333',
        } as Rammebehandling;

        expect(hentRolleForBehandling(behandling, kunSaksbehandler)).toBeNull();
    });
});
