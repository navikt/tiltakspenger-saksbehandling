import dayjs from 'dayjs';
import { Periode } from '../types/Periode';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/nb';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.locale('nb');

export function dateTilISOTekst(date: Date) {
  return dayjs(date).format('YYYY-MM-DD');
}

export function dateTilFormatertTekst(date: Date) {
  return dayjs(date).format('DD.MM.YYYY');
}

export function formaterDatotekst(dateString: string) {
  return dayjs(dateString).format('DD.MM.YYYY');
}

export function formaterDatotekstMedTidspunkt(dateString: string) {
  return dayjs(dateString).format('DD.MM.YYYY HH:mm');
}

export function periodeTilFormatertDatotekst({ fraOgMed, tilOgMed }: Periode) {
  return `${formaterDatotekst(fraOgMed)} - ${formaterDatotekst(tilOgMed)}`;
}

export function ukedagFraDate(date: Date) {
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

export function ukenummerFraDate(date: Date) {
  return dayjs(date).week();
}

export function tekstTilDate(dateString: string) {
  return dayjs(dateString).toDate();
}

export const meldekortUkeNummer = (fom: string, tom: string): string => {
  return `Uke ${ukenummerFraDate(new Date(fom))} / ${ukenummerFraDate(new Date(tom))}`;
};
