import { ValideringResultat } from '~/types/Validering';
import {
    joinPerioder,
    perioderErLike,
    periodiseringerErLike,
    validerPeriodisering,
} from '~/utils/periode';
import { Periode } from '~/types/Periode';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { periodiserBarnetilleggFraSøknad } from '~/components/behandling/felles/barnetillegg/utils/periodiserBarnetilleggFraSøknad';
import { Søknad } from '~/types/Søknad';

export const validerBarnetillegg = (
    barnetilleggPerioder: BarnetilleggPeriode[],
    innvilgelsesperiode: Periode,
    søknad: Søknad,
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

    const periodiseringFraSøknad = periodiserBarnetilleggFraSøknad(
        søknad.barnetillegg,
        innvilgelsesperiode,
    );

    // Disse valideringene er ikke nødvendigvis presise, ettersom søknaden ikke alltid har
    // fullstendig informasjon om brukerens barn
    if (
        !periodiseringerErLike(
            periodiseringFraSøknad,
            barnetilleggPerioder,
            (p1, p2) => p1.antallBarn === p2.antallBarn,
        )
    ) {
        const totalBarnetilleggPeriode = joinPerioder(perioder);

        // Dersom søknaden ikke hadde barn, kan vi ikke vite noe om alder på evt barn som saksbehandler har lagt inn.
        // Vi viser en standard warning dersom barnetillegget saksbehandler har valgt ikke fyller hele innvilgelsesperioden
        if (
            søknad.barnetillegg.length === 0 &&
            !perioderErLike(innvilgelsesperiode, totalBarnetilleggPeriode)
        ) {
            validering.warnings.push(
                `Den totale perioden for barnetillegg (${periodeTilFormatertDatotekst(totalBarnetilleggPeriode)}) fyller ikke hele innvilgelsesperioden (${periodeTilFormatertDatotekst(innvilgelsesperiode)})`,
            );
        }

        validering.warnings.push(
            `Valgt barnetillegg stemmer ikke med barn fra siste søknad - Forventet barnetillegg fra søknad: ${formatterPeriodisering(periodiseringFraSøknad)}`,
        );
    }

    const perioderErUtenBarn = barnetilleggPerioder.every((bt) => bt.antallBarn === 0);
    const helePerioden = joinPerioder(perioder);

    if (!validerPeriodisering(perioder, true)) {
        validering.errors.push('Periodene for barnetillegg kan ikke ha overlapp');
    }

    if (perioderErUtenBarn) {
        validering.errors.push('Minst en periode må ha barn når barnetillegg er valgt');
    }

    if (helePerioden.fraOgMed < innvilgelsesperiode.fraOgMed) {
        validering.errors.push('Barnetillegg-perioden kan ikke starte før innvilgelsesperioden');
    }

    if (helePerioden.tilOgMed > innvilgelsesperiode.tilOgMed) {
        validering.errors.push('Barnetillegg-perioden kan ikke slutte etter innvilgelsesperioden');
    }

    return validering;
};

const formatterPeriodisering = (btPeriodisering: BarnetilleggPeriode[]) => {
    return btPeriodisering
        .map((bt) => `${bt.antallBarn} barn i perioden ${periodeTilFormatertDatotekst(bt.periode)}`)
        .join(', ');
};
