// "_bruker"-suffixen er ikke reell, er kun for at typescript ikke skal se denne som ekvivalent med MeldekortBehandlingId
// Ikke gjør run-time typesjekk på denne!
export type BrukersMeldekortId = `meldekort_${string}_bruker`;

export enum BrukersMeldekortDagStatus {
    DELTATT_UTEN_LØNN_I_TILTAKET = 'DELTATT_UTEN_LØNN_I_TILTAKET',
    // DELTATT_MED_LØNN_I_TILTAKET er ikke i bruk ennå
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
};
