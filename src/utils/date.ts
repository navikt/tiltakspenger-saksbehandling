import dayjs from 'dayjs';
import { Periode, ÅpenPeriode } from '../types/Periode';

export function formatDateShort(dateString: string) {
    return dayjs(dateString).format('DD.MM.YY');
}

export function formatDate(dateString: string) {
    return dayjs(dateString).format('DD.MM.YYYY');
}

export function formatPeriode({ fra, til }: Periode) {
    return `${formatDate(fra)} - ${formatDate(til)}`;
}

export function formatÅpenPeriode({ fra, til }: ÅpenPeriode) {
    if (til) return formatPeriode({ fra, til } as Periode);
    return `${formatDate(fra)} - `;
}
