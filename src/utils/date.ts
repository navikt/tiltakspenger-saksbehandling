import dayjs from 'dayjs';
import { Periode } from '../types/Periode';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/nb';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.locale('nb');

const DATO_FORMAT = 'YYYY-MM-DD';

export function dateTilISOTekst(date: Date) {
    return dayjs(date).format(DATO_FORMAT);
}

export function formaterTidspunkt(dateString: string) {
    return dayjs(dateString).format('DD.MM.YYYY kl. HH:mm');
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

export const meldekortdagHeading = (dato: string) => {
    return `${ukedagFraDatotekst(dato)} ${formaterDatotekst(dato)}`;
};

export function ukedagFraDatotekst(dato: string) {
    const ukedager = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
    return ukedager[dayjs(dato).weekday()];
}

export function månedFraDatotekst(dato: string) {
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
    return måneder[dayjs(dato).month()];
}

export function ukenummerFraDatotekst(dato: string) {
    return dayjs(dato).week();
}

export const alderFraDato = (dato: string) => {
    return dayjs().diff(dato, 'years');
};

export const finn16årsdag = (fødselsdato: string) => {
    return dayjs(fødselsdato).add(16, 'years').format(DATO_FORMAT);
};

export const leggTilDager = (dato: string, dager: number) => {
    return dayjs(dato).add(dager, 'day').format(DATO_FORMAT);
};
