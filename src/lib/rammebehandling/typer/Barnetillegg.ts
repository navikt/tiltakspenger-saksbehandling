import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { Dato } from '~/types/DatoTid';
import { SøknadBarn, SøknadId } from '~/lib/søknad/søknadTyper';

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
    // Periodene saksbehandler har valgt, sortert og uten overlapp.
    // Null betyr hele innvilgelsesperioden, avkortet for perioden barnet har rett til barnetillegg.
    perioder: Nullable<Periode[]>;
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
    // Null betyr hele innvilgelsesperioden. Er periodene valgt, må det være minst én.
    perioder: Nullable<Periode[]>;
};

/** Sendes til backenden, og har derfor aldri sladdede verdier. Ingen barnetillegg sendes som en tom liste med barn. */
export type OppdaterBarnetilleggDTO = {
    barn: OppdaterBarnetilleggBarnDTO[];
    begrunnelse: Nullable<string>;
};

/**
 * Et barn saksbehandler kan velge å gi barnetillegg for, utledet av backend fra lagret barnetillegg, søknadene og gjeldende vedtak.
 * Har ingen valgte perioder, så et valgt barn får barnetillegg for hele innvilgelsesperioden.
 */
export type BarnetilleggKandidatDTO = Omit<BarnetilleggBarn, 'perioder'> & {
    // Opplysningene om barnet fra den nyeste søknaden barnet finnes i, eller null om barnet ikke finnes i en søknad.
    søknadsopplysninger: Nullable<Pick<SøknadBarn, 'oppholderSegIEØSSpm' | 'oppholdssted'>>;
    // Barnet er bare aktuelt når det innvilges for en av disse tiltaksdeltakelsene.
    // Null når barnet er aktuelt uansett hvilke tiltaksdeltakelser det innvilges for.
    internDeltakelseIder: Nullable<string[]>;
    // Barnet gir barnetillegg i et gjeldende vedtak.
    fraGjeldendeVedtak: boolean;
};
