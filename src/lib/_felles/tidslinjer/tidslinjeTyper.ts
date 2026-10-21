import { Periode } from '~/types/Periode';
import { VedtakId } from '~/lib/rammebehandling/typer/Rammevedtak';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Nullable } from '~/types/UtilTypes';

export type TidslinjeRammevedtak = {
    elementer: TidslinjeElement[];
};

type TidslinjeElement = {
    rammevedtakId: VedtakId;
    periode: Periode;
    tidslinjeResultat: TidslinjeResultat;
};

/**
 * Vedtakstidslinjen innenfor vedtaksperioden til en rammebehandling, før og etter at behandlingen er iverksatt.
 * Sammenligningen gjøres i backend. Perioder uten element gir ikke rett til tiltakspenger.
 */
export type TidslinjeFørOgEtter = {
    periode: Periode;
    før: TidslinjeFørOgEtterElement[];
    etter: TidslinjeFørOgEtterElement[];
    harEndring: boolean;
};

export type TidslinjeFørOgEtterElement = {
    periode: Periode;
    tidslinjeResultat: TidslinjeResultat;
    behandlingId: RammebehandlingId;
    /** Null dersom behandlingen ikke er iverksatt. */
    rammevedtakId: Nullable<VedtakId>;
    /** Kun satt ved innvilgelse. */
    antallDagerPerMeldeperiode: Nullable<number>;
    /** Kun satt ved innvilgelse. */
    antallBarn: Nullable<number>;
};

export enum TidslinjeResultat {
    STANS = 'STANS',
    FORLENGELSE = 'FORLENGELSE',
    SØKNADSBEHANDLING_INNVILGELSE = 'SØKNADSBEHANDLING_INNVILGELSE',
    REVURDERING_INNVILGELSE = 'REVURDERING_INNVILGELSE',
    OMGJØRING_INNVILGELSE = 'OMGJØRING_INNVILGELSE',
    OMGJØRING_OPPHØR = 'OMGJØRING_OPPHØR',
}
