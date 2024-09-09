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

export function formaterTidspunkt(dateString: string) {
  return dayjs(dateString).format('DD.MM.YYYY kl. hh:mm');
}

export function formaterDatotekst(dateString: string) {
  return dayjs(dateString).format('DD.MM.YYYY');
}

export function periodeTilFormatertDatotekst({ fraOgMed, tilOgMed }: Periode) {
  return `${formaterDatotekst(fraOgMed)} - ${formaterDatotekst(tilOgMed)}`;
}

export const meldekortHeading = (periode: Periode): string => {
  return `Meldekort uke ${ukenummerFraDatotekst(periode.fraOgMed)} / ${ukenummerFraDatotekst(periode.tilOgMed)}`;
};

export const ukeHeading = (dato: string): string => {
  return `Uke ${ukenummerFraDatotekst(dato)} - ${månedFraDatotekst(dato)} ${dayjs(dato).year()} `;
};

export function ukedagFraDatotekst(date: string) {
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

export function månedFraDatotekst(date: string) {
  const måneder = [
    'januar',
    'februar',
    'mars',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'desember',
  ];
  return måneder[dayjs(date).month()];
}

export function ukenummerFraDatotekst(date: string) {
  return dayjs(date).week();
}
