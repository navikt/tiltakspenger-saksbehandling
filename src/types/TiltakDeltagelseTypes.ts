import { Periode } from './Periode';

enum Kilde {
    KOMET = 'Komet',
    ARENA = 'Arena',
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
    deltakelseProsentFraGjennomforing: boolean | null;
};

export type TiltaksdeltagelseMedPeriode = Tiltaksdeltagelse & {
    deltagelseFraOgMed: string;
    deltagelseTilOgMed: string;
};

export type TiltaksdeltakelsePeriode = {
    eksternDeltagelseId: string;
    periode: Periode;
};
