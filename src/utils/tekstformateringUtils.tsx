import {
    BehandlingResultat,
    BehandlingStatus,
    Behandlingstype,
    SøknadsbehandlingResultat,
    RevurderingResultat,
    ManueltBehandlesGrunn,
} from '~/types/BehandlingTypes';
import {
    MeldekortBehandlingDagStatus,
    Utbetalingsstatus,
} from '~/types/meldekort/MeldekortBehandling';
import { BrukersMeldekortDagStatus } from '~/types/meldekort/BrukersMeldekort';
import { MeldeperiodeKjedeStatus } from '~/types/meldekort/Meldeperiode';
import React, { ReactElement } from 'react';
import { Tag } from '@navikt/ds-react';

export const finnBehandlingStatusTag = (status: BehandlingStatus, underkjent: boolean) => {
    if (
        (status === BehandlingStatus.KLAR_TIL_BEHANDLING ||
            status === BehandlingStatus.UNDER_BEHANDLING) &&
        underkjent
    ) {
        return <Tag variant="warning">Underkjent</Tag>;
    }
    return behandlingStatusTag[status];
};

const behandlingStatusTag: Record<BehandlingStatus, React.ReactElement> = {
    [BehandlingStatus.VEDTATT]: <Tag variant="success">Vedtatt</Tag>,
    [BehandlingStatus.KLAR_TIL_BEHANDLING]: <Tag variant="info">Klar til behandling</Tag>,
    [BehandlingStatus.KLAR_TIL_BESLUTNING]: <Tag variant="info">Klar til beslutning</Tag>,
    [BehandlingStatus.SØKNAD]: <Tag variant="neutral">Søknad</Tag>,
    [BehandlingStatus.UNDER_BEHANDLING]: <Tag variant="info">Under behandling</Tag>,
    [BehandlingStatus.UNDER_BESLUTNING]: <Tag variant="info">Under beslutning</Tag>,
    [BehandlingStatus.AVBRUTT]: <Tag variant="neutral">Avsluttet</Tag>,
    [BehandlingStatus.UNDER_AUTOMATISK_BEHANDLING]: (
        <Tag variant="neutral">Under automatisk behandling</Tag>
    ),
};

export const brukersMeldekortDagStatusTekst: Record<BrukersMeldekortDagStatus, string> = {
    [BrukersMeldekortDagStatus.DELTATT_UTEN_LØNN_I_TILTAKET]: 'Deltatt',
    [BrukersMeldekortDagStatus.DELTATT_MED_LØNN_I_TILTAKET]: 'Deltatt med lønn',
    [BrukersMeldekortDagStatus.FRAVÆR_SYK]: 'Syk',
    [BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN]: 'Sykt barn eller syk barnepasser',
    [BrukersMeldekortDagStatus.FRAVÆR_GODKJENT_AV_NAV]: 'Fravær godkjent av Nav',
    [BrukersMeldekortDagStatus.FRAVÆR_ANNET]: 'Annet fravær',
    [BrukersMeldekortDagStatus.IKKE_BESVART]: 'Ikke besvart',
} as const;

export const meldekortBehandlingDagStatusTekst: Record<MeldekortBehandlingDagStatus, string> = {
    // OBS! Endring av disse tekstene krever tilsvarende endringer tekstene som utledes for brevene!
    [MeldekortBehandlingDagStatus.Sperret]: 'Ikke rett til tiltakspenger',
    [MeldekortBehandlingDagStatus.DeltattMedLønnITiltaket]: 'Deltatt med lønn',
    [MeldekortBehandlingDagStatus.DeltattUtenLønnITiltaket]: 'Deltatt',
    [MeldekortBehandlingDagStatus.FraværSyk]: 'Syk',
    [MeldekortBehandlingDagStatus.FraværSyktBarn]: 'Sykt barn eller syk barnepasser',
    [MeldekortBehandlingDagStatus.FraværGodkjentAvNav]: 'Fravær godkjent av Nav',
    [MeldekortBehandlingDagStatus.FraværAnnet]: 'Annet fravær',
    [MeldekortBehandlingDagStatus.IkkeBesvart]: 'Ikke besvart',
    [MeldekortBehandlingDagStatus.IkkeDeltatt]: 'Ikke tiltaksdag',
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
} as const;

export const finnBehandlingstypeTekst: Record<Behandlingstype, string> = {
    [Behandlingstype.SØKNADSBEHANDLING]: 'Søknadsbehandling',
    [Behandlingstype.REVURDERING]: 'Revurdering',
    [Behandlingstype.SØKNAD]: 'Søknad',
} as const;

export const behandlingResultatTilTag: Record<BehandlingResultat, ReactElement> = {
    [SøknadsbehandlingResultat.AVSLAG]: <Tag variant="error">Avslag</Tag>,
    [SøknadsbehandlingResultat.INNVILGELSE]: <Tag variant="success">Innvilgelse</Tag>,
    [RevurderingResultat.STANS]: <Tag variant="warning">Stans</Tag>,
    [RevurderingResultat.REVURDERING_INNVILGELSE]: (
        <Tag variant="info">Revurdering innvilgelse</Tag>
    ),
};

export const revurderingResultatTekst: Record<RevurderingResultat, string> = {
    [RevurderingResultat.STANS]: 'stans',
    [RevurderingResultat.REVURDERING_INNVILGELSE]: 'innvilgelse',
} as const;

export const meldekortUtbetalingstatusTekst: Record<Utbetalingsstatus, string> = {
    FEILET_MOT_OPPDRAG: 'Feilet mot oppdrag',
    IKKE_GODKJENT: '-',
    IKKE_SENDT_TIL_HELVED: '-',
    OK: 'Sendt til utbetaling',
    OK_UTEN_UTBETALING: 'Ok uten utbetaling',
    SENDT_TIL_HELVED: 'Venter på helved',
    SENDT_TIL_OPPDRAG: 'Venter på oppdrag',
    AVBRUTT: 'Avbrutt',
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
    SAKSOPPLYSNING_OVERLAPPENDE_TILTAK:
        'Bruker har overlappende tiltaksdeltakelser i søknadsperioden',
    SAKSOPPLYSNING_MINDRE_ENN_14_DAGER_MELLOM_TILTAK_OG_SOKNAD:
        'Bruker har tiltaksdeltakelse som starter eller slutter mindre enn 14 dager før eller etter søknadsperioden',
    SAKSOPPLYSNING_ULIK_TILTAKSPERIODE:
        'Tiltaksdeltakelsen har ikke samme periode som det er søkt for',
    SAKSOPPLYSNING_ANDRE_YTELSER: 'Bruker mottar andre ytelser i søknadsperioden',

    ANNET_APEN_BEHANDLING: 'Det finnes en åpen behandling for søker',
    ANNET_VEDTAK_FOR_SAMME_PERIODE: 'Det finnes et annet vedtak som overlapper med søknadsperioden',
    ANNET_HAR_SOKT_FOR_SENT: 'Tiltaksdeltakelsen startet mer enn tre måneder før kravdato',
    ANNET_ER_UNDER_18_I_SOKNADSPERIODEN: 'Bruker er under 18 år i søknadsperioden',
};
