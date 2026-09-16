import { Periode } from '~/types/Periode';

export enum TiltaksdeltakelseKilde {
    KOMET = 'Komet',
    ARENA = 'Arena',
    TEAM_TILTAK = 'TeamTiltak',
}

export enum TiltakDeltakerstatus {
    VENTER_PÅ_OPPSTART = 'VenterPåOppstart',
    DELTAR = 'Deltar',
    HAR_SLUTTET = 'HarSluttet',
    AVBRUTT = 'Avbrutt',
    FULLFØRT = 'Fullført',
    IKKE_AKTUELL = 'IkkeAktuell',
    FEILREGISTRERT = 'Feilregistrert',
    PÅBEGYNT_REGISTRERING = 'PåbegyntRegistrering',
    SØKT_INN = 'SøktInn',
    VENTELISTE = 'Venteliste',
    VURDERES = 'Vurderes',
}

export const tiltakDeltakerstatusTekst: Record<TiltakDeltakerstatus, string> = {
    [TiltakDeltakerstatus.VENTER_PÅ_OPPSTART]: 'Venter på oppstart',
    [TiltakDeltakerstatus.DELTAR]: 'Deltar',
    [TiltakDeltakerstatus.HAR_SLUTTET]: 'Har sluttet',
    [TiltakDeltakerstatus.AVBRUTT]: 'Avbrutt',
    [TiltakDeltakerstatus.FULLFØRT]: 'Fullført',
    [TiltakDeltakerstatus.IKKE_AKTUELL]: 'Ikke aktuell',
    [TiltakDeltakerstatus.FEILREGISTRERT]: 'Feilregistrert',
    [TiltakDeltakerstatus.PÅBEGYNT_REGISTRERING]: 'Påbegynt registrering',
    [TiltakDeltakerstatus.SØKT_INN]: 'Søkt inn',
    [TiltakDeltakerstatus.VENTELISTE]: 'Venteliste',
    [TiltakDeltakerstatus.VURDERES]: 'Vurderes',
};

export type Tiltaksdeltakelse = {
    eksternDeltagelseId: string;
    gjennomføringId: string | null;
    typeNavn: string;
    typeKode: string;
    deltagelseFraOgMed: string | null;
    deltagelseTilOgMed: string | null;
    deltakelseStatus: TiltakDeltakerstatus;
    deltakelseProsent: number | null;
    antallDagerPerUke: number | null;
    kilde: TiltaksdeltakelseKilde;
    gjennomforingsprosent: number | null;
    internDeltakelseId: string;
};

export type TiltaksdeltakelseMedPeriode = Tiltaksdeltakelse & {
    deltagelseFraOgMed: string;
    deltagelseTilOgMed: string;
    periode: Periode;
};
