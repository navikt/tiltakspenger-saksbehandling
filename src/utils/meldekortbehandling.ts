import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
} from '~/types/meldekort/Meldekortbehandling';

export const erMeldekortbehandlingUnderAktivBehandling = (m: MeldekortbehandlingProps) =>
    m.status === MeldekortbehandlingStatus.UNDER_BEHANDLING ||
    m.status === MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING ||
    m.status === MeldekortbehandlingStatus.UNDER_BESLUTNING;
