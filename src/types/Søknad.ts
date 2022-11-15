import { Periode, ÅpenPeriode } from './Periode';
import Personalia from './Personalia';
import { Utfall } from './Utfall';
import { Ytelse } from './Ytelse';

export type RegistrertTiltak = {
    arrangør: string;
    dagerIUken: number;
    navn: string;
    periode: Periode;
    prosent: number;
    status: string;
};

interface Søknad {
    søknadId: string;
    søknadsdato: string;
    arrangoernavn: string;
    tiltakskode: string;
    startdato: string;
    sluttdato: string;
    antallDager: number;
}

export interface Vilkårsvurdering {
    ytelse: Ytelse;
    lovreferanse: string;
    utfall: Utfall;
    detaljer: string;
    periode: ÅpenPeriode;
    kilde: string;
    vilkår: string;
    tittel: string;
}

interface StatligeYtelser {
    tittel: string;
    lovreferanse: string;
    utfall: string;
    detaljer: string;
    vilkårsvurderinger: Vilkårsvurdering[];
}

export interface KommunaleYtelser {
    ytelse: string;
    lovreferanse: string;
    utfall: string;
    detaljer: String;
    introProgrammet: Vilkårsvurdering[];
    kvp: Vilkårsvurdering[];
}

export interface Pensjonsordninger {
    tittel: string;
    lovreferanse: string;
    utfall: string;
    detaljer: string;
    vilkårsvurderinger: Vilkårsvurdering[];
}

export interface Lønnsinntekt {
    tittel: string;
    lovreferanse: string;
    utfall: string;
    detaljer: string;
    vilkårsvurderinger: Vilkårsvurdering[];
}

export interface Institusjonsopphold {
    tittel: string;
    lovreferanse: string;
    utfall: string;
    detaljer: string;
    vilkårsvurderinger: Vilkårsvurdering[];
}

export interface SøknadResponse {
    søknad: Søknad;
    registrerteTiltak: RegistrertTiltak[];
    vurderingsperiode: {
        fra: string;
        til: string;
    };
    personopplysninger: Personalia;
    statligeYtelser: StatligeYtelser;
    kommunaleYtelser: KommunaleYtelser;
    pensjonsordninger: Pensjonsordninger;
    lønnsinntekt: Lønnsinntekt;
    institusjonsopphold: Institusjonsopphold;
    barnetillegg: Barnetillegg[];
}

export interface Barnetillegg {
    alder: number;
    bosatt: string;
    kilde: string;
    navn: string;
    fødselsdato: string;
    søktBarnetillegg: boolean;
    utfall: Utfall;
}

export default Søknad;
