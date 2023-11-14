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
    søknadsdato: string;
    arrangoernavn: string;
    tiltakstype: string;
    deltakelseFom: string;
    deltakelseTom: string;
}

export interface Vilkårsvurdering {
    kilde: string;
    detaljer: string;
    periode: ÅpenPeriode;
    kreverManuellVurdering: boolean;
    utfall: Utfall;
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
