import { Periode, ÅpenPeriode } from './Periode';
import Personalia from './Personalia';

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
    ytelse: string;
    lovreferanse: string;
    utfall: string;
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
}

export default Søknad;
