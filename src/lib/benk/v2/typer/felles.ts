import { Nullable } from '~/types/UtilTypes';
import { BenkV2Tab } from './tabs';
import { SakId } from '~/lib/sak/SakTyper';
import { BenkRevurdering } from '~/lib/benk/v2/typer/revurderinger';
import { BenkSøknadsbehandling } from '~/lib/benk/v2/typer/søknader';
import { BenkMeldekort } from '~/lib/benk/v2/typer/meldekort';
import { BenkKlagebehandling } from '~/lib/benk/v2/typer/klage';
import { BenkTilbakekreving } from '~/lib/benk/v2/typer/tilbakekreving';

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

export type BenkV2Behandling =
    | BenkRevurdering
    | BenkSøknadsbehandling
    | BenkMeldekort
    | BenkKlagebehandling
    | BenkTilbakekreving;

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
