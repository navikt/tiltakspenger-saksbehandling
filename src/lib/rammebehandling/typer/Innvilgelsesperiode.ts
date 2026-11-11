import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';

// Skjemaets modell av en innvilgelsesperiode, med én valgt tiltaksdeltakelse per periode.
// API-et støtter flere tiltaksdeltakelser per periode, se InnvilgelsesperiodeDTO og LagretInnvilgelsesperiode.
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

// En tiltaksdeltakelse det innvilges for i en innvilgelsesperiode, med sitt eget antall dager per meldeperiode
export type InnvilgetTiltaksdeltakelseDTO = {
    internDeltakelseId: string;
    antallDagerPerMeldeperiode: number;
};

// Innvilgelsesperioden slik den sendes til backend.
// Flere tiltaksdeltakelser kan innvilges i samme periode.
export type InnvilgelsesperiodeDTO = {
    periode: Periode;
    tiltaksdeltakelser: InnvilgetTiltaksdeltakelseDTO[];
    erReversertOpphør?: boolean;
};

// Valideres av backend mot saksopplysningene på behandlingen
export type LagretInnvilgetTiltaksdeltakelse = InnvilgetTiltaksdeltakelseDTO & {
    ugyldigTiltaksdeltakelse?: Nullable<UgyldigTiltaksdeltakelse>;
};

// Innvilgelsesperioden slik den returneres fra backend
export type LagretInnvilgelsesperiode = {
    periode: Periode;
    tiltaksdeltakelser: LagretInnvilgetTiltaksdeltakelse[];
    erReversertOpphør?: boolean;
};
