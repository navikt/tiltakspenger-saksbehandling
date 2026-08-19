import { Periode } from '~/types/Periode';

export interface ManueltRegistrertSøknad {
    journalpostId: string;
    manueltSattSøknadsperiode: Periode;
    manueltSattTiltak?: string;
    søknadstype?: SøknadstypeManueltRegistrertSøknad;
    overfortFraArena?: JaNeiSpm;
    behandlingsarsak?: SøknadBehandlingsårsakManueltRegistrertSøknad;
    svar: Spørsmålsbesvarelser;
    antallVedlegg: number;
}

export type SøknadstypeManueltRegistrertSøknad =
    | 'DIGITAL'
    | 'PAPIR_SKJEMA'
    | 'PAPIR_FRIHAND'
    | 'MODIA'
    | 'ANNET';

export type SøknadBehandlingsårsakManueltRegistrertSøknad =
    | 'FORLENGELSE_FRA_ARENA'
    | 'SOKNADSBEHANDLING_FRA_ARENA'
    | 'OVERLAPPENDE_TILTAK_I_ARENA'
    | 'ANNET';

export interface Tiltak {
    eksternDeltakelseId: string;
    typeKode: string;
    typeNavn: string;
    deltakelseFraOgMed?: string;
    deltakelseTilOgMed?: string;
    visningsnavn: string;
}

export type JaNeiSvar = 'JA' | 'NEI' | 'IKKE_BESVART';

export interface JaNeiSpm {
    svar?: JaNeiSvar;
}

export interface FraOgMedDatoSpm {
    svar?: JaNeiSvar;
    fraOgMed?: string;
}

export interface PeriodeSpm {
    svar?: JaNeiSvar;
    fraOgMed?: string;
    tilOgMed?: string;
}

export interface Spørsmålsbesvarelser {
    tiltak?: Tiltak;
    harSøktPåTiltak?: JaNeiSpm;
    barnetilleggPdl: Barn[];
    barnetilleggManuelle: Barn[];
    barnetilleggKladd?: Barn;
    harSøktOmBarnetillegg?: JaNeiSpm;
    kvp: PeriodeSpm;
    intro: PeriodeSpm;
    institusjon: PeriodeSpm;
    mottarAndreUtbetalinger?: JaNeiSvar;
    sykepenger: PeriodeSpm;
    gjenlevendepensjon: PeriodeSpm;
    alderspensjon: FraOgMedDatoSpm;
    supplerendeStønadAlder: PeriodeSpm;
    supplerendeStønadFlyktning: PeriodeSpm;
    trygdOgPensjon: PeriodeSpm;
    etterlønn: JaNeiSpm;
    jobbsjansen: PeriodeSpm;
}

export interface Barn {
    index?: number;
    uuid: string;
    fornavn?: string;
    mellomnavn?: string;
    etternavn?: string;
    fødselsdato: string;
    fnr?: string;
    oppholdInnenforEøs?: JaNeiSpm;
    erSøktBarnetilleggFor?: JaNeiSpm;
    manueltRegistrertBarnAntallVedlegg?: number;
}

export const defaultRegistrerSøknadManueltFormValues: ManueltRegistrertSøknad = {
    journalpostId: '',
    manueltSattSøknadsperiode: { fraOgMed: '', tilOgMed: '' },
    antallVedlegg: 0,
    søknadstype: undefined,
    overfortFraArena: undefined,
    svar: {
        harSøktPåTiltak: undefined,
        tiltak: undefined,
        barnetilleggPdl: [],
        barnetilleggManuelle: [],
        institusjon: {},
        intro: {},
        kvp: {},
        sykepenger: {},
        gjenlevendepensjon: {},
        alderspensjon: {},
        supplerendeStønadAlder: {},
        supplerendeStønadFlyktning: {},
        trygdOgPensjon: {},
        etterlønn: {},
        jobbsjansen: {},
        harSøktOmBarnetillegg: undefined,
        mottarAndreUtbetalinger: undefined,
        barnetilleggKladd: undefined,
    },
};
