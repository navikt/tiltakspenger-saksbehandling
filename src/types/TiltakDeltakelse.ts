import { Periode } from '~/types/Periode';

export enum TiltaksdeltakelseKilde {
    KOMET = 'Komet',
    ARENA = 'Arena',
}

export type Tiltaksdeltakelse = {
    eksternDeltagelseId: string;
    gjennomføringId: string | null;
    typeNavn: string;
    typeKode: string;
    deltagelseFraOgMed: string | null;
    deltagelseTilOgMed: string | null;
    deltakelseStatus: string;
    deltakelseProsent: number | null;
    antallDagerPerUke: number | null;
    kilde: TiltaksdeltakelseKilde;
    gjennomforingsprosent: number | null;
};

export type TiltaksdeltakelseMedPeriode = Tiltaksdeltakelse & {
    deltagelseFraOgMed: string;
    deltagelseTilOgMed: string;
    periode: Periode;
};
