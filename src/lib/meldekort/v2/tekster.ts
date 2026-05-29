import {
    MeldekortbehandlingStatus,
    MeldekortbehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';

export const meldekortbehandlingTypeTekst: Record<MeldekortbehandlingType, string> = {
    [MeldekortbehandlingType.FØRSTE_BEHANDLING]: 'Førstegangsbehandling',
    [MeldekortbehandlingType.KORRIGERING]: 'Korrigering',
} as const;

export const meldekortbehandlingStatusTekst: Record<MeldekortbehandlingStatus, string> = {
    [MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [MeldekortbehandlingStatus.UNDER_BEHANDLING]: 'Under behandling',
    [MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING]: 'Klar til beslutning',
    [MeldekortbehandlingStatus.UNDER_BESLUTNING]: 'Under beslutning',
    [MeldekortbehandlingStatus.GODKJENT]: 'Godkjent',
    [MeldekortbehandlingStatus.IKKE_RETT_TIL_TILTAKSPENGER]: 'Ikke rett til tiltakspenger',
    [MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET]: 'Automatisk behandlet',
    [MeldekortbehandlingStatus.AVBRUTT]: 'Avbrutt',
} as const;
