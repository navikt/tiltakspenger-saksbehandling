// "_bruker"-suffixen er ikke reell, er kun for at typescript ikke skal se denne som ekvivalent med MeldekortBehandlingId
// Ikke gjør run-time typesjekk på denne!
export type BrukersMeldekortId = `meldekort_${string}_bruker`;

export enum BrukersMeldekortDagStatus {
    DELTATT_UTEN_LØNN_I_TILTAKET = 'DELTATT_UTEN_LØNN_I_TILTAKET',
    DELTATT_MED_LØNN_I_TILTAKET = 'DELTATT_MED_LØNN_I_TILTAKET',
    FRAVÆR_SYK = 'FRAVÆR_SYK',
    FRAVÆR_SYKT_BARN = 'FRAVÆR_SYKT_BARN',
    FRAVÆR_GODKJENT_AV_NAV = 'FRAVÆR_GODKJENT_AV_NAV',
    FRAVÆR_ANNET = 'FRAVÆR_ANNET',
    IKKE_BESVART = 'IKKE_BESVART',
    IKKE_RETT_TIL_TILTAKSPENGER = 'IKKE_RETT_TIL_TILTAKSPENGER',
    IKKE_TILTAKSDAG = 'IKKE_TILTAKSDAG',
}

export type BrukersMeldekortDagProps = {
    dato: string;
    status: BrukersMeldekortDagStatus;
};

export type BrukersMeldekortProps = {
    id: BrukersMeldekortId;
    mottatt: string;
    dager: BrukersMeldekortDagProps[];
    behandletAutomatiskStatus: MeldekortBehandletAutomatiskStatus;
};

export enum MeldekortBehandletAutomatiskStatus {
    VENTER_BEHANDLING = 'VENTER_BEHANDLING',
    BEHANDLET = 'BEHANDLET',
    UKJENT_FEIL = 'UKJENT_FEIL',
    HENTE_NAVKONTOR_FEILET = 'HENTE_NAVKONTOR_FEILET',
    BEHANDLING_FEILET_PÅ_SAK = 'BEHANDLING_FEILET_PÅ_SAK',
    UTBETALING_FEILET_PÅ_SAK = 'UTBETALING_FEILET_PÅ_SAK',
    SKAL_IKKE_BEHANDLES_AUTOMATISK = 'SKAL_IKKE_BEHANDLES_AUTOMATISK',
    ALLEREDE_BEHANDLET = 'ALLEREDE_BEHANDLET',
    UTDATERT_MELDEPERIODE = 'UTDATERT_MELDEPERIODE',
    ER_UNDER_REVURDERING = 'ER_UNDER_REVURDERING',
    FOR_MANGE_DAGER_REGISTRERT = 'FOR_MANGE_DAGER_REGISTRERT',
    KAN_IKKE_MELDE_HELG = 'KAN_IKKE_MELDE_HELG',
    FOR_MANGE_DAGER_GODKJENT_FRAVÆR = 'FOR_MANGE_DAGER_GODKJENT_FRAVÆR',
}
