import { Nullable } from '~/types/UtilTypes';
import { BenkV2Tab } from './tabs';
import { SakId } from '~/lib/sak/SakTyper';

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
    id: string;
    sakId: SakId;
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
 * Body-en som postes til /benk. `filters` er unionen av filtrene fanene
 * tilbyr - hver fane sender sine, og backend ignorerer resten.
 */
export type BenkV2RequestBody = BenkV2Request<BenkV2Filter, string> & {
    tab: BenkV2Tab;
};

/**
 * Respons for én fane i benken.
 *
 * [limit] er maksgrensen backend returnerer - er antallet treff større,
 * er `behandlinger` kuttet og resten vises ikke.
 */
export type BenkV2Oversikt<Behandling> = {
    behandlinger: Behandling[];
    totalAntall: number;
    totalAntallUfiltrert: number;
    antallFiltrertPgaTilgang: number;
    limit: number;
};

/**
 * Hele svaret fra /benk: fanen det ble spurt om, og antallet i alle
 * fanene (til fanetitlene).
 */
export type BenkV2Respons<Behandling> = {
    tab: BenkV2Tab;
    antallPerTab: Record<BenkV2Tab, number>;
    oversikt: BenkV2Oversikt<Behandling>;
};
