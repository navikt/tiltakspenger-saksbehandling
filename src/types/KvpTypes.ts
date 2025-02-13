import { Lovreferanse, ÅrsakTilEndring, Utfall } from './BehandlingTypes';
import { Periode } from './Periode';

export interface KvpVilkår {
    søknadSaksopplysning: KvpSaksopplysning;
    avklartSaksopplysning: KvpSaksopplysning;
    vilkårLovreferanse: Lovreferanse;
    utfallperiode: Periode;
    samletUtfall: Utfall;
}

interface KvpSaksopplysning {
    periodeMedDeltagelse: PeriodeMedDeltagelse;
    årsakTilEndring?: ÅrsakTilEndring;
    kilde: Kilde;
}

enum Kilde {
    SØKNAD = 'SØKNAD',
    SAKSBEHANDLER = 'SAKSBEHANDLER',
}

export interface PeriodeMedDeltagelse {
    periode: Periode;
    deltagelse: Deltagelse;
}

export enum Deltagelse {
    DELTAR = 'DELTAR',
    DELTAR_IKKE = 'DELTAR_IKKE',
}
