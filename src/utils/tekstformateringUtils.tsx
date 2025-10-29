import { MeldekortBehandlingDagStatus } from '~/types/meldekort/MeldekortBehandling';
import { BrukersMeldekortDagStatus } from '~/types/meldekort/BrukersMeldekort';
import { MeldeperiodeKjedeStatus } from '~/types/meldekort/Meldeperiode';
import React, { ReactElement } from 'react';
import { Tag } from '@navikt/ds-react';
import {
    RammebehandlingResultat,
    Rammebehandlingsstatus,
    Behandlingstype,
} from '~/types/Behandling';
import { Utbetalingsstatus } from '~/types/Utbetaling';
import { ManueltBehandlesGrunn } from '~/types/Søknadsbehandling';

export const finnBehandlingStatusTag = (
    status: Rammebehandlingsstatus | 'SØKNAD',
    underkjent: boolean,
    erSattPåVent: boolean = false,
) => {
    if (
        (status == Rammebehandlingsstatus.UNDER_BEHANDLING ||
            status === Rammebehandlingsstatus.UNDER_BESLUTNING) &&
        erSattPåVent
    ) {
        return <Tag variant="warning">Satt på vent</Tag>;
    }
    if (
        (status === Rammebehandlingsstatus.KLAR_TIL_BEHANDLING ||
            status === Rammebehandlingsstatus.UNDER_BEHANDLING) &&
        underkjent
    ) {
        return <Tag variant="warning">Underkjent</Tag>;
    }
    return behandlingStatusTag[status];
};

const behandlingStatusTag: Record<Rammebehandlingsstatus | 'SØKNAD', React.ReactElement> = {
    [Rammebehandlingsstatus.VEDTATT]: <Tag variant="success">Vedtatt</Tag>,
    [Rammebehandlingsstatus.KLAR_TIL_BEHANDLING]: <Tag variant="info">Klar til behandling</Tag>,
    [Rammebehandlingsstatus.KLAR_TIL_BESLUTNING]: <Tag variant="info">Klar til beslutning</Tag>,
    [Rammebehandlingsstatus.UNDER_BEHANDLING]: <Tag variant="info">Under behandling</Tag>,
    [Rammebehandlingsstatus.UNDER_BESLUTNING]: <Tag variant="info">Under beslutning</Tag>,
    [Rammebehandlingsstatus.AVBRUTT]: <Tag variant="neutral">Avsluttet</Tag>,
    [Rammebehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING]: (
        <Tag variant="neutral">Under automatisk behandling</Tag>
    ),
    SØKNAD: <Tag variant="neutral">Søknad</Tag>,
};

export const brukersMeldekortDagStatusTekst: Record<BrukersMeldekortDagStatus, string> = {
    [BrukersMeldekortDagStatus.DELTATT_UTEN_LØNN_I_TILTAKET]: 'Deltatt',
    [BrukersMeldekortDagStatus.DELTATT_MED_LØNN_I_TILTAKET]: 'Deltatt med lønn',
    [BrukersMeldekortDagStatus.FRAVÆR_SYK]: 'Syk',
    [BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN]: 'Sykt barn eller syk barnepasser',
    [BrukersMeldekortDagStatus.FRAVÆR_GODKJENT_AV_NAV]: 'Fravær godkjent av Nav',
    [BrukersMeldekortDagStatus.FRAVÆR_ANNET]: 'Annet fravær',
    [BrukersMeldekortDagStatus.IKKE_BESVART]: 'Ikke besvart',
    [BrukersMeldekortDagStatus.IKKE_RETT_TIL_TILTAKSPENGER]: 'Ikke rett til tiltakspenger',
    [BrukersMeldekortDagStatus.IKKE_TILTAKSDAG]: 'Ikke tiltaksdag',
} as const;

