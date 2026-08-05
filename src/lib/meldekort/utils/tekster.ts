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
    [BrukersMeldekortKjedeStatus.UNDER_BEHANDLING]: 'Mottatt, under behandling',
    [BrukersMeldekortKjedeStatus.BEHANDLET]: 'Behandlet',
    [BrukersMeldekortKjedeStatus.AVBRUTT]: 'Mottatt, behandling avbrutt',
    [BrukersMeldekortKjedeStatus.KORRIGERING_VENTER_BEHANDLING]:
        'Mottatt, ikke behandlet (korrigering)',
    [BrukersMeldekortKjedeStatus.KORRIGERING_UNDER_BEHANDLING]:
        'Mottatt, under behandling (korrigering)',
    [BrukersMeldekortKjedeStatus.KORRIGERING_BEHANDLET]: 'Behandlet (korrigering)',
    [BrukersMeldekortKjedeStatus.KORRIGERING_AVBRUTT]: 'Mottatt, behandling avbrutt (korrigering)',
} as const;

export const brukersMeldekortInnsendingstypeTekst = (
    status: BrukersMeldekortKjedeStatus,
): string => {
    switch (status) {
        case BrukersMeldekortKjedeStatus.IKKE_MOTTATT:
            return 'Ikke mottatt';
        case BrukersMeldekortKjedeStatus.VENTER_BEHANDLING:
        case BrukersMeldekortKjedeStatus.UNDER_BEHANDLING:
        case BrukersMeldekortKjedeStatus.BEHANDLET:
        case BrukersMeldekortKjedeStatus.AVBRUTT:
            return 'Første innsending';
        case BrukersMeldekortKjedeStatus.KORRIGERING_VENTER_BEHANDLING:
        case BrukersMeldekortKjedeStatus.KORRIGERING_UNDER_BEHANDLING:
        case BrukersMeldekortKjedeStatus.KORRIGERING_BEHANDLET:
        case BrukersMeldekortKjedeStatus.KORRIGERING_AVBRUTT:
            return 'Korrigering';
    }
};

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
