import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';

export type Innvilgelsesperiode = {
    periode: Periode;
    antallDagerPerMeldeperiode: number;
    internDeltakelseId: string;
    /** Reversert opphør: innvilges på nytt uten gyldig tiltaksdeltakelse i saksopplysningene. */
    erReversertOpphør?: boolean;
};

export type InnvilgelsesperiodePartial = {
    periode: Partial<Periode>;
    antallDagerPerMeldeperiode?: number;
    internDeltakelseId?: string;
    erReversertOpphør?: boolean;
};

// Valgt tiltaksdeltakelse passer ikke med innvilgelsesperioden, f.eks. fordi deltakelsen er endret etter at innvilgelsen ble lagret
export type UgyldigTiltaksdeltakelse =
    | { type: 'FINNES_IKKE' | 'KAN_IKKE_INNVILGES'; deltakelsesperiode: null }
    | { type: 'DEKKER_IKKE_PERIODEN'; deltakelsesperiode: Periode };

// Valideres av backend mot saksopplysningene på behandlingen
export type LagretInnvilgelsesperiode = Innvilgelsesperiode & {
    ugyldigTiltaksdeltakelse?: Nullable<UgyldigTiltaksdeltakelse>;
};
