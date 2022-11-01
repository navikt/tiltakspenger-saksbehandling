import { Periode } from './Periode';
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

export interface SøknadResponse {
    søknad: Søknad;
    registrerteTiltak: RegistrertTiltak[];
    vurderingsperiode: {
        fra: string;
        til: string;
    };
    personopplysninger: Personalia;
}

export default Søknad;
