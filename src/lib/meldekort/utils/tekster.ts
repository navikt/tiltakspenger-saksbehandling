import {
    MeldekortbehandlingDagStatus,
    MeldeperiodebehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { BrukersMeldekortKjedeStatus } from '~/lib/meldekort/typer/BrukersMeldekort';
import { KanIkkeBehandlesGrunn } from '~/lib/meldekort/typer/Meldeperiode';

export const kanIkkeBehandlesGrunnTekst: Record<KanIkkeBehandlesGrunn, string> = {
    [KanIkkeBehandlesGrunn.HAR_ÅPEN_BEHANDLING]:
        'Meldeperioden finnes allerede i en åpen behandling.',
    [KanIkkeBehandlesGrunn.MELDEPERIODEN_HAR_IKKE_STARTET]:
        'Meldeperioden har ikke startet, og kan ikke fylles ut ennå.',
    [KanIkkeBehandlesGrunn.INGEN_DAGER_GIR_RETT]:
        'Ingen dager i meldeperioden gir rett til tiltakspenger.',
} as const;

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
