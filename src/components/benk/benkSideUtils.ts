import { BenkBehandlingsstatus, BenkBehandlingstype } from '~/types/Benk';

export const behandlingstypeTextFormatter: Record<BenkBehandlingstype, string> = {
    [BenkBehandlingstype.SØKNADSBEHANDLING]: 'Søknadsbehandling',
    [BenkBehandlingstype.REVURDERING]: 'Revurdering',
    [BenkBehandlingstype.MELDEKORTBEHANDLING]: 'Meldekortbehandling',
    [BenkBehandlingstype.INNSENDT_MELDEKORT]: 'Innsendt meldekort',
    [BenkBehandlingstype.KORRIGERT_MELDEKORT]: 'Korrigert meldekort',
    [BenkBehandlingstype.KLAGEBEHANDLING]: 'Klagebehandling',
    [BenkBehandlingstype.TILBAKEKREVING]: 'Tilbakekreving',
} as const;

export const behandlingsstatusTextFormatter: Record<BenkBehandlingsstatus, string> = {
    [BenkBehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING]: 'Under automatisk behandling',
    [BenkBehandlingsstatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [BenkBehandlingsstatus.UNDER_BEHANDLING]: 'Under behandling',
    [BenkBehandlingsstatus.KLAR_TIL_BESLUTNING]: 'Klar til beslutning',
    [BenkBehandlingsstatus.UNDER_BESLUTNING]: 'Under beslutning',
    [BenkBehandlingsstatus.KLAR_TIL_FERDIGSTILLING]: 'Klar til ferdigstilling',
} as const;
