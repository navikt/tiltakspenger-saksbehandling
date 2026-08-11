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

/**
 * Diskriminatoren backend setter på hver rad, slik at frontend kan mappe en rad
 * til riktig type uten å gjette på hvilke felter som finnes.
 * Meldekortfanens tre radtyper er egne verdier, så `type` alene sier nøyaktig hva raden er.
 */
export enum BenkV2Behandlingstype {
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING',
    REVURDERING = 'REVURDERING',
    MELDEKORTBEHANDLING = 'MELDEKORTBEHANDLING',
    INNSENDT_MELDEKORT = 'INNSENDT_MELDEKORT',
    KORRIGERT_MELDEKORT = 'KORRIGERT_MELDEKORT',
    KLAGEBEHANDLING = 'KLAGEBEHANDLING',
    TILBAKEKREVING = 'TILBAKEKREVING',
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
    type: BenkV2Behandlingstype;
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

/**
 * Body-en som postes til fanens rute under /benk. Fanen ligger i url-en,
 * så body-en inneholder kun sortering og fanens filtre.
 */
export type BenkV2RequestBody = {
    sortering: BenkV2Sortering<string>;
    filters: BenkV2Filter;
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
 *
 * [error] er satt når requesten ikke lot seg tolke (ukjent fane i url-en
 * eller ugyldige filterverdier) og backend derfor svarte med en standardvisning.
 */
export type BenkV2Respons<Behandling> = {
    tab: BenkV2Tab;
    antallPerTab: Record<BenkV2Tab, number>;
    oversikt: BenkV2Oversikt<Behandling>;
    error: Nullable<string>;
};
