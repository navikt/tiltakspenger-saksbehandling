type Periode = {
    fom: string;
    tom: string;
};

type RegistrertTiltak = {
    periode: Periode;
    beskrivelse: string;
};

type Søknad = {
    id: string;
    søknadsdato: string;
    registrertTiltak: RegistrertTiltak;
    status: string;
    antallDager: number;
    prosent: number;
};

export default Søknad;
