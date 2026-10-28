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

type TiltaksdeltakelseBase = {
    eksternDeltagelseId: string;
    gjennomføringId: string | null;
    typeNavn: string;
    typeKode: string;
    deltakelseStatus: TiltakDeltakerstatus;
    deltakelseProsent: number | null;
    antallDagerPerUke: number | null;
    kilde: TiltaksdeltakelseKilde;
    gjennomforingsprosent: number | null;
    internDeltakelseId: string;
};

/**
 * Backend avgjør om det kan innvilges for deltakelsen. Deltakelser som kan innvilges har alltid start- og sluttdato.
 */
export type InnvilgbarTiltaksdeltakelse = TiltaksdeltakelseBase & {
    kanInnvilges: true;
    deltagelseFraOgMed: string;
    deltagelseTilOgMed: string;
};

export type IkkeInnvilgbarTiltaksdeltakelse = TiltaksdeltakelseBase & {
    kanInnvilges: false;
    deltagelseFraOgMed: string | null;
    deltagelseTilOgMed: string | null;
};

export type Tiltaksdeltakelse = InnvilgbarTiltaksdeltakelse | IkkeInnvilgbarTiltaksdeltakelse;

/**
 * Tiltak som er registrert på bruker, og som kan frata rett til tiltakspenger (i første omgang lønnstilskudd).
 * Vises kun som informasjon til saksbehandler.
 */
export type TiltaksdeltakelseSomFratarRett = {
    eksternDeltakelseId: string;
    typeNavn: string;
    tiltakskodeFraKilden: string;
    deltakelseFraOgMed: string | null;
    deltakelseTilOgMed: string | null;
    deltakelseStatus: TiltakDeltakerstatus;
    deltakelseProsent: number | null;
    antallDagerPerUke: number | null;
    kilde: TiltaksdeltakelseKilde;
};

export type InnvilgbarTiltaksdeltakelseMedPeriode = InnvilgbarTiltaksdeltakelse & {
    periode: Periode;
};
