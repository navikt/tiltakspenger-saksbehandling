import { MedPeriode, Periode } from '~/types/Periode';
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

export const inneholderHelePerioden = (a: Periode, b: Periode) => {
    return erDatoIPeriode(b.fraOgMed, a) && erDatoIPeriode(b.tilOgMed, a);
};

export const erFullstendigPeriode = (periode: Partial<Periode>): periode is Periode => {
    return !!periode.fraOgMed && !!periode.tilOgMed;
};

export const perioderErLike = (periode1: Periode, periode2: Periode) =>
    periode1.fraOgMed === periode2.fraOgMed && periode1.tilOgMed == periode2.tilOgMed;

export const periodiseringerErLike = <T>(
    perioder1: MedPeriode<T>[],
    perioder2: MedPeriode<T>[],
    sammenlignVerdi: (p1: T, p2: T) => boolean,
) => {
    return (
        perioder1.length === perioder2.length &&
        perioder1.every((periode, index) => {
            const periode2 = perioder2.at(index)!;

            return (
                perioderErLike(periode.periode, periode2.periode) &&
                sammenlignVerdi(periode, periode2)
            );
        })
    );
};
