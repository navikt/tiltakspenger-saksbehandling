import { Tag } from '@navikt/ds-react';
import {
    BehandlingFeilregistrertHendelse,
    KlagebehandlingAvsluttetHendelse,
    KlageHendelseFeilregistrertType,
    KlageHendelseKlagebehandlingAvsluttetUtfall,
    KlageHendelsestype,
    KlagehendelseUtfall,
    Klageinstanshendelse,
    OmgjøringskravbehandlingAvsluttetHendelse,
    OmgjøringskravbehandlingAvsluttetUtfall,
} from '~/lib/klage/typer/Klageinstanshendelse';
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

    const erHendelseAvsluttetOgTillaterNyBehandling =
        erKlageinstanshendelseAvsluttet(sisteHendelse) &&
        (sisteHendelse.utfall === KlageHendelseKlagebehandlingAvsluttetUtfall.OPPHEVET ||
            sisteHendelse.utfall === KlageHendelseKlagebehandlingAvsluttetUtfall.MEDHOLD ||
            sisteHendelse.utfall === KlageHendelseKlagebehandlingAvsluttetUtfall.DELVIS_MEDHOLD ||
            sisteHendelse.utfall === KlageHendelseKlagebehandlingAvsluttetUtfall.UGUNST);

    const erHendelseOmgjøringskravOgTillaterNyBehandling =
        erKlageinstanshendelseOmgjøringskravbehandlingAvsluttet(sisteHendelse) &&
        sisteHendelse.utfall === OmgjøringskravbehandlingAvsluttetUtfall.UGUNST;

    return (
        erHendelseAvsluttetOgTillaterNyBehandling || erHendelseOmgjøringskravOgTillaterNyBehandling
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

export const klagehendelseUtfallTilTag = (args: {
    utfall: KlagehendelseUtfall;
    size?: 'small' | 'medium';
    extraContent?: {
        before?: string;
        after?: string;
    };
}): React.ReactElement => {
    switch (args.utfall) {
        case KlageHendelseKlagebehandlingAvsluttetUtfall.TRUKKET: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {
                        klagehendelseUtfallTilTekst[
                            KlageHendelseKlagebehandlingAvsluttetUtfall.TRUKKET
                        ]
                    }
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case KlageHendelseKlagebehandlingAvsluttetUtfall.RETUR: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagehendelseUtfallTilTekst[KlageHendelseKlagebehandlingAvsluttetUtfall.RETUR]}
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case KlageHendelseKlagebehandlingAvsluttetUtfall.OPPHEVET: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {
                        klagehendelseUtfallTilTekst[
                            KlageHendelseKlagebehandlingAvsluttetUtfall.OPPHEVET
                        ]
                    }
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case KlageHendelseKlagebehandlingAvsluttetUtfall.MEDHOLD: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {
                        klagehendelseUtfallTilTekst[
                            KlageHendelseKlagebehandlingAvsluttetUtfall.MEDHOLD
                        ]
                    }
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case KlageHendelseKlagebehandlingAvsluttetUtfall.DELVIS_MEDHOLD: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {
                        klagehendelseUtfallTilTekst[
                            KlageHendelseKlagebehandlingAvsluttetUtfall.DELVIS_MEDHOLD
                        ]
                    }
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case KlageHendelseKlagebehandlingAvsluttetUtfall.STADFESTELSE: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {
                        klagehendelseUtfallTilTekst[
                            KlageHendelseKlagebehandlingAvsluttetUtfall.STADFESTELSE
                        ]
                    }
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case KlageHendelseKlagebehandlingAvsluttetUtfall.UGUNST: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {
                        klagehendelseUtfallTilTekst[
                            KlageHendelseKlagebehandlingAvsluttetUtfall.UGUNST
                        ]
                    }
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case KlageHendelseKlagebehandlingAvsluttetUtfall.AVVIST: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {
                        klagehendelseUtfallTilTekst[
                            KlageHendelseKlagebehandlingAvsluttetUtfall.AVVIST
                        ]
                    }
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case KlageHendelseKlagebehandlingAvsluttetUtfall.HENLAGT: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {
                        klagehendelseUtfallTilTekst[
                            KlageHendelseKlagebehandlingAvsluttetUtfall.HENLAGT
                        ]
                    }
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case OmgjøringskravbehandlingAvsluttetUtfall.MEDHOLD_ETTER_FVL_35: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {
                        klagehendelseUtfallTilTekst[
                            OmgjøringskravbehandlingAvsluttetUtfall.MEDHOLD_ETTER_FVL_35
                        ]
                    }
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case OmgjøringskravbehandlingAvsluttetUtfall.UGUNST: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagehendelseUtfallTilTekst[OmgjøringskravbehandlingAvsluttetUtfall.UGUNST]}
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case KlageHendelseFeilregistrertType.KLAGE: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagehendelseUtfallTilTekst[KlageHendelseFeilregistrertType.KLAGE]}
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case KlageHendelseFeilregistrertType.ANKE: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagehendelseUtfallTilTekst[KlageHendelseFeilregistrertType.ANKE]}
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case KlageHendelseFeilregistrertType.ANKE_I_TRYGDERETTEN: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {
                        klagehendelseUtfallTilTekst[
                            KlageHendelseFeilregistrertType.ANKE_I_TRYGDERETTEN
                        ]
                    }
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case KlageHendelseFeilregistrertType.BEHANDLING_ETTER_TRYGDERETTEN_OPPHEVET: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {
                        klagehendelseUtfallTilTekst[
                            KlageHendelseFeilregistrertType.BEHANDLING_ETTER_TRYGDERETTEN_OPPHEVET
                        ]
                    }
                    {args.extraContent?.after}
                </Tag>
            );
        }
        case KlageHendelseFeilregistrertType.OMGJOERINGSKRAV: {
            return (
                <Tag data-color="accent" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagehendelseUtfallTilTekst[KlageHendelseFeilregistrertType.OMGJOERINGSKRAV]}
                    {args.extraContent?.after}
                </Tag>
            );
        }
    }

    throw new Error('Manglende utfallshåndtering: ' + (args.utfall satisfies never));
};
