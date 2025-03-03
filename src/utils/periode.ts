import { Periode } from '../types/Periode';
import dayjs from 'dayjs';

export const validerPeriodisering = (perioder: Periode[]) => {
    return perioder.every((periode, index) => {
        if (index === 0) {
            return true;
        }

        const forrigePeriode = perioder[index - 1];

        return dayjs(periode.fraOgMed).subtract(1, 'day').isSame(forrigePeriode.tilOgMed);
    });
};

export const joinPerioder = (perioder: Periode[]): Periode => {
    return { fraOgMed: perioder[0].fraOgMed, tilOgMed: perioder.slice(-1)[0].tilOgMed };
};
