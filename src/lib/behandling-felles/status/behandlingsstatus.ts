import { AkselColor } from '@navikt/ds-react/types/theme';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import { MeldekortbehandlingStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { Behandlingsstatus } from '~/lib/behandling-felles/typer/BehandlingFelles';

export const behandlingsstatusTekst = (status: Behandlingsstatus): string => {
    switch (status) {
        case Rammebehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING:
            return 'Under automatisk behandling';
        case MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET:
            return 'Automatisk behandlet';
        case Rammebehandlingsstatus.KLAR_TIL_BEHANDLING:
        case MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING:
            return 'Klar til behandling';
        case Rammebehandlingsstatus.UNDER_BEHANDLING:
        case MeldekortbehandlingStatus.UNDER_BEHANDLING:
            return 'Under behandling';
        case Rammebehandlingsstatus.KLAR_TIL_BESLUTNING:
        case MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING:
            return 'Klar til beslutning';
        case Rammebehandlingsstatus.UNDER_BESLUTNING:
        case MeldekortbehandlingStatus.UNDER_BESLUTNING:
            return 'Under beslutning';
        case Rammebehandlingsstatus.VEDTATT:
            return 'Vedtatt';
        case MeldekortbehandlingStatus.GODKJENT:
            return 'Godkjent';
        case MeldekortbehandlingStatus.IKKE_RETT_TIL_TILTAKSPENGER:
            return 'Ikke rett til tiltakspenger';
        case Rammebehandlingsstatus.AVBRUTT:
        case MeldekortbehandlingStatus.AVBRUTT:
            return 'Avbrutt';
        default:
            return ukjentStatus(status, 'Ukjent status');
    }
};

export const behandlingsstatusFarge = (status: Behandlingsstatus): AkselColor => {
    switch (status) {
        case Rammebehandlingsstatus.KLAR_TIL_BEHANDLING:
        case MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING:
        case Rammebehandlingsstatus.UNDER_BEHANDLING:
        case MeldekortbehandlingStatus.UNDER_BEHANDLING:
            return 'info';
        case Rammebehandlingsstatus.KLAR_TIL_BESLUTNING:
        case MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING:
        case Rammebehandlingsstatus.UNDER_BESLUTNING:
        case MeldekortbehandlingStatus.UNDER_BESLUTNING:
            return 'meta-purple';
        case Rammebehandlingsstatus.VEDTATT:
        case MeldekortbehandlingStatus.GODKJENT:
        case MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET:
            return 'success';
        case MeldekortbehandlingStatus.IKKE_RETT_TIL_TILTAKSPENGER:
            return 'warning';
        case Rammebehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING:
        case Rammebehandlingsstatus.AVBRUTT:
        case MeldekortbehandlingStatus.AVBRUTT:
            return 'neutral';
        default:
            return ukjentStatus(status, 'neutral');
    }
};

/** Sikrer at alle statuser er dekket av switchene over */
export const ukjentStatus = <T>(status: never, fallback: T): T => {
    console.error(`Ukjent behandlingsstatus: ${status}`);
    return fallback;
};
