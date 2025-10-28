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
    // Fra-dato for alderspensjon
    alderspensjon: Nullable<string>;
    gjenlevendepensjon: Nullable<Periode>;
    supplerendeStønadAlder: Nullable<Periode>;
    supplerendeStønadFlyktning: Nullable<Periode>;
    trygdOgPensjon: Nullable<Periode>;
    jobbsjansen: Nullable<Periode>;
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
    fornavn: Nullable<string>;
    mellomnavn: Nullable<string>;
    etternavn: Nullable<string>;
    fødselsdato: string;
    kilde: SøknadBarnKilde;
}

export enum SøknadBarnKilde {
    PDL = 'PDL',
    Manuell = 'Manuell',
}
