import { ValideringResultat } from '~/types/Validering';
import { Periode } from '~/types/Periode';
import { joinPerioder, validerPeriodisering } from '~/utils/periode';
import { AntallDagerPerMeldeperiode } from '~/types/AntallDagerPerMeldeperiode';

export const validerAntallDagerPerMeldeperiode = (
    antallDagerPerMeldeperiode: AntallDagerPerMeldeperiode[],
    innvilgelsesperiode: Periode,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const perioder = antallDagerPerMeldeperiode.map((apm) => apm.periode);

    if (perioder.length === 0) {
        validering.errors.push('Må ha minst en periode for antall dager per meldeperiode');
        return validering;
    }

    if (!validerPeriodisering(perioder, false)) {
        validering.errors.push(
            'Periodene for antall dager per meldeperiode må være sammenhengende og uten overlapp',
        );
    }

    const helePerioden = joinPerioder(perioder);

    if (helePerioden.fraOgMed !== innvilgelsesperiode.fraOgMed) {
        validering.errors.push(
            'Perioden for antall dager per meldeperiode må ha samme startdato som innvilgelsesperioden',
        );
    }

    if (helePerioden.tilOgMed !== innvilgelsesperiode.tilOgMed) {
        validering.errors.push(
            'Perioden for antall dager per meldeperiode må ha samme sluttdato som innvilgelsesperioden',
        );
    }

    return validering;
};
