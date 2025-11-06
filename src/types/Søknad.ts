import { Avbrutt } from './Avbrutt';
import { Periode } from './Periode';

import { Nullable } from './UtilTypes';

export type SøknadId = `soknad_${string}`;

interface SøknadBase extends SøknadPengestøtter {
    id: SøknadId;
    journalpostId: string;
    tiltak: Nullable<TiltaksdeltagelseFraSøknad>;
    barnetillegg: SøknadBarn[];
    opprettet: string;
    tidsstempelHosOss: string;
    kvp: Nullable<Periode>;
    intro: Nullable<Periode>;
    institusjon: Nullable<Periode>;
    etterlønn: Nullable<boolean>;
    sykepenger: Nullable<Periode>;
    antallVedlegg: number;
    avbrutt: Nullable<Avbrutt>;
    kanInnvilges: boolean;
    svar: Spørsmålsbesvarelser;
}

export interface InnvilgbarSøknad extends SøknadBase {
    tiltak: TiltaksdeltagelseFraSøknad;
    kanInnvilges: true;
}

export interface IkkeInnvilgbarSøknad extends SøknadBase {
    kanInnvilges: false;
}

export type Søknad = InnvilgbarSøknad | IkkeInnvilgbarSøknad;

export interface SøknadPengestøtter {
    alderspensjon: FraOgMedDatoSpm;
    gjenlevendepensjon: PeriodeSpm;
    supplerendeStønadAlder: PeriodeSpm;
    supplerendeStønadFlyktning: PeriodeSpm;
    trygdOgPensjon: PeriodeSpm;
    jobbsjansen: PeriodeSpm;
}

export interface Spørsmålsbesvarelser extends SøknadPengestøtter {
    kvp: PeriodeSpm;
    intro: PeriodeSpm;
    institusjon: PeriodeSpm;
    sykepenger: PeriodeSpm;
    etterlønn: JaNeiSpm;
}

export interface TiltaksdeltagelseFraSøknad {
    id: string;
    fraOgMed: Nullable<string>;
    tilOgMed: Nullable<string>;
    typeKode: string;
    typeNavn: string;
}

export interface SøknadBarn {
    oppholderSegIEØS: Nullable<boolean>;
    oppholderSegIEØSSpm: JaNeiSpm;
    fornavn: Nullable<string>;
    mellomnavn: Nullable<string>;
    etternavn: Nullable<string>;
    fødselsdato: string;
    kilde: SøknadBarnKilde;
    fnr: Nullable<string>;
}

export enum SøknadBarnKilde {
    PDL = 'PDL',
    Manuell = 'Manuell',
}

export type JaNeiSvar = 'JA' | 'NEI' | 'IKKE_BESVART';

export interface JaNeiSpm {
    svar: JaNeiSvar;
}

export interface FraOgMedDatoSpm {
    svar: JaNeiSvar;
    fraOgMed: string;
}

export interface PeriodeSpm {
    svar: JaNeiSvar;
    periode: Periode;
}
