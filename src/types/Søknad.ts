type Periode = {
    fom: string;
    tom: string;
};

type RegistrertTiltak = {
    periode: Periode;
    beskrivelse: string;
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
}

export default Søknad;
