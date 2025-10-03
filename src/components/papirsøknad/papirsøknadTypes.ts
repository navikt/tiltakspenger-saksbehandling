import { Periode } from '~/types/Periode';

export interface Søknad {
    journalpostId: string;
    kravDato: string;
    manueltSattSøknadsperiode: Periode;
    svar: Spørsmålsbesvarelser;
}

export interface Introduksjonsprogram {
    deltar: boolean;
    periode?: Periode;
}

export interface Kvalifiseringsprogram {
    deltar: boolean;
    periode?: Periode;
}

export interface Institusjonsopphold {
    borPåInstitusjon: boolean;
    periode?: Periode;
}

export interface Tiltak {
    aktivitetId: string;
    navn: string;
    periode?: Periode;
}

export interface Barnetillegg {
    manueltRegistrerteBarnSøktBarnetilleggFor: Barn[];
    eøsOppholdForBarnFraAPI: Record<string, boolean>;
    kladd: Barn;
}

export interface Pensjonsordning {
    mottar: boolean;
    periode: Periode;
}

export interface Etterlønn {
    mottar: boolean;
}

export interface Sykepenger {
    mottar: boolean;
    periode: Periode;
}

export interface Gjenlevendepensjon {
    mottar: boolean;
    periode: Periode;
}

export interface Alderspensjon {
    mottar: boolean;
    fraDato: string;
}

export interface Supplerendestønadover67 {
    mottar: boolean;
    periode: Periode;
}

export interface Supplerendestønadflyktninger {
    mottar: boolean;
    periode: Periode;
}

export interface Jobbsjansen {
    mottar: boolean;
    periode: Periode;
}

export interface Spørsmålsbesvarelser {
    kvalifiseringsprogram: Kvalifiseringsprogram;
    introduksjonsprogram: Introduksjonsprogram;
    institusjonsopphold: Institusjonsopphold;
    tiltak: Tiltak;
    harTiltak: boolean;
    mottarAndreUtbetalinger: boolean;
    sykepenger: Sykepenger;
    gjenlevendepensjon: Gjenlevendepensjon;
    alderspensjon: Alderspensjon;
    supplerendestønadover67: Supplerendestønadover67;
    supplerendestønadflyktninger: Supplerendestønadflyktninger;
    pensjonsordning: Pensjonsordning;
    etterlønn: Etterlønn;
    jobbsjansen: Jobbsjansen;
    barnetillegg: Barnetillegg;
    harSøktOmBarnetillegg: boolean;
}

export interface Barn {
    fornavn?: string;
    mellomnavn?: string;
    etternavn?: string;
    fødselsdato: string;
    bostedsland?: string;
    uuid: string;
    oppholdInnenforEøs?: boolean;
    index?: number;
}

const defaultValues = {
    svar: {
        tiltak: {},
        barnetillegg: {
            eøsOppholdForBarnFraAPI: {},
            manueltRegistrerteBarnSøktBarnetilleggFor: [],
        },
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
        harTiltak: false,
    },
    vedlegg: [],
};

export default defaultValues;
