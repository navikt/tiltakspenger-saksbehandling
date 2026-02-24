import {
    BehandlingFeilregistrertHendelse,
    KlagebehandlingAvsluttetHendelse,
    KlageHendelseKlagebehandlingAvsluttetUtfall,
    KlageHendelsestype,
    Klageinstanshendelse,
    OmgjøringskravbehandlingAvsluttetHendelse,
} from '~/types/Klageinstanshendelse';
import { Nullable } from '~/types/UtilTypes';

export const erKlageinstanshendelseAvsluttet = (
    h: Klageinstanshendelse,
): h is KlagebehandlingAvsluttetHendelse =>
    h.hendelsestype === KlageHendelsestype.KLAGEBEHANDLING_AVSLUTTET;

export const erKlageinstanshendelseOmgjøringskravbehandlingAvsluttet = (
    h: Klageinstanshendelse,
): h is OmgjøringskravbehandlingAvsluttetHendelse =>
    h.hendelsestype === KlageHendelsestype.OMGJØRINGSKRAVBEHANDLING_AVSLUTTET;

export const erKlageinstanshendelseFeilregistrert = (
    h: Klageinstanshendelse,
): h is BehandlingFeilregistrertHendelse =>
    h.hendelsestype === KlageHendelsestype.BEHANDLING_FEILREGISTRERT;

export const skalKunneOppretteNyRammebehandling = (hendelser: Nullable<Klageinstanshendelse[]>) => {
    const sisteHendelse = hendelser?.at(-1);
    if (!sisteHendelse) return false;

    return (
        erKlageinstanshendelseAvsluttet(sisteHendelse) &&
        (sisteHendelse.utfall === KlageHendelseKlagebehandlingAvsluttetUtfall.OPPHEVET ||
            sisteHendelse.utfall === KlageHendelseKlagebehandlingAvsluttetUtfall.MEDHOLD ||
            sisteHendelse.utfall === KlageHendelseKlagebehandlingAvsluttetUtfall.DELVIS_MEDHOLD ||
            sisteHendelse.utfall === KlageHendelseKlagebehandlingAvsluttetUtfall.UGUNST)
    );
};
