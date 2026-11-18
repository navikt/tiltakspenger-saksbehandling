import { MedPeriode, Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { slåSammenPerioder } from '~/utils/periode';

export type InnvilgelsesperiodeForTiltak = {
    periode: Periode;
};

/**
 * Et valgt tiltak med periodene det innvilges for.
 * Periodene for samme tiltak kan ikke overlappe, men perioder for ulike tiltak kan det.
 */
export type InnvilgelseForTiltak = {
    internDeltakelseId: string;
    /** Reversert opphør: innvilges på nytt uten gyldig tiltaksdeltakelse i saksopplysningene. */
    erReversertOpphør: boolean;
    perioder: InnvilgelsesperiodeForTiltak[];
};

export type AntallDagerForPeriode = {
    periode: Periode;
    antallDagerPerMeldeperiode: number;
};

/**
 * Tiltakene det innvilges for, og antall dager per meldeperiode for periodene de gir.
 * Periodene deles opp der periodene for tiltakene starter eller slutter, se hentDelperioder.
 * Backend gjør dette om til innvilgelsesperioder med en liste av tiltaksdeltakelser og felles antall dager.
 */
export type Innvilgelsesperioder = {
    tiltak: InnvilgelseForTiltak[];
    antallDagerPerMeldeperiode: AntallDagerForPeriode[];
};

// Valgt tiltaksdeltakelse passer ikke med innvilgelsesperioden, f.eks. fordi deltakelsen er endret etter at innvilgelsen ble lagret
export type UgyldigTiltaksdeltakelse =
    | { type: 'FINNES_IKKE' | 'KAN_IKKE_INNVILGES'; deltakelsesperiode: null }
    | { type: 'DEKKER_IKKE_PERIODEN'; deltakelsesperiode: Periode };

// Valideres av backend mot saksopplysningene på behandlingen
export type LagretInnvilgelsesperiodeForTiltak = InnvilgelsesperiodeForTiltak & {
    ugyldigTiltaksdeltakelse?: Nullable<UgyldigTiltaksdeltakelse>;
};

export type LagretInnvilgelseForTiltak = Omit<InnvilgelseForTiltak, 'perioder'> & {
    perioder: LagretInnvilgelsesperiodeForTiltak[];
};

export type LagredeInnvilgelsesperioder = Omit<Innvilgelsesperioder, 'tiltak'> & {
    tiltak: LagretInnvilgelseForTiltak[];
};

/** Periodene det innvilges for, uavhengig av tiltak, slått sammen der de overlapper eller tilstøter hverandre. */
export const hentInnvilgedePerioder = ({
    tiltak,
}: Pick<Innvilgelsesperioder, 'tiltak'>): MedPeriode[] =>
    slåSammenPerioder(tiltak.flatMap((it) => it.perioder.map(({ periode }) => periode))).map(
        (periode) => ({ periode }),
    );
