import { ValideringResultat } from '~/types/Validering';
import { joinPerioder, validerPeriodisering } from '~/utils/periode';
import { Periode } from '~/types/Periode';
import { BarnetilleggPeriodeFormData } from '../barnetillegg/utils/hentBarnetilleggFraBehandling';

export const validerBarnetillegg = (
    barnetilleggPerioder: BarnetilleggPeriodeFormData[],
    behandlingsperiode: Periode,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const perioder = barnetilleggPerioder.map((bt) => bt.periode);
    const erAllePerioderUtfyllt = perioder.every((p) => p.fraOgMed !== null && p.tilOgMed !== null);

    if (!erAllePerioderUtfyllt) {
        validering.errors.push(
            'Alle perioder for barnetillegg må ha både fra og med- og til og med-dato satt',
        );
        return validering;
    }

    if (perioder.length === 0) {
        validering.errors.push('Minst en periode må spesifiseres når barnetillegg er valgt');
        return validering;
    }

    const perioderErUtenBarn = barnetilleggPerioder.every((bt) => bt.antallBarn === 0);
    const helePerioden = joinPerioder(perioder as Periode[]);

    if (!validerPeriodisering(perioder as Periode[], true)) {
        validering.errors.push('Periodene for barnetillegg kan ikke ha overlapp');
    }

    if (perioderErUtenBarn) {
        validering.errors.push('Minst en periode må ha barn når barnetillegg er valgt');
    }

    if (helePerioden.fraOgMed < behandlingsperiode.fraOgMed) {
        validering.errors.push('Barnetillegg-perioden kan ikke starte før innvilgelsesperioden');
    }

    if (helePerioden.tilOgMed > behandlingsperiode.tilOgMed) {
        validering.errors.push('Barnetillegg-perioden kan ikke slutte etter innvilgelsesperioden');
    }

    return validering;
};
