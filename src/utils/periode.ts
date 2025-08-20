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
    if (perioder.length === 0) {
        throw Error('Må ha minst en periode');
    }

    const førsteFraOgMed = perioder
        .map((periode) => periode.fraOgMed)
        .toSorted()
        .at(0)!;
    const sisteTilOgMed = perioder
        .map((periode) => periode.tilOgMed)
        .toSorted()
        .at(-1)!;

    return { fraOgMed: førsteFraOgMed, tilOgMed: sisteTilOgMed };
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
