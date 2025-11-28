import { Nullable } from '~/types/UtilTypes';
import { Periode } from './Periode';
import { Barnetillegg } from './Barnetillegg';
import { BehandlingId, Rammebehandling, RammebehandlingResultat } from './Rammebehandling';

export type VedtakId = `vedtak_${string}`;

export type Rammevedtak = {
    id: VedtakId;
    behandlingId: BehandlingId;
    opprettet: string;
    vedtaksdato: Nullable<string>;
    resultat: RammebehandlingResultat;
    // Vedtaksperioden da den ble vedtatt. Er ikke sikkert den er gjeldende lenger, hvis den har blitt omgjort. Avslagsvedtak er aldri gjeldende.
    opprinneligVedtaksperiode: Periode;
    // Vil alltid være tom for avslag, stans og rene opphør. For innvilgelser (inkl. omgjøring) og forlengelser vil dette være perioden(e) som opprinnelig ble innvilget i vedtaket.
    opprinneligInnvilgetPerioder: Periode[];
    // Listen over perioder der vedtaket fortsatt er gjeldende for sakens nå-tilstand. Den var opprinnelig en hel periode, men kan ha blitt splittet av en eller flere omgjøringer. Vil alltid være tom for avslag siden de aldri er gjeldende.
    gjeldendeVedtaksperioder: Periode[];
    // Vil alltid være tom for avslag, stans og rene opphør. For innvilgelser (inkl. omgjøring) og forlengelser vil dette være perioden(e) som fortsatt er innvilget i vedtaket for sakens nå-tilstand.
    gjeldendeInnvilgetPerioder: Periode[];
    saksbehandler: string;
    beslutter: string;
    // TODO jah: Denne blir en periodisering. På samme måte som behandlingen. Brukes for å vises i tidslinja.
    antallDagerPerMeldeperiode: number;
    // Inkluderer perioder med 0 barn
    barnetillegg: Nullable<Barnetillegg>;
    erGjeldende: boolean;
    gyldigeKommandoer: GyldigeKommandoerMap;
};

type GyldigeKommandoerMap = {
    [Type in RammevedtakKommandoType]?: Extract<RammevedtakKommando, { type: Type }>;
};

export type RammevedtakMedBehandling = Rammevedtak & { behandling: Rammebehandling };

export enum RammevedtakKommandoType {
    OMGJØR = 'OMGJØR',
    OPPHØR = 'OPPHØR',
    STANS = 'STANS',
}

export type RammevedtakKommandoOmgjør = {
    type: RammevedtakKommandoType.OMGJØR;
    tvungenOmgjøringsperiode: Periode;
};

// Til fremtidig bruk
export type RammevedtakKommandoOpphør = {
    type: RammevedtakKommandoType.OPPHØR;
    innvilgelsesperioder: Periode[];
};

// Til fremtidig bruk
export type RammevedtakKommandoStans = {
    type: RammevedtakKommandoType.STANS;
    tidligsteFraOgMedDato: string;
    tvungenStansTilOgMedDato: string;
};

export type RammevedtakKommando =
    | RammevedtakKommandoOmgjør
    | RammevedtakKommandoOpphør
    | RammevedtakKommandoStans;
