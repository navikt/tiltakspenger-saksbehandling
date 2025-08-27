import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
} from '~/types/meldekort/MeldekortBehandling';

export const erMeldekortBehandlingUnderAktivBehandling = (m: MeldekortBehandlingProps) =>
    m.status === MeldekortBehandlingStatus.UNDER_BEHANDLING ||
    m.status === MeldekortBehandlingStatus.KLAR_TIL_BESLUTNING ||
    m.status === MeldekortBehandlingStatus.UNDER_BESLUTNING;
