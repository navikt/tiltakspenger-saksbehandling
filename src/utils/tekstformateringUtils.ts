import { BehandlingStatus, Behandlingstype } from '../types/BehandlingTypes';
import { MeldekortBehandlingDagStatus } from '../types/meldekort/MeldekortBehandling';
import { MeldeperiodeStatus } from '../types/meldekort/Meldeperiode';
import { BrukersMeldekortDagStatus } from '../types/meldekort/BrukersMeldekort';

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

export const finnMeldeperiodeStatusTekst: Record<MeldeperiodeStatus, string> = {
    [MeldeperiodeStatus.IKKE_RETT_TIL_TILTAKSPENGER]: 'Ikke rett til tiltakspenger',
    [MeldeperiodeStatus.IKKE_KLAR_TIL_UTFYLLING]: 'Ikke klar til utfylling',
    [MeldeperiodeStatus.VENTER_PÅ_UTFYLLING]: 'Venter på utfylling',
    [MeldeperiodeStatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [MeldeperiodeStatus.KLAR_TIL_BESLUTNING]: 'Klar til beslutning',
    [MeldeperiodeStatus.GODKJENT]: 'Godkjent',
} as const;

export const finnBehandlingstypeTekst: Record<Behandlingstype, string> = {
    [Behandlingstype.FØRSTEGANGSBEHANDLING]: 'Førstegangsbehandling',
    [Behandlingstype.REVURDERING]: 'Revurdering',
    [Behandlingstype.SØKNAD]: 'Søknad',
} as const;
