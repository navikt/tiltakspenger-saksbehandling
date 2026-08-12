import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { BenkBehandlingBase, BenkBehandlingsstatus, BenkBehandlingstype } from './felles';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';

/**
 * Meldekort-fanen samler både meldekortbehandlinger startet av saksbehandler
 * og meldekort (innsendte/korrigerte) som venter på behandling.
 * Radtypene er subsettet av BenkBehandlingstype som gjelder meldekort.
 */
export const benkMeldekortTyper = {
    MELDEKORTBEHANDLING: BenkBehandlingstype.MELDEKORTBEHANDLING,
    INNSENDT_MELDEKORT: BenkBehandlingstype.INNSENDT_MELDEKORT,
    KORRIGERT_MELDEKORT: BenkBehandlingstype.KORRIGERT_MELDEKORT,
} as const;

export type BenkMeldekortType = (typeof benkMeldekortTyper)[keyof typeof benkMeldekortTyper];

export type BenkMeldekort = BenkBehandlingBase & {
    type: BenkMeldekortType;
    id: MeldekortbehandlingId;
    status: BenkBehandlingsstatus;
    meldeperioder: Periode[];
    /** Beregnet beløp for meldekortbehandlinger som er beregnet, ellers null */
    beløp: Nullable<number>;
    /** Kun meldekortbehandlinger har kommandoer - innsendte/korrigerte meldekort er ikke behandlinger */
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
};

export enum BenkMeldekortKolonne {
    fnr = 'fnr',
    type = 'type',
    /** Backend sorterer på tidligste meldeperiode - sortKey-en er fortsatt 'periode' der */
    meldeperioder = 'periode',
    beløp = 'beløp',
    status = 'status',
    sistEndret = 'sist_endret',
    saksbehandler = 'saksbehandler',
    beslutter = 'beslutter',
    ventestatusFrist = 'ventestatus_frist',
}

export type BenkMeldekortFilter = {
    status: Nullable<BenkBehandlingsstatus>;
    type: Nullable<BenkMeldekortType>;
    saksbehandler: Nullable<string>;
    skjulPåVent: boolean;
    skjulEgneTilBeslutning: boolean;
};
