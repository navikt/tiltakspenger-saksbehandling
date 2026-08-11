import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { BenkV2BehandlingBase, BenkV2Behandlingsstatus, BenkV2Behandlingstype } from './felles';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';

/**
 * Meldekort-fanen samler både meldekortbehandlinger startet av saksbehandler
 * og meldekort (innsendte/korrigerte) som venter på behandling.
 * Radtypene er subsettet av BenkV2Behandlingstype som gjelder meldekort.
 */
export const benkMeldekortTyper = {
    MELDEKORTBEHANDLING: BenkV2Behandlingstype.MELDEKORTBEHANDLING,
    INNSENDT_MELDEKORT: BenkV2Behandlingstype.INNSENDT_MELDEKORT,
    KORRIGERT_MELDEKORT: BenkV2Behandlingstype.KORRIGERT_MELDEKORT,
} as const;

export type BenkMeldekortType = (typeof benkMeldekortTyper)[keyof typeof benkMeldekortTyper];

export type BenkMeldekort = BenkV2BehandlingBase & {
    type: BenkMeldekortType;
    id: MeldekortbehandlingId;
    status: BenkV2Behandlingsstatus;
    periode: Periode;
    /** Beregnet beløp for meldekortbehandlinger som er beregnet, ellers null */
    beløp: Nullable<number>;
    /** Tidspunkt bruker sendte inn meldekortet, kun for innsendte/korrigerte */
    mottattTidspunkt: Nullable<string>;
    /** Kun meldekortbehandlinger har kommandoer - innsendte/korrigerte meldekort er ikke behandlinger */
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
};

export enum BenkMeldekortKolonne {
    fnr = 'fnr',
    type = 'type',
    periode = 'periode',
    beløp = 'beløp',
    status = 'status',
    mottatt = 'mottatt',
    saksbehandler = 'saksbehandler',
    ventestatusFrist = 'ventestatus_frist',
}

export type BenkMeldekortFilter = {
    status: Nullable<BenkV2Behandlingsstatus>;
    type: Nullable<BenkMeldekortType>;
    saksbehandler: Nullable<string | 'IKKE_TILDELT'>;
    skjulPåVent: boolean;
};
