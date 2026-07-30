import { AkselColor } from '@navikt/ds-react/types/theme';
import { MeldekortbehandlingStatus } from '~/lib/meldekort/typer/Meldekortbehandling';

export const meldekortbehandlingStatusFarge: Record<MeldekortbehandlingStatus, AkselColor> = {
    [MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING]: 'info',
    [MeldekortbehandlingStatus.UNDER_BEHANDLING]: 'info',
    [MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING]: 'meta-purple',
    [MeldekortbehandlingStatus.UNDER_BESLUTNING]: 'meta-purple',
    [MeldekortbehandlingStatus.GODKJENT]: 'success',
    [MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET]: 'success',
    [MeldekortbehandlingStatus.IKKE_RETT_TIL_TILTAKSPENGER]: 'warning',
    [MeldekortbehandlingStatus.AVBRUTT]: 'neutral',
} as const;
