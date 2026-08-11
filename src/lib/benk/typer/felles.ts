import { Nullable } from '~/types/UtilTypes';
import { BenkTab } from './tabs';
import { SakId } from '~/lib/sak/SakTyper';

/**
 * Delt status for behandlingstypene som går gjennom "vanlig" saksbehandlingsflyt
 * (søknader, revurderinger, meldekort og klage). Tilbakekreving har sin egen flyt og egen status.
 */
export enum BenkBehandlingsstatus {
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
export enum BenkBehandlingstype {
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING',
    REVURDERING = 'REVURDERING',
    MELDEKORTBEHANDLING = 'MELDEKORTBEHANDLING',
    INNSENDT_MELDEKORT = 'INNSENDT_MELDEKORT',
    KORRIGERT_MELDEKORT = 'KORRIGERT_MELDEKORT',
    KLAGEBEHANDLING = 'KLAGEBEHANDLING',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

export type BenkVentestatus = {
    erSattPåVent: boolean;
    begrunnelse: Nullable<string>;
    frist: Nullable<string>;
};

/**
 * Fellesfelt for alle rader i benken, uavhengig av behandlingstype.
 */
export type BenkBehandlingBase = {
    type: BenkBehandlingstype;
    id: string;
    sakId: SakId;
    fnr: string;
    saksnummer: string;
    startet: string;
    sistEndret: string;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    erUnderkjent: boolean;
    ventestatus: BenkVentestatus;
};

export enum BenkSorteringRetning {
    ASC = 'ASC',
    DESC = 'DESC',
}

export type BenkSortering<Kolonne extends string> = `${Kolonne},${BenkSorteringRetning}`;

/**
 * Filter for én fane. Alle felter er nullable - null betyr "ikke filtrert".
 */
export type BenkFilter = Record<string, string | boolean | null>;

/**
 * Body-en som postes til fanens rute under /benk. Fanen ligger i url-en,
 * så body-en inneholder kun sortering og fanens filtre.
 */
export type BenkRequestBody = {
    sortering: BenkSortering<string>;
    filters: BenkFilter;
};

/**
 * Respons for én fane i benken.
 *
 * [limit] er maksgrensen backend returnerer - er antallet treff større,
 * er `behandlinger` kuttet og resten vises ikke.
 */
export type BenkOversikt<Behandling> = {
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
export type BenkRespons<Behandling> = {
    tab: BenkTab;
    antallPerTab: Record<BenkTab, number>;
    oversikt: BenkOversikt<Behandling>;
    error: Nullable<string>;
};
