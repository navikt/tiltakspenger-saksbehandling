import { ValideringResultat } from '~/types/Validering';
import { Periode } from '~/types/Periode';
import { joinPerioder, validerPeriodisering } from '~/utils/periode';
import { AntallDagerPerMeldeperiodeFormData } from '~/components/behandling/context/slices/AntallDagerPerMeldeperiodeState';

export const validerAntallDagerPerMeldeperiode = (
    antallDagerPerMeldeperiode: AntallDagerPerMeldeperiodeFormData[],
    behandlingsperiode: Periode,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };
    const harFylltUtAlleNødvendigeFelter = antallDagerPerMeldeperiode.every(
        (periode) =>
            periode.antallDagerPerMeldeperiode &&
            periode.periode.fraOgMed &&
            periode.periode.tilOgMed,
    );

    if (!harFylltUtAlleNødvendigeFelter) {
        validering.errors.push('Alle felter for antall dager per meldeperiode må fylles ut');
    } else {
        antallDagerPerMeldeperiode.forEach((periode) => {
            //validert over til å være utfylt.
            if (
                periode.antallDagerPerMeldeperiode! < 1 ||
                periode.antallDagerPerMeldeperiode! > 14
            ) {
                validering.errors.push(
                    `Antall dager per meldeperiode må være mellom 1 og 14. Perioden: ${periode.periode.fraOgMed} - ${periode.periode.tilOgMed}, Antall dager: ${periode.antallDagerPerMeldeperiode}`,
                );
            }
        });

        const perioder = antallDagerPerMeldeperiode.map((apm) => ({
            fraOgMed: apm.periode.fraOgMed!,
            tilOgMed: apm.periode.tilOgMed!,
        }));

        if (!validerPeriodisering(perioder, false)) {
            validering.errors.push(
                'Periodene for antall dager per meldeperiode må være sammenhengende og uten overlapp',
            );
        }

        const helePerioden = joinPerioder(perioder);

        if (helePerioden.fraOgMed !== behandlingsperiode.fraOgMed) {
            validering.errors.push(
                'Perioden for antall dager per meldeperiode må ha samme startdato som innvilgelsesperioden',
            );
        }

        if (helePerioden.tilOgMed !== behandlingsperiode.tilOgMed) {
            validering.errors.push(
                'Perioden for antall dager per meldeperiode må ha samme sluttdato som innvilgelsesperioden',
            );
        }
    }
    return validering;
};
