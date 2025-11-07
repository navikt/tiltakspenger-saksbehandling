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

export interface Spørsmålsbesvarelser {
    tiltak: Tiltak;
    harTiltak: boolean;
    barnetilleggPdl: Barn[];
    barnetilleggManuelle: Barn[];
    barnetilleggKladd: Barn;
    harSøktOmBarnetillegg: JaNeiSvar | undefined;
    kvp: PeriodeSpm;
    intro: PeriodeSpm;
    institusjon: PeriodeSpm;
    mottarAndreUtbetalinger: boolean | undefined;
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
    oppholdInnenforEøs?: JaNeiSpm;
    manueltRegistrertBarnHarVedlegg?: JaNeiSpm;
}

const defaultPapirsøknadFormValues = {
    journalpostId: '',
    kravDato: '',
    manueltSattSøknadsperiode: { fraOgMed: '', tilOgMed: '' },
    svar: {
        harTiltak: undefined,
        tiltak: undefined,
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
        harSøktOmBarnetillegg: undefined,
        mottarAndreUtbetalinger: undefined,
    },
};

export default defaultPapirsøknadFormValues;
