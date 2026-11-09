import { Periode } from '~/types/Periode';

/**
 * En periode som tidligere er innvilget, og senere opphørt eller stanset, og som kan innvilges på nytt ved omgjøring.
 * Tiltaksdeltakelsen i saksopplysningene trenger ikke lenger dekke perioden.
 * Da innvilges perioden med bildet av tiltaksdeltakelsen fra den opprinnelige innvilgelsen, og kalles et reversert opphør.
 */
export type PeriodeForReversertOpphør = {
    internDeltakelseId: string;
    periode: Periode;
    typeNavn: string;
};
