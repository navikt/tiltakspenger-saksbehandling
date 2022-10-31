import dayjs from 'dayjs';
import { Periode } from '../types/Periode';

export function formatDate(dateString: string) {
    return dayjs(dateString).format('DD.MM.YYYY');
}

export function formatPeriode({ fra, til }: Periode) {
    return `${formatDate(fra)} - ${formatDate(til)}`;
}
