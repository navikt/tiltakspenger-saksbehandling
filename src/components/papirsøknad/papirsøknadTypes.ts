import { Periode } from '~/types/Periode';

export interface Papirsøknad {
    journalpostId: string;
    personopplysninger: PersonopplysningerSøker;
    kravDato: string;
    manueltSattSøknadsperiode: Periode;
    svar: Spørsmålsbesvarelser;
}

export interface PersonopplysningerSøker {
    ident: string;
    fornavn: string;
    etternavn: string;
}

export interface Tiltak {
    eksternDeltakelseId: string;
    arrangør?: string;
    typeKode: string;
    typeNavn: string;
    deltakelseFraOgMed?: string;
    deltakelseTilOgMed?: string;
    arrangørnavn?: string;
}

export interface JaNeiSpm {
    svar: boolean;
}

export interface FraOgMedDatoSpm {
    svar: boolean;
    fraDato: string;
}

export interface PeriodeSpm {
    svar: boolean;
    periode: Periode;
}

export interface Spørsmålsbesvarelser {
    tiltak: Tiltak;
    harTiltak: boolean;
    barnetilleggPdl: Barn[];
    barnetilleggManuelle: Barn[];
    barnetilleggKladd: Barn;
    harSøktOmBarnetillegg: boolean;
    kvalifiseringsprogram: PeriodeSpm;
    introduksjonsprogram: PeriodeSpm;
    institusjonsopphold: PeriodeSpm;
    mottarAndreUtbetalinger: boolean;
    sykepenger: PeriodeSpm;
    gjenlevendepensjon: PeriodeSpm;
    alderspensjon: FraOgMedDatoSpm;
    supplerendestønadover67: PeriodeSpm;
    supplerendestønadflyktninger: PeriodeSpm;
    pensjonsordning: PeriodeSpm;
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
    oppholdInnenforEøs?: boolean;
    manueltRegistrertBarnHarVedlegg?: boolean;
}

const defaultPapirsøknadFormValues = {
    svar: {
        harTiltak: undefined,
        tiltak: {},
        barnetilleggPdl: [],
        barnetilleggManuelle: [],
        institusjonsopphold: {},
        introduksjonsprogram: {},
        kvalifiseringsprogram: {},
        sykepenger: {},
        gjenlevendepensjon: {},
        alderspensjon: {},
        supplerendestønadover67: {},
        supplerendestønadflyktninger: {},
        pensjonsordning: {},
        etterlønn: {},
        jobbsjansen: {},
        mottarAndreUtbetalinger: undefined,
    },
};

export default defaultPapirsøknadFormValues;
