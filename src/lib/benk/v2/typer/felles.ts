import { Nullable } from '~/types/UtilTypes';

/**
 * Delt status for behandlingstypene som går gjennom "vanlig" saksbehandlingsflyt
 * (søknader, revurderinger, meldekort og klage). Tilbakekreving har sin egen flyt og egen status.
 */
export enum BenkV2Behandlingsstatus {
    UNDER_AUTOMATISK_BEHANDLING = 'UNDER_AUTOMATISK_BEHANDLING',
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    UNDER_BESLUTNING = 'UNDER_BESLUTNING',
    KLAR_TIL_FERDIGSTILLING = 'KLAR_TIL_FERDIGSTILLING',
}

export type BenkV2Ventestatus = {
    erSattPåVent: boolean;
    begrunnelse: Nullable<string>;
    frist: Nullable<string>;
};

/**
 * Fellesfelt for alle rader i benken, uavhengig av behandlingstype.
 */
export type BenkV2BehandlingBase = {
    sakId: string;
    fnr: string;
    saksnummer: string;
    startet: string;
    sistEndret: string;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    erUnderkjent: boolean;
    ventestatus: BenkV2Ventestatus;
};

export enum BenkV2SorteringRetning {
    ASC = 'ASC',
    DESC = 'DESC',
}

export type BenkV2Sortering<Kolonne extends string> = `${Kolonne},${BenkV2SorteringRetning}`;

/**
 * Filter for én fane. Alle felter er nullable - null betyr "ikke filtrert".
 */
export type BenkV2Filter = Record<string, string | boolean | null>;

export type BenkV2Request<F extends BenkV2Filter, Kolonne extends string> = {
    sortering: BenkV2Sortering<Kolonne>;
    filters: F;
};

/**
 * Respons for én fane i benken.
 */
export type BenkV2Oversikt<Behandling> = {
    behandlinger: Behandling[];
    totalAntall: number;
    totalAntallUfiltrert: number;
    antallFiltrertPgaTilgang: number;
};
