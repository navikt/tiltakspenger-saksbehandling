import { Periode } from '~/types/Periode';
import dayjs from 'dayjs';

export const validerPeriodisering = (perioder: Periode[], tillatHull: boolean) => {
    return perioder.every((periode, index) => {
        if (index === 0) {
            return true;
        }

        const forrigePeriode = perioder[index - 1];

        return tillatHull
            ? dayjs(periode.fraOgMed).isAfter(forrigePeriode.tilOgMed)
            : dayjs(periode.fraOgMed).subtract(1, 'day').isSame(forrigePeriode.tilOgMed);
    });
};

export const joinPerioder = (perioder: Periode[]): Periode => {
    return { fraOgMed: perioder[0].fraOgMed, tilOgMed: perioder.slice(-1)[0].tilOgMed };
};

export const erDatoIPeriode = (dato: string, periode: Periode) => {
    return dato >= periode.fraOgMed && dato <= periode.tilOgMed;
};

export const perioderOverlapper = (a: Periode, b: Periode) => {
    return (
        erDatoIPeriode(a.fraOgMed, b) ||
        erDatoIPeriode(a.tilOgMed, b) ||
        erDatoIPeriode(b.fraOgMed, a) ||
        erDatoIPeriode(b.tilOgMed, a)
    );
};
