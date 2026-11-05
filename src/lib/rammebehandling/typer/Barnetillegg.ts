import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { Dato } from '~/types/DatoTid';
import { SøknadId } from '~/lib/søknad/søknadTyper';

export type BarnetilleggPeriode = {
    antallBarn: number;
    periode: Periode;
};

// V1 er en periodisering av antall barn, uten informasjon om hvilke barn det gjelder.
// Finnes kun for eksisterende data, og kan ikke lagres fra frontend.
// V2 består av barna saksbehandler har valgt, og antall barn per periode utledes av backend fra disse.
export enum BarnetilleggVersjon {
    V1 = 'V1',
    V2 = 'V2',
}

export enum BarnetilleggBarnKilde {
    SØKNAD = 'SØKNAD',
    SAKSBEHANDLER = 'SAKSBEHANDLER',
}

export type BarnetilleggBarn = {
    fnr: SladdbarVerdi<Nullable<string>>;
    fornavn: SladdbarVerdi<Nullable<string>>;
    mellomnavn: SladdbarVerdi<Nullable<string>>;
    etternavn: SladdbarVerdi<Nullable<string>>;
    fødselsdato: SladdbarVerdi<Dato>;
    kilde: BarnetilleggBarnKilde;
    // Søknaden barnet er hentet fra. Er alltid satt når kilden er søknad, og ellers null.
    søknadId: Nullable<SøknadId>;
    // Null betyr hele innvilgelsesperioden, avkortet for perioden barnet har rett til barnetillegg.
    periode: Nullable<Periode>;
};

export type BarnMedBarnetillegg = BarnetilleggBarn & {
    // Periodene barnet faktisk gir barnetillegg for, utledet av backend.
    perioderMedBarnetillegg: Periode[];
};

type BarnetilleggBase = {
    // Antall barn per periode. Finnes for begge versjonene, og er utledet fra barna for V2.
    perioder: BarnetilleggPeriode[];
    begrunnelse: SladdbarVerdi<Nullable<string>>;
};

export type BarnetilleggV1 = BarnetilleggBase & {
    versjon: BarnetilleggVersjon.V1;
    barn: null;
};

export type BarnetilleggV2 = BarnetilleggBase & {
    versjon: BarnetilleggVersjon.V2;
    barn: BarnMedBarnetillegg[];
};

export type Barnetillegg = BarnetilleggV1 | BarnetilleggV2;

/** Sendes til backenden, og har derfor aldri sladdede verdier. */
export type OppdaterBarnetilleggBarnDTO = {
    fnr: Nullable<string>;
    fornavn: Nullable<string>;
    mellomnavn: Nullable<string>;
    etternavn: Nullable<string>;
    fødselsdato: Dato;
    kilde: BarnetilleggBarnKilde;
    søknadId: Nullable<SøknadId>;
    periode: Nullable<Periode>;
};

/** Sendes til backenden, og har derfor aldri sladdede verdier. Ingen barnetillegg sendes som en tom liste med barn. */
export type OppdaterBarnetilleggDTO = {
    barn: OppdaterBarnetilleggBarnDTO[];
    begrunnelse: Nullable<string>;
};
