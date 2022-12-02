import { Periode, ÅpenPeriode } from './Periode';
import { Utfall } from './Utfall';
import Tiltaksstatus from './Tiltaksstatus';

export type RegistrertTiltak = {
    arrangør: string;
    dagerIUken: number;
    navn: string;
    periode: Periode;
    prosent: number;
    status: Tiltaksstatus;
};

interface Søknad {
    id: string;
    søknadId: string;
    søknadsdato: string;
    arrangoernavn: string;
    tiltakskode: string;
    startdato: string;
    sluttdato: string;
    antallDager: number;
    fritekst: string;
    beskrivelse: string;
    vedlegg: Vedlegg[];
}

export interface Vilkårsvurdering {
    kilde: string;
    detaljer: string;
    periode: ÅpenPeriode;
    kreverManuellVurdering: boolean;
    utfall: Utfall;
}

export interface StatligeYtelser {
    samletUtfall: Utfall;
    aap: Vilkårsvurdering[];
    dagpenger: Vilkårsvurdering[];
}

export interface KommunaleYtelser {
    samletUtfall: Utfall;
    introProgrammet: Vilkårsvurdering[];
    kvp: Vilkårsvurdering[];
}

export interface TiltakspengerYtelser {
    samletUtfall: Utfall;
    perioder: Vilkårsvurdering[];
}

export interface Pensjonsordninger {
    samletUtfall: Utfall;
    perioder: Vilkårsvurdering[];
}

export interface Lønnsinntekt {
    samletUtfall: Utfall;
    perioder: Vilkårsvurdering[];
}

export interface Institusjonsopphold {
    samletUtfall: Utfall;
    perioder: Vilkårsvurdering[];
}

export interface Behandling {
    søknad: Søknad;
    registrerteTiltak: RegistrertTiltak[];
    vurderingsperiode: {
        fra: string;
        til: string;
    };
    tiltakspengerYtelser: TiltakspengerYtelser;
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

export interface Vedlegg {
    dokumentInfoId: string;
    filnavn: string;
    journalpostId: string;
}

export default Søknad;
