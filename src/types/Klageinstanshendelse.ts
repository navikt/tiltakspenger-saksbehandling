import { KlageId } from './Klage';
import { Nullable } from './UtilTypes';

export type KlageinstanshendelseId = `klagehendelse_${string}`;

export enum KlageHendelsestype {
    KLAGEBEHANDLING_AVSLUTTET = 'KLAGEBEHANDLING_AVSLUTTET',
    OMGJØRINGSKRAVBEHANDLING_AVSLUTTET = 'OMGJOERINGSKRAVBEHANDLING_AVSLUTTET',
    BEHANDLING_FEILREGISTRERT = 'BEHANDLING_FEILREGISTRERT',
}

export interface Klageinstanshendelse {
    klagehendelseId: KlageinstanshendelseId;
    klagebehandlingId: KlageId;
    opprettet: string;
    sistEndret: string;
    eksternKlagehendelseId: string;
    avsluttetTidspunkt: Nullable<string>;
    journalpostreferanser: string[];
    hendelsestype: KlageHendelsestype;
}

export interface KlagebehandlingAvsluttetHendelse extends Klageinstanshendelse {
    utfall: KlageHendelseKlagebehandlingAvsluttetUtfall;
}

export interface OmgjøringskravbehandlingAvsluttetHendelse extends Klageinstanshendelse {
    utfall: OmgjøringskravbehandlingAvsluttetUtfall;
}

export interface BehandlingFeilregistrertHendelse extends Klageinstanshendelse {
    feilregistrertTidspunkt: string;
    årsak: string;
    navIdent: string;
    type: KlageHendelseFeilregistrertType;
}

export enum KlageHendelseKlagebehandlingAvsluttetUtfall {
    TRUKKET = 'TRUKKET',
    RETUR = 'RETUR',
    OPPHEVET = 'OPPHEVET',
    MEDHOLD = 'MEDHOLD',
    DELVIS_MEDHOLD = 'DELVIS_MEDHOLD',
    STADFESTELSE = 'STADFESTELSE',
    UGUNST = 'UGUNST',
    AVVIST = 'AVVIST',
    HENLAGT = 'HENLAGT',
}

export enum OmgjøringskravbehandlingAvsluttetUtfall {
    MEDHOLD_ETTER_FVL_35 = 'MEDHOLD_ETTER_FVL_35',
}

export enum KlageHendelseFeilregistrertType {
    KLAGE = 'KLAGE',
    ANKE = 'ANKE',
    ANKE_I_TRYGDERETTEN = 'ANKE_I_TRYGDERETTEN',
    BEHANDLING_ETTER_TRYGDERETTEN_OPPHEVET = 'BEHANDLING_ETTER_TRYGDERETTEN_OPPHEVET',
    OMGJOERINGSKRAV = 'OMGJOERINGSKRAV',
}
