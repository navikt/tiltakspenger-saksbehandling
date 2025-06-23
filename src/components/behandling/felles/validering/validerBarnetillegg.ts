import { ValideringResultat } from '~/types/Validering';
import { joinPerioder, validerPeriodisering } from '~/utils/periode';
import { Periode } from '~/types/Periode';
import { VedtakBarnetilleggPeriode } from '~/types/VedtakTyper';

export const validerBarnetillegg = (
    barnetilleggPerioder: VedtakBarnetilleggPeriode[],
    behandlingsperiode: Periode,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const perioder = barnetilleggPerioder.map((bt) => bt.periode);

    if (perioder.length === 0) {
        validering.errors.push('Minst en periode må spesifiseres når barnetillegg er valgt');
        return validering;
    }

    const perioderErUtenBarn = barnetilleggPerioder.every((bt) => bt.antallBarn === 0);
    const helePerioden = joinPerioder(perioder);

    if (!validerPeriodisering(perioder, true)) {
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
