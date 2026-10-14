import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import {
    BenkBehandlingBase,
    BenkBehandlingMedTilgangBase,
    BenkBehandlingsstatus,
    BenkBehandlingstype,
    BenkGlobaltFilter,
    BenkSaksbehandlerFilter,
    benkFellesKolonner,
    BenkBeskyttelsesfilter,
} from './felles';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { Prioritering } from '~/lib/_felles/prioritering/prioriteringTyper';

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

type BenkMeldekortProps = {
    type: BenkMeldekortType;
    id: MeldekortbehandlingId;
    status: BenkBehandlingsstatus;
    meldeperioder: Periode[];
    /** Beregnet beløp for meldekortbehandlinger som er beregnet, ellers null */
    beløp: Nullable<number>;
    /** Innsendte og korrigerte meldekort kan ikke prioriteres, og har alltid null */
    prioritering: Nullable<Prioritering>;
    /** Kun meldekortbehandlinger har kommandoer - innsendte/korrigerte meldekort er ikke behandlinger */
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
};

export type BenkMeldekort = BenkBehandlingBase<BenkMeldekortProps>;
export type BenkMeldekortMedTilgang = BenkBehandlingMedTilgangBase<BenkMeldekortProps>;

export const BenkMeldekortKolonne = {
    ...benkFellesKolonner,
    type: 'type',
    /** Backend sorterer på tidligste meldeperiode - sortKey-en er fortsatt 'periode' der */
    meldeperioder: 'periode',
    beløp: 'beløp',
    beslutter: 'beslutter',
} as const;

export type BenkMeldekortKolonne = (typeof BenkMeldekortKolonne)[keyof typeof BenkMeldekortKolonne];

export type BenkMeldekortFilter = BenkGlobaltFilter &
    BenkBeskyttelsesfilter & {
        saksbehandler: BenkSaksbehandlerFilter;
        status: Nullable<BenkBehandlingsstatus>;
        type: Nullable<BenkMeldekortType>;
    };
