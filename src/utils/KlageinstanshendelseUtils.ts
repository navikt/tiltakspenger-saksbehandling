import {
    BehandlingFeilregistrertHendelse,
    KlagebehandlingAvsluttetHendelse,
    KlageHendelseFeilregistrertType,
    KlageHendelseKlagebehandlingAvsluttetUtfall,
    KlageHendelsestype,
    Klageinstanshendelse,
    OmgjøringskravbehandlingAvsluttetHendelse,
    OmgjøringskravbehandlingAvsluttetUtfall,
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

export const klagehendelseTypeTilTekst: Record<KlageHendelsestype, string> = {
    [KlageHendelsestype.KLAGEBEHANDLING_AVSLUTTET]: 'Klagebehandling avsluttet',
    [KlageHendelsestype.OMGJØRINGSKRAVBEHANDLING_AVSLUTTET]: 'Omgjøringskravbehandling avsluttet',
    [KlageHendelsestype.BEHANDLING_FEILREGISTRERT]: 'Behandling feilregistrert',
};

export const klagehendelseUtfallTilTekst: Record<
    | KlageHendelseKlagebehandlingAvsluttetUtfall
    | OmgjøringskravbehandlingAvsluttetUtfall
    | KlageHendelseFeilregistrertType,
    string
> = {
    [KlageHendelseKlagebehandlingAvsluttetUtfall.TRUKKET]: 'Trukket',
    [KlageHendelseKlagebehandlingAvsluttetUtfall.RETUR]: 'Retur',
    [KlageHendelseKlagebehandlingAvsluttetUtfall.OPPHEVET]: 'Opphevet',
    [KlageHendelseKlagebehandlingAvsluttetUtfall.MEDHOLD]: 'Medhold',
    [KlageHendelseKlagebehandlingAvsluttetUtfall.DELVIS_MEDHOLD]: 'Delvis medhold',
    [KlageHendelseKlagebehandlingAvsluttetUtfall.STADFESTELSE]: 'Stadfestelse',
    [KlageHendelseKlagebehandlingAvsluttetUtfall.UGUNST]: 'Ugunst',
    [KlageHendelseKlagebehandlingAvsluttetUtfall.AVVIST]: 'Avvist',
    [KlageHendelseKlagebehandlingAvsluttetUtfall.HENLAGT]: 'Henlagt',
    [OmgjøringskravbehandlingAvsluttetUtfall.MEDHOLD_ETTER_FVL_35]: 'Medhold etter fvl § 35',
    [KlageHendelseFeilregistrertType.KLAGE]: 'Klage',
    [KlageHendelseFeilregistrertType.ANKE]: 'Anke',
    [KlageHendelseFeilregistrertType.ANKE_I_TRYGDERETTEN]: 'Anke i trygderetten',
    [KlageHendelseFeilregistrertType.BEHANDLING_ETTER_TRYGDERETTEN_OPPHEVET]:
        'Behandling etter trygderetten opphevet',
    [KlageHendelseFeilregistrertType.OMGJOERINGSKRAV]: 'Omgjøringskrav',
};
