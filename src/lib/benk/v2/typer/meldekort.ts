import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';
import { BenkV2BehandlingBase, BenkV2Behandlingsstatus, BenkV2Request } from './felles';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';

/**
 * Meldekort-fanen samler både meldekortbehandlinger startet av saksbehandler
 * og meldekort (innsendte/korrigerte) som venter på behandling.
 */
export enum BenkMeldekortType {
    MELDEKORTBEHANDLING = 'MELDEKORTBEHANDLING',
    INNSENDT_MELDEKORT = 'INNSENDT_MELDEKORT',
    KORRIGERT_MELDEKORT = 'KORRIGERT_MELDEKORT',
}

export type BenkMeldekort = BenkV2BehandlingBase & {
    id: MeldekortbehandlingId;
    status: BenkV2Behandlingsstatus;
    type: BenkMeldekortType;
    periode: Periode;
    /** Beregnet beløp for meldekortbehandlinger som er beregnet, ellers null */
    beløp: Nullable<number>;
    /** Tidspunkt bruker sendte inn meldekortet, kun for innsendte/korrigerte */
    mottattTidspunkt: Nullable<string>;
};

export enum BenkMeldekortKolonne {
    fnr = 'fnr',
    type = 'type',
    periode = 'periode',
    beløp = 'beløp',
    status = 'status',
    mottatt = 'mottatt',
    saksbehandler = 'saksbehandler',
}

export type BenkMeldekortFilter = {
    status: Nullable<BenkV2Behandlingsstatus>;
    type: Nullable<BenkMeldekortType>;
    saksbehandler: Nullable<string | 'IKKE_TILDELT'>;
    skjulPåVent: boolean;
};

export type BenkMeldekortRequest = BenkV2Request<BenkMeldekortFilter, BenkMeldekortKolonne>;
