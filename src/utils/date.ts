import dayjs, { Dayjs } from 'dayjs';
import { Periode } from '~/types/Periode';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';
import isBetween from 'dayjs/plugin/isBetween';
import minMax from 'dayjs/plugin/minMax';
import 'dayjs/locale/nb';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(isBetween);
dayjs.extend(minMax);
dayjs.locale('nb');

const DATO_FORMAT = 'YYYY-MM-DD';

const ukedager = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'] as const;

export function dateTilISOTekst(date: Date | string | Dayjs) {
    return dayjs(date).format(DATO_FORMAT);
}

export function formaterTidspunkt(dateString: string) {
    return dayjs(dateString).format('DD.MM.YYYY kl. HH:mm');
}

export function formaterTidspunktKort(dateString: string) {
    return dayjs(dateString).format('DD.MM.YY HH:mm');
}

export function formaterDatotekst(dateString: string) {
    return dayjs(dateString).format('DD.MM.YYYY');
}

export function periodeTilFormatertDatotekst({ fraOgMed, tilOgMed }: Periode) {
    return `${formaterDatotekst(fraOgMed)} - ${formaterDatotekst(tilOgMed)}`;
}

export const meldekortHeading = (periode: Periode): string => {
    return `Meldekort uke ${ukenummerFraDatotekst(periode.fraOgMed)} og ${ukenummerFraDatotekst(periode.tilOgMed)}`;
};

export function ukedagFraDatotekst(dato: string) {
    return ukedager[dayjs(dato).weekday()];
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

export const nesteDag = (dato: string) => leggTilDager(dato, 1);

export const forrigeDag = (dato: string) => leggTilDager(dato, -1);

export const overlapperMed = (dato: string | Date, periode: Periode) =>
    dayjs(dato).isBetween(periode.fraOgMed, periode.tilOgMed) ||
    dayjs(dato).isSame(periode.fraOgMed) ||
    dayjs(dato).isSame(periode.tilOgMed);

export const datoTilDatoInputText = (dato: string | Date): string => {
    return dayjs(dato).format('DD.MM.YYYY');
};

export const datoMin = (...datoer: Array<string | Date>): string => {
    return dayjs.min(datoer.map(dayjs))!.format(DATO_FORMAT);
};

export const datoMax = (...datoer: Array<string | Date>): string => {
    return dayjs.max(datoer.map(dayjs))!.format(DATO_FORMAT);
};

export const erLørdagEllerSøndag = (dato: string | Date): boolean => {
    return dayjs(dato).weekday() >= 5;
};
