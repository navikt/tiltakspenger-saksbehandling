import { ValideringResultat } from '~/types/Validering';
import {
    totalPeriode,
    perioderErLike,
    periodiseringerErLike,
    periodiseringTotalPeriode,
    validerPeriodisering,
} from '~/utils/periode';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { periodiserBarnetilleggFraSøknad } from '~/components/behandling/felles/barnetillegg/utils/periodiserBarnetilleggFraSøknad';
import { Søknad } from '~/types/Søknad';
import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';

export const validerBarnetillegg = (
    harBarnetillegg: boolean,
    barnetilleggPerioder: BarnetilleggPeriode[],
    innvilgelsesperioder: Innvilgelsesperiode[],
    søknad: Søknad,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const periodiseringFraSøknad = periodiserBarnetilleggFraSøknad(
        søknad.barnetillegg,
        innvilgelsesperioder,
    );

    if (!harBarnetillegg) {
        if (periodiseringFraSøknad.length > 0) {
            validering.warnings.push(
                `Det er søkt om barnetillegg, men barnetillegg er ikke innvilget - Forventet barnetillegg fra søknad: ${formatterPeriodisering(periodiseringFraSøknad)}`,
            );
        }
        return validering;
    }

    const perioder = barnetilleggPerioder.map((bt) => bt.periode);

    if (perioder.length === 0) {
        validering.errors.push('Minst en periode må spesifiseres når barnetillegg skal innvilges');
        return validering;
    }

    const totalInnvilgelsesperiode = periodiseringTotalPeriode(innvilgelsesperioder);

    // Disse valideringene er ikke nødvendigvis presise, ettersom søknaden ikke alltid har
    // fullstendig informasjon om brukerens barn
    if (
        !periodiseringerErLike(
            periodiseringFraSøknad,
            barnetilleggPerioder,
            (p1, p2) => p1.antallBarn === p2.antallBarn,
        )
    ) {
        const totalBarnetilleggPeriode = totalPeriode(perioder);

        // Dersom søknaden ikke hadde barn, kan vi ikke vite noe om alder på evt barn som saksbehandler har lagt inn.
        // Vi viser en standard warning dersom barnetillegget saksbehandler har valgt ikke fyller hele innvilgelsesperioden
        if (søknad.barnetillegg.length === 0) {
            if (!perioderErLike(totalInnvilgelsesperiode, totalBarnetilleggPeriode)) {
                validering.warnings.push(
                    `Den totale perioden for barnetillegg (${periodeTilFormatertDatotekst(totalBarnetilleggPeriode)}) fyller ikke hele innvilgelsesperioden (${periodeTilFormatertDatotekst(totalInnvilgelsesperiode)})`,
                );
            }
            validering.warnings.push(
                'Det er innvilget barnetillegg uten at vi har mottatt søknad med barn',
            );
        } else {
            validering.warnings.push(
                `Innvilget barnetillegg stemmer ikke med barn fra siste søknad - Forventet barnetillegg fra søknad: ${formatterPeriodisering(periodiseringFraSøknad)}`,
            );
        }
    }

    const perioderErUtenBarn = barnetilleggPerioder.every((bt) => bt.antallBarn === 0);
    const helePerioden = totalPeriode(perioder);

    if (!validerPeriodisering(barnetilleggPerioder, true)) {
        validering.errors.push('Periodene for barnetillegg kan ikke ha overlapp');
    }

    if (perioderErUtenBarn) {
        validering.errors.push('Minst en periode må ha barn når barnetillegg er valgt');
    }

    if (helePerioden.fraOgMed < totalInnvilgelsesperiode.fraOgMed) {
        validering.errors.push('Barnetillegg-perioden kan ikke starte før innvilgelsesperioden');
    }

    if (helePerioden.tilOgMed > totalInnvilgelsesperiode.tilOgMed) {
        validering.errors.push('Barnetillegg-perioden kan ikke slutte etter innvilgelsesperioden');
    }

    return validering;
};

const formatterPeriodisering = (btPeriodisering: BarnetilleggPeriode[]) => {
    return btPeriodisering
        .map((bt) => `${bt.antallBarn} barn i perioden ${periodeTilFormatertDatotekst(bt.periode)}`)
        .join(', ');
};
