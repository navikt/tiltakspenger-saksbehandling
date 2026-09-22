import { Nullable } from '~/types/UtilTypes';
import { SakId } from '~/lib/sak/SakTyper';
import { IkkeSladdetVerdi, SladdbarVerdi } from '~/types/SladdetVerdi';
import { Saksnummer } from '~/lib/sak/Saksnummer';
import { BenkSøknadsbehandling, BenkSøknadsbehandlingMedTilgang } from '~/lib/benk/typer/søknader';
import { BenkRevurdering, BenkRevurderingMedTilgang } from '~/lib/benk/typer/revurderinger';
import { BenkMeldekort, BenkMeldekortMedTilgang } from '~/lib/benk/typer/meldekort';
import { BenkKlagebehandling, BenkKlagebehandlingMedTilgang } from '~/lib/benk/typer/klage';
import { BenkTilbakekreving, BenkTilbakekrevingMedTilgang } from '~/lib/benk/typer/tilbakekreving';

/**
 * Delt status for behandlingstypene som går gjennom "vanlig" saksbehandlingsflyt
 * (søknader, revurderinger og meldekort). Klage og tilbakekreving har egne flyter
 * og egne statuser.
 */
export enum BenkBehandlingsstatus {
    UNDER_AUTOMATISK_BEHANDLING = 'UNDER_AUTOMATISK_BEHANDLING',
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    UNDER_BESLUTNING = 'UNDER_BESLUTNING',
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
    begrunnelse: SladdbarVerdi<Nullable<string>>;
    frist: Nullable<string>;
};

export enum BenkTilgangsvurdering {
    HAR_TILGANG = 'HAR_TILGANG',
    HAR_IKKE_TILGANG = 'HAR_IKKE_TILGANG',
}

/**
 * Grunnene backend kan oppgi for en rad uten tilgang. Verdiene er benkens egen
 * kontrakt (`BenkTilgangsårsakDTO`), ikke Tilgangsmaskinens avvisningskoder.
 */
export enum BenkTilgangsårsak {
    STRENGT_FORTROLIG_ADRESSE = 'STRENGT_FORTROLIG_ADRESSE',
    STRENGT_FORTROLIG_UTLAND = 'STRENGT_FORTROLIG_UTLAND',
    FORTROLIG_ADRESSE = 'FORTROLIG_ADRESSE',
    SKJERMET = 'SKJERMET',
    HABILITET = 'HABILITET',
    VERGEMÅL = 'VERGEMÅL',
    GEOGRAFISK = 'GEOGRAFISK',
    UKJENT_BOSTED = 'UKJENT_BOSTED',
    PERSON_UTLAND = 'PERSON_UTLAND',
    AVDØD = 'AVDØD',
    /** Backend setter denne når Tilgangsmaskinen avviste med en kode vi ikke kjenner. */
    UKJENT = 'UKJENT',
    IKKE_SAKSBEHANDLER_ELLER_BESLUTTER = 'IKKE_SAKSBEHANDLER_ELLER_BESLUTTER',
}

export type BenkHarTilgang = {
    vurdering: BenkTilgangsvurdering.HAR_TILGANG;
    grunn: null;
};

export type BenkHarIkkeTilgang = {
    vurdering: BenkTilgangsvurdering.HAR_IKKE_TILGANG;
    grunn: {
        årsak: BenkTilgangsårsak;
        begrunnelse: string;
    };
};

export type BenkTilgang = BenkHarTilgang | BenkHarIkkeTilgang;

/**
 * Markørene utledes fra regelen Tilgangsmaskinen avviste tilgangen med, og er derfor bare satt
 * på rader uten tilgang - benken slår ikke opp PDL eller skjermingsregisteret.
 * Tilgangsmaskinen rapporterer den første regelen som avviser, så en person som både er skjermet
 * og har strengt fortrolig adresse får bare kode6.
 */
export type BenkPersonmarkører = {
    skjermet: boolean;
    kode6: boolean;
    kode7: boolean;
};

export type BenkOppsummering = {
    antallMedTilgang: number;
    antallUtenTilgang: number;
    antallSkjermet: number;
    antallKode6: number;
    antallKode7: number;
};

export type BenkBehandlingBase<T = unknown> = T & {
    type: BenkBehandlingstype;
    id: string;
    sakId: SladdbarVerdi<SakId>;
    fnr: SladdbarVerdi<string>;
    saksnummer: SladdbarVerdi<Saksnummer>;
    startet: string;
    sistEndret: string;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    erUnderkjent: boolean;
    ventestatus: BenkVentestatus;
    tilgang: BenkTilgang;
    personmarkører: BenkPersonmarkører;
};

export type BenkBehandlingMedTilgangBase<T = unknown> = Omit<
    BenkBehandlingBase<T>,
    'sakId' | 'fnr' | 'saksnummer'
> & {
    sakId: IkkeSladdetVerdi<SakId>;
    fnr: IkkeSladdetVerdi<string>;
    saksnummer: IkkeSladdetVerdi<Saksnummer>;
    tilgang: BenkHarTilgang;
};

export type BenkBehandling =
    | BenkSøknadsbehandling
    | BenkRevurdering
    | BenkMeldekort
    | BenkKlagebehandling
    | BenkTilbakekreving;

export type BenkBehandlingMedTilgang =
    | BenkSøknadsbehandlingMedTilgang
    | BenkRevurderingMedTilgang
    | BenkMeldekortMedTilgang
    | BenkKlagebehandlingMedTilgang
    | BenkTilbakekrevingMedTilgang;

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
 * så body-en inneholder kun sortering, fanens filtre og paginering.
 *
 * [side] er det 0-baserte sidetallet som skal hentes - sidestørrelsen er
 * fast i backend og returneres som `sideantall`.
 */
export type BenkRequestBody = {
    sortering: BenkSortering<string>;
    filters: BenkFilter;
    side: number;
};

/**
 * Respons for én fane i benken.
 *
 * [side] er siden som ble spurt om (0-basert) og [sideantall] den faste
 * sidestørrelsen - antall sider er `totalAntall / sideantall`, rundet opp.
 *
 * [oppsummering] teller radene på denne siden, med tilgang og markører.
 */
export type BenkOversikt<Behandling> = {
    behandlinger: Behandling[];
    totalAntall: number;
    totalAntallUfiltrert: number;
    oppsummering: BenkOppsummering;
    side: number;
    sideantall: number;
    /** Identene tildelt en rad i fanen, ufiltrert - valg i nedtrekkslisten for saksbehandler/beslutter */
    saksbehandlere: string[];
    besluttere: string[];
};

export enum BenkIkkeTildelt {
    IKKE_TILDELT = 'IKKE_TILDELT',
    IKKE_TILDELT_SAKSBEHANDLER = 'IKKE_TILDELT_SAKSBEHANDLER',
    IKKE_TILDELT_BESLUTTER = 'IKKE_TILDELT_BESLUTTER',
}

export type BenkSaksbehandlerFilter = Nullable<string | BenkIkkeTildelt>;
