import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { SladdbarVerdi } from '~/types/SladdetVerdi';

export type SøknadId = `soknad_${string}`;

export enum SøknadshendelseType {
    AVBRUTT = 'AVBRUTT',
    GJENÅPNET = 'GJENÅPNET',
}

export interface Søknadshendelse {
    type: SøknadshendelseType;
    tidspunkt: string;
    utførtAv: string;
    begrunnelse: SladdbarVerdi<Nullable<string>> | null;
}

interface SøknadBase {
    id: SøknadId;
    journalpostId: string;
    tiltak: Nullable<TiltaksdeltakelseFraSøknad>;
    manueltSattTiltak?: string;
    tiltaksdeltakelseperiodeDetErSøktOm: Nullable<Periode>;
    barnetillegg: SøknadBarn[];
    søknadstype: Søknadstype;
    behandlingsarsak: Nullable<Behandlingsårsak>;
    opprettet: string;
    mottatt: string;
    antallVedlegg: number;
    /** Historikken over avbrytelser og gjenåpninger av søknaden, i kronologisk rekkefølge. */
    avbrutt: Søknadshendelse[];
    kanInnvilges: boolean;
    svar: Spørsmålsbesvarelser;
}

export interface InnvilgbarSøknad extends SøknadBase {
    tiltak: TiltaksdeltakelseFraSøknad;
    kanInnvilges: true;
    tiltaksdeltakelseperiodeDetErSøktOm: Periode;
}

export interface IkkeInnvilgbarSøknad extends SøknadBase {
    kanInnvilges: false;
}

export type Søknad = InnvilgbarSøknad | IkkeInnvilgbarSøknad;

export interface SpørsmålsbesvarelserPengestøtter {
    alderspensjon: FraOgMedDatoSpm;
    gjenlevendepensjon: PeriodeSpm;
    supplerendeStønadAlder: PeriodeSpm;
    supplerendeStønadFlyktning: PeriodeSpm;
    trygdOgPensjon: PeriodeSpm;
    jobbsjansen: PeriodeSpm;
}

export interface Spørsmålsbesvarelser extends SpørsmålsbesvarelserPengestøtter {
    harSøktPåTiltak: JaNeiSpm | undefined;
    harSøktOmBarnetillegg: JaNeiSpm | undefined;
    kvp: PeriodeSpm;
    intro: PeriodeSpm;
    institusjon: PeriodeSpm;
    sykepenger: PeriodeSpm;
    etterlønn: JaNeiSpm;
}

export interface TiltaksdeltakelseFraSøknad {
    id: string;
    fraOgMed: Nullable<string>;
    tilOgMed: Nullable<string>;
    typeKode: string;
    typeNavn: string;
}

export interface SøknadBarn {
    /**
     * Om barnet oppholder seg i Norge eller et annet EØS-land.
     * Avledet fra `oppholdssted` når det er satt.
     */
    oppholderSegIEØSSpm: JaNeiSpm;
    /** Null for søknader fra før søknaden spurte om oppholdssted, og når spørsmålet ikke er besvart. */
    oppholdssted: Nullable<Oppholdssted>;
    fornavn: SladdbarVerdi<Nullable<string>>;
    mellomnavn: SladdbarVerdi<Nullable<string>>;
    etternavn: SladdbarVerdi<Nullable<string>>;
    fødselsdato: SladdbarVerdi<string>;
    kilde: SøknadBarnKilde;
    fnr: SladdbarVerdi<Nullable<string>>;
}

export enum SøknadBarnKilde {
    PDL = 'PDL',
    Manuell = 'Manuell',
}

export type Oppholdssted = 'NORGE' | 'ANNET_EØS_LAND' | 'IKKE_EØS_LAND';

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

export type Søknadstype = 'DIGITAL' | 'PAPIR_SKJEMA' | 'PAPIR_FRIHAND' | 'MODIA' | 'ANNET';

export type Behandlingsårsak =
    | 'FORLENGELSE_FRA_ARENA'
    | 'SOKNADSBEHANDLING_FRA_ARENA'
    | 'OVERLAPPENDE_TILTAK_I_ARENA'
    | 'ANNET';
