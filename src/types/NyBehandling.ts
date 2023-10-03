import Søknad from "./Søknad";

interface Vilkår {
    lovreferanse : string;
    tittel : string;
}

export interface Saksopplysning {
    fom: string;
    tom: string;
    vilkår: Vilkår;
    kilde: string;
    detaljer: string;
    typeSaksopplysning: string;
}

interface Vurdering {
    fom: string;
    tom: string;
    vilkår: Vilkår;
    kilde: string;
    detaljer: string;
    utfall: string;
}

export interface NyBehandling {
    behandlingId: string;
    fom: string;
    tom: string;
    søknad: Søknad;
    saksopplysninger: SaksopplysningInnDTO[];
    personopplysninger: Personopplysninger;
}

export interface Personopplysninger {
    ident: string;
    fornavn: string;
    etternavn: string;
    skjerming: boolean;
    strengtFortrolig: boolean;
    fortrolig: boolean;
}

export interface SaksopplysningInnDTO{
    fom: string;
    tom: string;
    kilde: string;
    detaljer: string;
    typeSaksopplysning: string;
    vilkårTittel: string;
    vilkårParagraf: string;
    vilkårLedd: string;
    fakta: string;
    utfall: string;
}
