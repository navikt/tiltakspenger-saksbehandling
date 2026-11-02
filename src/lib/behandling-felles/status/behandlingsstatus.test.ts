import { afterEach, describe, expect, jest, test } from '@jest/globals';
import {
    behandlingsstatusFarge,
    behandlingsstatusTekst,
} from '~/lib/behandling-felles/status/behandlingsstatus';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import { MeldekortbehandlingStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { Behandlingsstatus } from '~/lib/behandling-felles/typer/BehandlingFelles';

const alleStatuser: Behandlingsstatus[] = [
    ...Object.values(Rammebehandlingsstatus),
    ...Object.values(MeldekortbehandlingStatus),
];

describe('behandlingsstatus', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('alle kjente statuser har egen tekst og farge, uten å logge feil', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        alleStatuser.forEach((status) => {
            expect(behandlingsstatusTekst(status)).not.toBe('Ukjent status');
            behandlingsstatusFarge(status);
        });

        expect(consoleError).not.toHaveBeenCalled();
    });

    test('statuser med samme navn vises likt for rammebehandlinger og meldekortbehandlinger', () => {
        const felles = Object.values(Rammebehandlingsstatus).filter((status) =>
            Object.values<string>(MeldekortbehandlingStatus).includes(status),
        );

        expect(felles.length).toBeGreaterThan(0);
        felles.forEach((status) => {
            const meldekortstatus = status as unknown as MeldekortbehandlingStatus;

            expect(behandlingsstatusTekst(status)).toBe(behandlingsstatusTekst(meldekortstatus));
            expect(behandlingsstatusFarge(status)).toBe(behandlingsstatusFarge(meldekortstatus));
        });
    });

    test('ferdigbehandlede behandlinger vises som vellykket, avbrutte nøytralt', () => {
        expect(behandlingsstatusFarge(Rammebehandlingsstatus.VEDTATT)).toBe('success');
        expect(behandlingsstatusFarge(MeldekortbehandlingStatus.GODKJENT)).toBe('success');
        expect(behandlingsstatusFarge(MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET)).toBe(
            'success',
        );
        expect(behandlingsstatusFarge(Rammebehandlingsstatus.AVBRUTT)).toBe('neutral');
        expect(behandlingsstatusFarge(MeldekortbehandlingStatus.AVBRUTT)).toBe('neutral');
    });

    test('ukjent status fra backend gir en fallback og logger feil, i stedet for å kræsje', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        const ukjent = 'NY_STATUS' as Behandlingsstatus;

        expect(behandlingsstatusTekst(ukjent)).toBe('Ukjent status');
        expect(behandlingsstatusFarge(ukjent)).toBe('neutral');
        expect(consoleError).toHaveBeenCalledWith('Ukjent behandlingsstatus: NY_STATUS');
    });
});
