import dayjs, { Dayjs } from 'dayjs';
import { nonNullish } from '~/utils/object';
import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { formaterSladdbarVerdi } from '~/utils/sladdetVerdi';
import { Dato, Tidspunkt } from '~/types/DatoTid';
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

export type DatoInput = Date | Dato | Tidspunkt;

const DATO_FORMAT = 'YYYY-MM-DD';

const ukedagerKort = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'] as const;
const ukedager = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'] as const;

export const dateTilISOTekst = (date: Date | string | Dayjs): Dato => {
    return dayjs(date).format(DATO_FORMAT) as Dato;
};

export const formaterTidspunkt = (tidspunkt: Tidspunkt) => {
    return dayjs(tidspunkt).format('DD.MM.YYYY kl. HH:mm');
};

export const formaterTidspunktMedSekunder = (tidspunkt: Tidspunkt) => {
    return dayjs(tidspunkt).format('DD.MM.YYYY kl. HH:mm:ss');
};

export const formaterTidspunktKort = (tidspunkt: Tidspunkt) => {
    return dayjs(tidspunkt).format('DD.MM.YY HH:mm');
};

export const formaterDatotekst = (dato: Dato | Tidspunkt) => {
    return dayjs(dato).format('DD.MM.YYYY');
};

export const formaterSladdbarDatotekst = (dato: SladdbarVerdi<Nullable<Dato>>) =>
    formaterSladdbarVerdi(dato, formaterDatotekst);

export const formaterPeriode = ({ fraOgMed, tilOgMed }: Periode) => {
    return `${formaterDatotekst(fraOgMed)} - ${formaterDatotekst(tilOgMed)}`;
};

export const formaterPeriodeKort = ({ fraOgMed, tilOgMed }: Periode) => {
    const fraOgMedDate = dayjs(fraOgMed);
    const tilOgMedDate = dayjs(tilOgMed);

    const fraOgMedFormatert =
        fraOgMedDate.year() === tilOgMedDate.year()
            ? fraOgMedDate.format('DD.MM')
            : fraOgMedDate.format('DD.MM.YYYY');

    return `${fraOgMedFormatert} - ${tilOgMedDate.format('DD.MM.YYYY')}`;
};

export const ukedagFraDatoKort = (dato: Dato) => {
    return ukedagerKort[dayjs(dato).weekday()];
};

export const ukedagFraDato = (dato: Dato) => {
    return ukedager[dayjs(dato).weekday()];
};

export const ukenummerFraDatotekst = (dato: Dato) => {
    return dayjs(dato).week();
};

export const alderFraDato = (dato: Dato) => {
    return dayjs().diff(dato, 'years');
};

export const antallKalenderDagerUnnaDagensDato = (dato: Dato) => {
    return dayjs(dato).startOf('day').diff(dayjs().startOf('day'), 'day');
};

export const finn16årsdag = (fødselsdato: Dato): Dato => {
    return dateTilISOTekst(dayjs(fødselsdato).add(16, 'years'));
};

export const finn18årsdag = (fødselsdato: Dato): Dato => {
    return dateTilISOTekst(dayjs(fødselsdato).add(18, 'years'));
};

export const leggTilDager = (dato: Dato, dager: number): Dato => {
    return dateTilISOTekst(dayjs(dato).add(dager, 'day'));
};

export const nesteDag = (dato: Dato) => leggTilDager(dato, 1);

export const forrigeDag = (dato: Dato) => leggTilDager(dato, -1);

export const datoTilDatoInputText = (dato: DatoInput): string => {
    return dayjs(dato).format('DD.MM.YYYY');
};

export const datoMin = (...datoer: Array<DatoInput>): Dato => {
    return dateTilISOTekst(nonNullish(dayjs.min(datoer.map(dayjs))));
};

export const datoMax = (...datoer: Array<DatoInput>): Dato => {
    return dateTilISOTekst(nonNullish(dayjs.max(datoer.map(dayjs))));
};

export const tilDate = (date?: DatoInput): Date | undefined =>
    date ? (date instanceof Date ? date : new Date(date)) : undefined;

export const erHelg = (dato: Dato) => {
    const ukedag = dayjs(dato).weekday();
    return ukedag === 5 || ukedag === 6;
};

export const startOfDay = (dato: DatoInput) => dayjs(dato).startOf('day').toDate();

export const formaterMeldeperiode = (periode: Periode) => {
    return `${formaterPeriode(periode)} (uke ${ukenummerFraDatotekst(periode.fraOgMed)} og ${ukenummerFraDatotekst(periode.tilOgMed)})`;
};

export const formaterMeldeperiodeKort = (periode: Periode) => {
    return `${formaterPeriodeKort(periode)} (uke ${ukenummerFraDatotekst(periode.fraOgMed)} og ${ukenummerFraDatotekst(periode.tilOgMed)})`;
};

export const ukenummerFraPeriode = (periode: Periode) => {
    return `${ukenummerFraDatotekst(periode.fraOgMed)} - ${ukenummerFraDatotekst(periode.tilOgMed)}`;
};

export const årstallFraDato = (dato: DatoInput): number => {
    return dayjs(dato).year();
};