export const meldekortBehandlingDagStatusTekst: Record<MeldekortBehandlingDagStatus, string> = {
    // OBS! Endring av disse tekstene krever tilsvarende endringer tekstene som utledes for brevene!
    [MeldekortBehandlingDagStatus.IkkeRettTilTiltakspenger]: 'Ikke rett til tiltakspenger',
    [MeldekortBehandlingDagStatus.DeltattMedLønnITiltaket]: 'Deltatt med lønn',
    [MeldekortBehandlingDagStatus.DeltattUtenLønnITiltaket]: 'Deltatt',
    [MeldekortBehandlingDagStatus.FraværSyk]: 'Syk',
    [MeldekortBehandlingDagStatus.FraværSyktBarn]: 'Sykt barn eller syk barnepasser',
    [MeldekortBehandlingDagStatus.FraværGodkjentAvNav]: 'Fravær godkjent av Nav',
    [MeldekortBehandlingDagStatus.FraværAnnet]: 'Annet fravær',
    [MeldekortBehandlingDagStatus.IkkeBesvart]: 'Ikke besvart',
    [MeldekortBehandlingDagStatus.IkkeTiltaksdag]: 'Ikke tiltaksdag',
} as const;

export const finnMeldeperiodeKjedeStatusTekst: Record<MeldeperiodeKjedeStatus, string> = {
    [MeldeperiodeKjedeStatus.AVVENTER_MELDEKORT]: 'Avventer meldekort',
    [MeldeperiodeKjedeStatus.IKKE_RETT_TIL_TILTAKSPENGER]: 'Ikke rett til tiltakspenger',
    [MeldeperiodeKjedeStatus.IKKE_KLAR_TIL_BEHANDLING]: 'Ikke klar til behandling',
    [MeldeperiodeKjedeStatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [MeldeperiodeKjedeStatus.UNDER_BEHANDLING]: 'Under behandling',
    [MeldeperiodeKjedeStatus.KLAR_TIL_BESLUTNING]: 'Klar til beslutning',
    [MeldeperiodeKjedeStatus.UNDER_BESLUTNING]: 'Under beslutning',
    [MeldeperiodeKjedeStatus.GODKJENT]: 'Godkjent',
    [MeldeperiodeKjedeStatus.AUTOMATISK_BEHANDLET]: 'Automatisk behandlet',
    [MeldeperiodeKjedeStatus.AVBRUTT]: 'Avsluttet',
    [MeldeperiodeKjedeStatus.KORRIGERT_MELDEKORT]: 'Korrigert meldekort',
} as const;

export const finnBehandlingstypeTekst: Record<Behandlingstype, string> = {
    [Behandlingstype.SØKNADSBEHANDLING]: 'Søknadsbehandling',
    [Behandlingstype.REVURDERING]: 'Revurdering',
    [Behandlingstype.SØKNAD]: 'Søknad',
} as const;

export const behandlingResultatTilText: Record<RammebehandlingResultat, string> = {
    [RammebehandlingResultat.AVSLAG]: 'Avslag',
    [RammebehandlingResultat.INNVILGELSE]: 'Innvilgelse',
    [RammebehandlingResultat.STANS]: 'Stans',
    [RammebehandlingResultat.REVURDERING_INNVILGELSE]: 'Revurdering innvilgelse',
    [RammebehandlingResultat.IKKE_VALGT]: 'Ikke valgt',
    [RammebehandlingResultat.OMGJØRING]: 'Omgjøring',
};

export const behandlingResultatTilTag: Record<RammebehandlingResultat, ReactElement> = {
    [RammebehandlingResultat.AVSLAG]: (
        <Tag variant="error">{behandlingResultatTilText[RammebehandlingResultat.AVSLAG]}</Tag>
    ),
    [RammebehandlingResultat.INNVILGELSE]: (
        <Tag variant="success">
            {behandlingResultatTilText[RammebehandlingResultat.INNVILGELSE]}
        </Tag>
    ),
    [RammebehandlingResultat.STANS]: (
        <Tag variant="warning">{behandlingResultatTilText[RammebehandlingResultat.STANS]}</Tag>
    ),
    [RammebehandlingResultat.REVURDERING_INNVILGELSE]: (
        <Tag variant="info">
            {behandlingResultatTilText[RammebehandlingResultat.REVURDERING_INNVILGELSE]}
        </Tag>
    ),
    [RammebehandlingResultat.IKKE_VALGT]: (
        <Tag variant="neutral">{behandlingResultatTilText[RammebehandlingResultat.IKKE_VALGT]}</Tag>
    ),
    [RammebehandlingResultat.OMGJØRING]: (
        <Tag variant="alt1">{behandlingResultatTilText[RammebehandlingResultat.OMGJØRING]}</Tag>
    ),
};

export const utbetalingsstatusTekst: Record<Utbetalingsstatus, string> = {
    FEILET_MOT_OPPDRAG: 'Feilet mot oppdrag',
    IKKE_SENDT_TIL_HELVED: 'Ikke sendt til helved',
    OK: 'Sendt til utbetaling',
    OK_UTEN_UTBETALING: 'Ok uten utbetaling',
    SENDT_TIL_HELVED: 'Venter på helved',
    SENDT_TIL_OPPDRAG: 'Venter på oppdrag',
    AVBRUTT: 'Avbrutt',
    IKKE_GODKJENT: 'Ikke godkjent',
};

export const manueltBehandlesGrunnTekst: Record<ManueltBehandlesGrunn, string> = {
    SOKNAD_HAR_ANDRE_YTELSER: 'Bruker har svart ja på spørsmål om andre ytelser i søknaden',
    SOKNAD_HAR_LAGT_TIL_BARN_MANUELT: 'Bruker har lagt til barn manuelt i søknaden',
    SOKNAD_BARN_UTENFOR_EOS: 'Bruker har barn som oppholder seg utenfor EØS',
    SOKNAD_BARN_FYLLER_16_I_SOKNADSPERIODEN:
        'Bruker har barn som fyller 16 år i løpet av søknadsperioden',
    SOKNAD_BARN_FODT_I_SOKNADSPERIODEN: 'Bruker har fått barn i løpet av søknadsperioden',
    SOKNAD_HAR_KVP: 'Bruker har svart ja på spørsmål om KVP i søknaden',
    SOKNAD_INTRO: 'Bruker har svart ja på spørsmål om introduksjonsstønad i søknaden',
    SOKNAD_INSTITUSJONSOPPHOLD: 'Bruker har svart ja på spørsmål om institusjonsopphold i søknaden',

    SAKSOPPLYSNING_FANT_IKKE_TILTAK: 'Fant ikke tiltaksdeltakelsen det er søkt for',
    SAKSOPPLYSNING_TILTAK_MANGLER_PERIODE: 'Tiltaksdeltakelsen det er søkt for mangler periode',
    SAKSOPPLYSNING_OVERLAPPENDE_TILTAK:
        'Bruker har overlappende tiltaksdeltakelser i søknadsperioden',
    SAKSOPPLYSNING_MINDRE_ENN_14_DAGER_MELLOM_TILTAK_OG_SOKNAD:
        'Bruker har tiltaksdeltakelse som starter eller slutter mindre enn 14 dager før eller etter søknadsperioden',
    SAKSOPPLYSNING_ULIK_TILTAKSPERIODE:
        'Tiltaksdeltakelsen har ikke samme periode som det er søkt for',
    SAKSOPPLYSNING_HAR_IKKE_DELTATT_PA_TILTAK:
        'Bruker har ikke deltatt på tiltaket det er søkt for',
    SAKSOPPLYSNING_ANDRE_YTELSER: 'Bruker mottar andre ytelser i søknadsperioden',
    SAKSOPPLYSNING_VEDTAK_I_ARENA:
        'Det finnes tiltakspengevedtak i Arena som kan overlappe med søknadsperioden',

    ANNET_APEN_BEHANDLING: 'Det finnes en åpen behandling for søker',
    ANNET_VEDTAK_FOR_SAMME_PERIODE: 'Det finnes et annet vedtak som overlapper med søknadsperioden',
    ANNET_HAR_SOKT_FOR_SENT: 'Tiltaksdeltakelsen startet mer enn tre måneder før kravdato',
    ANNET_ER_UNDER_18_I_SOKNADSPERIODEN: 'Bruker er under 18 år i søknadsperioden',
};
