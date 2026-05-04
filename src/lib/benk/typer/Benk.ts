import { Nullable } from '~/types/UtilTypes';
import { RammebehandlingResultat } from '~/lib/rammebehandling/typer/Rammebehandling';

export type BenkOversiktRequestBody = {
    sortering: BenkSortering;
    filters: {
        benktype: ReadonlyArray<BenkBehandlingKlarEllerVenter> | null;
        behandlingstype: ReadonlyArray<BenkBehandlingstype> | null;
        status: ReadonlyArray<BenkBehandlingsstatus> | null;
        identer: ReadonlyArray<string | 'IKKE_TILDELT'> | null;
        tilbakekrevingKunOverMinstebeløp: boolean;
    };
};

export type BenkOversiktProps = {
    behandlingssammendrag: BenkBehandling[];
    totalAntall: number;
    limit: number;
    totalAntallUfiltrert: number;
    antallFiltrertPgaTilgang: number;
};

export type BenkBehandling = {
    sakId: string;
    fnr: string;
    saksnummer: string;
    startet: string;
    kravtidspunkt?: string;
    behandlingstype: BenkBehandlingstype;
    status: BenkBehandlingsstatus;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    sistEndret?: string;
    erSattPåVent: boolean;
    sattPåVentBegrunnelse: Nullable<string>;
    sattPåVentFrist: Nullable<string>;
    resultat: Nullable<RammebehandlingResultat>;
    erUnderkjent: boolean;
    beløp: Nullable<number>;
};

export enum BenkBehandlingstype {
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING',
    REVURDERING = 'REVURDERING',
    MELDEKORTBEHANDLING = 'MELDEKORTBEHANDLING',
    INNSENDT_MELDEKORT = 'INNSENDT_MELDEKORT',
    KORRIGERT_MELDEKORT = 'KORRIGERT_MELDEKORT',
    KLAGEBEHANDLING = 'KLAGEBEHANDLING',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

export enum BenkBehandlingsstatus {
    UNDER_AUTOMATISK_BEHANDLING = 'UNDER_AUTOMATISK_BEHANDLING',
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    UNDER_BESLUTNING = 'UNDER_BESLUTNING',
    KLAR_TIL_FERDIGSTILLING = 'KLAR_TIL_FERDIGSTILLING',
}

export enum BenkBehandlingKlarEllerVenter {
    KLAR = 'KLAR',
    VENTER = 'VENTER',
}

export enum BenkKolonne {
    fnr = 'fnr',
    behandlingstype = 'behandlingstype',
    status = 'status',
    ventestatus = 'frist',
    startet = 'startet',
    saksbehandler = 'saksbehandler',
    beslutter = 'beslutter',
    sistEndret = 'sist_endret',
    beløp = 'beløp',
}

export enum BenkSorteringRetning {
    ASC = 'ASC',
    DESC = 'DESC',
}

export type BenkSortering = `${BenkKolonne},${BenkSorteringRetning}`;

export type BenkFilters = {
    benktype: BenkBehandlingKlarEllerVenter | null;
    type: BenkBehandlingstype | null;
    status: BenkBehandlingsstatus | null;
    saksbehandler: string | 'IKKE_TILDELT' | null;
    tilbakekrevingKunOverMinstebeløp: boolean | null;
};

export type BenkFiltersQueryParams = {
    benktype?: BenkBehandlingKlarEllerVenter;
    type?: BenkBehandlingstype;
    status?: BenkBehandlingsstatus;
    saksbehandler?: string | 'IKKE_TILDELT';
    tilbakekrevingKunOverMinstebeløp?: 'true' | 'false';
};
