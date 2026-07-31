import {
    MeldekortbehandlingDagStatus,
    MeldekortbehandlingStatus,
    MeldeperiodebehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { BrukersMeldekortKjedeStatus } from '~/lib/meldekort/typer/BrukersMeldekort';

export const brukersMeldekortKjedeStatusTekst: Record<BrukersMeldekortKjedeStatus, string> = {
    [BrukersMeldekortKjedeStatus.IKKE_MOTTATT]: 'Ikke mottatt',
    [BrukersMeldekortKjedeStatus.VENTER_BEHANDLING]: 'Mottatt, ikke behandlet',
    [BrukersMeldekortKjedeStatus.BEHANDLET]: 'Behandlet',
    [BrukersMeldekortKjedeStatus.KORRIGERING_VENTER_BEHANDLING]:
        'Mottatt, ikke behandlet (korrigering)',
    [BrukersMeldekortKjedeStatus.KORRIGERING_BEHANDLET]: 'Behandlet (korrigering)',
} as const;

export const brukersMeldekortInnsendingstypeTekst: Record<BrukersMeldekortKjedeStatus, string> = {
    [BrukersMeldekortKjedeStatus.IKKE_MOTTATT]: 'Ikke mottatt',
    [BrukersMeldekortKjedeStatus.VENTER_BEHANDLING]: 'Første innsending',
    [BrukersMeldekortKjedeStatus.BEHANDLET]: 'Første innsending',
    [BrukersMeldekortKjedeStatus.KORRIGERING_VENTER_BEHANDLING]: 'Korrigering',
    [BrukersMeldekortKjedeStatus.KORRIGERING_BEHANDLET]: 'Korrigering',
} as const;

export const meldeperiodebehandlingTypeTekst: Record<MeldeperiodebehandlingType, string> = {
    [MeldeperiodebehandlingType.FØRSTE_BEHANDLING]: 'Førstegangsbehandling',
    [MeldeperiodebehandlingType.KORRIGERING]: 'Korrigering',
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

export const meldekortbehandlingDagStatusTekstKort: Record<MeldekortbehandlingDagStatus, string> = {
    [MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger]: 'Ikke rett',
    [MeldekortbehandlingDagStatus.DeltattMedLønnITiltaket]: 'Deltatt m/lønn',
    [MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket]: 'Deltatt',
    [MeldekortbehandlingDagStatus.FraværSyk]: 'Syk',
    [MeldekortbehandlingDagStatus.FraværSyktBarn]: 'Sykt barn',
    [MeldekortbehandlingDagStatus.FraværSterkeVelferdsgrunnerEllerJobbintervju]: 'Velferdsgrunner',
    [MeldekortbehandlingDagStatus.FraværGodkjentAvNav]: 'Godkjent fravær',
    [MeldekortbehandlingDagStatus.FraværAnnet]: 'Annet fravær',
    [MeldekortbehandlingDagStatus.IkkeBesvart]: 'Ikke besvart',
    [MeldekortbehandlingDagStatus.IkkeTiltaksdag]: 'Ikke tiltaksdag',
} as const;
