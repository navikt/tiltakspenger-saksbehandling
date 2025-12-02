import { Periode } from '~/types/Periode';

export interface Papirsøknad {
    journalpostId: string;
    personopplysninger: PersonopplysningerSøker;
    manueltSattSøknadsperiode: Periode;
    manueltSattTiltak?: string;
    svar: Spørsmålsbesvarelser;
    antallVedlegg: number;
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
    fraOgMed?: string;
    tilOgMed?: string;
}

export interface Spørsmålsbesvarelser {
    tiltak: Tiltak;
    harSøktPåTiltak: JaNeiSpm | undefined;
    barnetilleggPdl: Barn[];
    barnetilleggManuelle: Barn[];
    barnetilleggKladd: Barn;
    harSøktOmBarnetillegg: JaNeiSpm | undefined;
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
    fnr?: string;
    oppholdInnenforEøs?: JaNeiSpm;
    erSøktBarnetilleggFor: JaNeiSpm | undefined;
    manueltRegistrertBarnAntallVedlegg?: number;
}

const defaultPapirsøknadFormValues = {
    journalpostId: '',
    manueltSattSøknadsperiode: { fraOgMed: '', tilOgMed: '' },
    antallVedlegg: 0,
    svar: {
        harSøktPåTiltak: undefined,
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
