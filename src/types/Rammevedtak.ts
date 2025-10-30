import { Nullable } from '~/types/UtilTypes';
import { Periode } from './Periode';
import { Barnetillegg } from './Barnetillegg';
import { BehandlingId, Rammebehandling } from './Behandling';

export type VedtakId = `vedtak_${string}`;

export enum Vedtakstype {
    INNVILGELSE = 'INNVILGELSE',
    AVSLAG = 'AVSLAG',
    STANS = 'STANS',
}

export type Rammevedtak = {
    id: VedtakId;
    behandlingId: BehandlingId;
    opprettet: string;
    vedtaksdato: Nullable<string>;
    vedtaksType: Vedtakstype;
    periode: Periode;
    // Perioden der vedtaket fortsatt er gjeldende for sakens nå-tilstand
    gjeldendePeriode: Periode;
    saksbehandler: string;
    beslutter: string;
    // TODO jah: Denne blir en periodisering. På samme måte som behandlingen. Brukes for å vises i tidslinja.
    antallDagerPerMeldeperiode: number;
    // Inkluderer perioder med 0 barn
    barnetillegg: Nullable<Barnetillegg>;
};

export type RammevedtakMedBehandling = Rammevedtak & { behandling: Rammebehandling };
