// Egentlig har denne samme prefix som MeldekortBehandlingId (bare "meldekort_")
// Typer den med en unik prefix for at typescript ikke skal se de som ekvivalente
// Ikke gjør run-time typesjekk på denne!
export type BrukersMeldekortId = `meldekort_bruker_${string}`;

export enum BrukersMeldekortDagStatus {
    DELTATT_UTEN_LØNN_I_TILTAKET = 'DELTATT_UTEN_LØNN_I_TILTAKET',
    // DELTATT_MED_LØNN_I_TILTAKET er ikke i bruk ennå
    DELTATT_MED_LØNN_I_TILTAKET = 'DELTATT_MED_LØNN_I_TILTAKET',
    FRAVÆR_SYK = 'FRAVÆR_SYK',
    FRAVÆR_SYKT_BARN = 'FRAVÆR_SYKT_BARN',
    FRAVÆR_VELFERD_GODKJENT_AV_NAV = 'FRAVÆR_VELFERD_GODKJENT_AV_NAV',
    FRAVÆR_VELFERD_IKKE_GODKJENT_AV_NAV = 'FRAVÆR_VELFERD_IKKE_GODKJENT_AV_NAV',
    IKKE_REGISTRERT = 'IKKE_REGISTRERT',
}

export enum BrukersMeldekortBehandletAutomatiskStatus {
    VENTER_BEHANDLING = 'VENTER_BEHANDLING',
    BEHANDLET = 'BEHANDLET',
    UKJENT_FEIL = 'UKJENT_FEIL',
    HENTE_NAVKONTOR_FEILET = 'HENTE_NAVKONTOR_FEILET',
    BEHANDLING_FEILET_PÅ_SAK = 'BEHANDLING_FEILET_PÅ_SAK',
    UTBETALING_FEILET_PÅ_SAK = 'UTBETALING_FEILET_PÅ_SAK',
    SKAL_IKKE_BEHANDLES_AUTOMATISK = 'SKAL_IKKE_BEHANDLES_AUTOMATISK',
    ALLEREDE_BEHANDLET = 'ALLEREDE_BEHANDLET',
    UTDATERT_MELDEPERIODE = 'UTDATERT_MELDEPERIODE',
}

export type BrukersMeldekortDagProps = {
    dato: string;
    status: BrukersMeldekortDagStatus;
};

export type BrukersMeldekortProps = {
    id: BrukersMeldekortId;
    mottatt: string;
    dager: BrukersMeldekortDagProps[];
    behandletAutomatiskStatus?: BrukersMeldekortBehandletAutomatiskStatus;
};
