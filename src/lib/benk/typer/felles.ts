import { Nullable } from '~/types/UtilTypes';
import { SakId } from '~/lib/sak/SakTyper';
import { SladdbarVerdi } from '~/types/SladdetVerdi';

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
}

export type BenkTilgang =
    | {
          vurdering: BenkTilgangsvurdering.HAR_TILGANG;
          grunn: null;
      }
    | {
          vurdering: BenkTilgangsvurdering.HAR_IKKE_TILGANG;
          grunn: {
              årsak: BenkTilgangsårsak;
              begrunnelse: string;
          };
      };

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

/**
 * Fellesfelt for alle rader i benken, uavhengig av behandlingstype.
 * Rader uten tilgang kommer med sladdet `fnr` og `ventestatus.begrunnelse` og tom `gyldigeKommandoer`.
 * `sakId` og `saksnummer` er også sladdet på disse radene, så raden ikke kan kobles til en sak.
 */
export type BenkBehandlingBase = {
    type: BenkBehandlingstype;
    id: string;
    sakId: SladdbarVerdi<SakId>;
    fnr: SladdbarVerdi<string>;
    saksnummer: SladdbarVerdi<string>;
    startet: string;
    sistEndret: string;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    erUnderkjent: boolean;
    ventestatus: BenkVentestatus;
    tilgang: BenkTilgang;
    personmarkører: BenkPersonmarkører;
};

export const harTilgangTilBenkRad = (behandling: Pick<BenkBehandlingBase, 'tilgang'>): boolean =>
    behandling.tilgang.vurdering === BenkTilgangsvurdering.HAR_TILGANG;

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
