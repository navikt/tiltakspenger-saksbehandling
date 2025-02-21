enum Kilde {
    KOMET = 'Komet',
    ARENA = 'Arena',
}

export enum DeltagelseStatus {
    HarSluttet = 'HarSluttet',
    VenterPåOppstart = 'VenterPåOppstart',
    Deltar = 'Deltar',
    Avbrutt = 'Avbrutt',
    Fullført = 'Fullført',
    IkkeAktuell = 'IkkeAktuell',
    Feilregistrert = 'Feilregistrert',
    PåbegyntRegistrering = 'PåbegyntRegistrering',
    SøktInn = 'SøktInn',
    Venteliste = 'Venteliste',
    Vurderes = 'Vurderes',
}

export type Tiltaksdeltagelse = {
    eksternDeltagelseId: string;
    gjennomføringId: string | null;
    typeNavn: string;
    typeKode: string;
    deltagelseFraOgMed: string | null;
    deltagelseTilOgMed: string | null;
    deltakelseStatus: string;
    deltakelseProsent: number | null;
    antallDagerPerUke: number | null;
    kilde: Kilde;
};
