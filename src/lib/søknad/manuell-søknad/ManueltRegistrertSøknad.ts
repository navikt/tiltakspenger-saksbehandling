import { Periode } from '~/types/Periode';
import { FraOgMedDatoSpm, JaNeiSpm, JaNeiSvar, PeriodeSpm } from '../søknadTyper';

export type ManueltRegistrertSøknad = {
    journalpostId: string;
    manueltSattSøknadsperiode?: Periode;
    manueltSattTiltak?: string;
    søknadstype?: SøknadstypeManueltRegistrertSøknad;
    overfortFraArena?: ManuellSøknadJaNeiSpm;
    behandlingsarsak?: SøknadBehandlingsårsakManueltRegistrertSøknad;
    svar: ManuellSøknadSvar;
    antallVedlegg: number;
};

export enum SøknadstypeManueltRegistrertSøknad {
    DIGITAL = 'DIGITAL',
    PAPIR_SKJEMA = 'PAPIR_SKJEMA',
    PAPIR_FRIHAND = 'PAPIR_FRIHAND',
    MODIA = 'MODIA',
    ANNET = 'ANNET',
}

export enum SøknadBehandlingsårsakManueltRegistrertSøknad {
    FORLENGELSE_FRA_ARENA = 'FORLENGELSE_FRA_ARENA',
    SOKNADSBEHANDLING_FRA_ARENA = 'SOKNADSBEHANDLING_FRA_ARENA',
    OVERLAPPENDE_TILTAK_I_ARENA = 'OVERLAPPENDE_TILTAK_I_ARENA',
    ANNET = 'ANNET',
}

export type ManuellSøknadTiltak = {
    eksternDeltakelseId: string;
    typeKode: string;
    typeNavn: string;
    deltakelseFraOgMed?: string;
    deltakelseTilOgMed?: string;
    visningsnavn: string;
};

export type ManuellSøknadJaNeiSpm = Partial<JaNeiSpm>;

export type ManuellSøknadFraOgMedDatoSpm = Partial<FraOgMedDatoSpm>;

export type ManuellSøknadPeriodeSpm = Partial<PeriodeSpm>;

export type ManuellSøknadSvar = {
    tiltak?: ManuellSøknadTiltak;
    harSøktPåTiltak?: ManuellSøknadJaNeiSpm;
    barnetilleggPdl: ManuellSøknadBarn[];
    barnetilleggManuelle: ManuellSøknadBarn[];
    barnetilleggKladd?: ManuellSøknadBarn;
    harSøktOmBarnetillegg?: ManuellSøknadJaNeiSpm;
    kvp: ManuellSøknadPeriodeSpm;
    intro: ManuellSøknadPeriodeSpm;
    institusjon: ManuellSøknadPeriodeSpm;
    mottarAndreUtbetalinger?: JaNeiSvar;
    sykepenger: ManuellSøknadPeriodeSpm;
    gjenlevendepensjon: ManuellSøknadPeriodeSpm;
    alderspensjon: ManuellSøknadFraOgMedDatoSpm;
    supplerendeStønadAlder: ManuellSøknadPeriodeSpm;
    supplerendeStønadFlyktning: ManuellSøknadPeriodeSpm;
    trygdOgPensjon: ManuellSøknadPeriodeSpm;
    etterlønn: ManuellSøknadJaNeiSpm;
    jobbsjansen: ManuellSøknadPeriodeSpm;
};

export type ManuellSøknadBarn = {
    index?: number;
    uuid: string;
    fornavn?: string;
    mellomnavn?: string;
    etternavn?: string;
    fødselsdato: string;
    fnr?: string;
    oppholdInnenforEøs?: ManuellSøknadJaNeiSpm;
    erSøktBarnetilleggFor?: ManuellSøknadJaNeiSpm;
    manueltRegistrertBarnAntallVedlegg?: number;
};
