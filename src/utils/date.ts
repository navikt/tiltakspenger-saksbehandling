import dayjs from 'dayjs';
import { Periode } from '../types/Periode';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/nb';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.locale('nb');

export function dateToISO(date: Date) {
  return dayjs(date).format('YYYY-MM-DD');
}

export function formatDateObject(date: Date) {
  return dayjs(date).format('DD.MM.YYYY');
}

export function formatDate(dateString: string) {
  return dayjs(dateString).format('DD.MM.YYYY');
}

export function formatDateTime(dateString: string) {
  return dayjs(dateString).format('DD.MM.YYYY HH:mm');
}

export function formatPeriode({ fra, til }: Periode) {
  return `${formatDateObject(fra)} - ${formatDateObject(til)}`;
}

export function parseDateTimestamp(dateString: Date) {
  return dayjs(dateString.toISOString().split('T')[0]).format('DD.MM.YYYY');
}

export function getDayOfWeek(date: Date) {
  const ukedager = [
    'Mandag',
    'Tirsdag',
    'Onsdag',
    'Torsdag',
    'Fredag',
    'Lørdag',
    'Søndag',
  ];
  return ukedager[dayjs(date).weekday()];
}

export function getWeekNumber(date: Date) {
  return dayjs(date).week();
}

export function toDate(dateString: string) {
  return dayjs(dateString).toDate();
}
