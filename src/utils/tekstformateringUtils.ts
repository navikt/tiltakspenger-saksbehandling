import { BehandlingStatus, Behandlingstype } from '../types/BehandlingTypes';
import {
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingType,
    Utbetalingsstatus,
} from '../types/meldekort/MeldekortBehandling';
import { BrukersMeldekortDagStatus } from '../types/meldekort/BrukersMeldekort';
import { MeldeperiodeKjedeStatus } from '../types/meldekort/Meldeperiode';

export const finnBehandlingStatusTekst = (status: BehandlingStatus, underkjent: boolean) => {
    switch (status) {
        case BehandlingStatus.VEDTATT:
            return 'Vedtatt';
        case BehandlingStatus.KLAR_TIL_BEHANDLING:
            return underkjent ? 'Underkjent' : 'Klar til behandling';
        case BehandlingStatus.KLAR_TIL_BESLUTNING:
            return 'Klar til beslutning';
        case BehandlingStatus.SØKNAD:
            return 'Søknad';
        case BehandlingStatus.UNDER_BEHANDLING:
            return underkjent ? 'Underkjent' : 'Under behandling';
        case BehandlingStatus.UNDER_BESLUTNING:
            return 'Under beslutning';
    }
};

export const brukersMeldekortDagStatusTekst: Record<BrukersMeldekortDagStatus, string> = {
    [BrukersMeldekortDagStatus.DELTATT]: 'Deltatt i tiltaket',
    [BrukersMeldekortDagStatus.FRAVÆR_SYK]: 'Fravær - Syk',
    [BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN]: 'Fravær - Sykt barn',
    [BrukersMeldekortDagStatus.FRAVÆR_ANNET]: 'Godkjent fravær - Velferd',
    [BrukersMeldekortDagStatus.IKKE_DELTATT]: 'Ikke godkjent fravær',
    [BrukersMeldekortDagStatus.IKKE_REGISTRERT]: 'Ikke utfylt',
} as const;

export const meldekortBehandlingDagStatusTekst: Record<MeldekortBehandlingDagStatus, string> = {
    // OBS! Endring av disse tekstene krever tilsvarende endringer tekstene som utledes for brevene!
    [MeldekortBehandlingDagStatus.Sperret]: 'Ikke rett på tiltakspenger',
    [MeldekortBehandlingDagStatus.DeltattMedLønnITiltaket]: 'Deltatt med lønn i tiltaket',
    [MeldekortBehandlingDagStatus.DeltattUtenLønnITiltaket]: 'Deltatt uten lønn i tiltaket',
    [MeldekortBehandlingDagStatus.FraværSyk]: 'Fravær - Syk',
    [MeldekortBehandlingDagStatus.FraværSyktBarn]: 'Fravær - Sykt barn',
    [MeldekortBehandlingDagStatus.FraværVelferdGodkjentAvNav]: 'Godkjent fravær - Velferd',
    [MeldekortBehandlingDagStatus.FraværVelferdIkkeGodkjentAvNav]: 'Ikke godkjent fravær - Velferd',
    [MeldekortBehandlingDagStatus.IkkeDeltatt]: 'Ikke tiltak denne dagen',
    [MeldekortBehandlingDagStatus.IkkeUtfylt]: 'Ikke utfylt',
} as const;

export const finnMeldeperiodeKjedeStatusTekst: Record<MeldeperiodeKjedeStatus, string> = {
    [MeldeperiodeKjedeStatus.IKKE_RETT_TIL_TILTAKSPENGER]: 'Ikke rett til tiltakspenger',
    [MeldeperiodeKjedeStatus.IKKE_KLAR_TIL_BEHANDLING]: 'Ikke klar til behandling',
    [MeldeperiodeKjedeStatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [MeldeperiodeKjedeStatus.UNDER_BEHANDLING]: 'Under behandling',
    [MeldeperiodeKjedeStatus.KLAR_TIL_BESLUTNING]: 'Klar til beslutning',
    [MeldeperiodeKjedeStatus.GODKJENT]: 'Godkjent',
    [MeldeperiodeKjedeStatus.AUTOMATISK_BEHANDLET]: 'Automatisk behandlet',
} as const;

export const finnBehandlingstypeTekst: Record<Behandlingstype, string> = {
    [Behandlingstype.FØRSTEGANGSBEHANDLING]: 'Førstegangsbehandling',
    [Behandlingstype.REVURDERING]: 'Revurdering (stans)',
    [Behandlingstype.SØKNAD]: 'Søknad',
} as const;

export const meldekortBehandlingTypeTekst: Record<MeldekortBehandlingType, string> = {
    [MeldekortBehandlingType.FØRSTE_BEHANDLING]: 'Første behandling',
    [MeldekortBehandlingType.KORRIGERING]: 'Korrigering',
} as const;

export const meldekortUtbetalingstatusTekst: Record<Utbetalingsstatus, string> = {
    FEILET_MOT_OPPDRAG: 'Feilet mot oppdrag',
    IKKE_GODKJENT: '-',
    IKKE_SENDT_TIL_HELVED: '-',
    OK: 'Sendt til utbetaling',
    OK_UTEN_UTBETALING: 'Ok uten utbetaling',
    SENDT_TIL_HELVED: 'Venter på helved',
    SENDT_TIL_OPPDRAG: 'Venter på oppdrag',
};
