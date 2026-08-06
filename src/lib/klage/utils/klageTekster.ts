import {
    KlagebehandlingResultat,
    KlagebehandlingStatus,
    OmgjøringÅrsak,
} from '~/lib/klage/typer/Klage';

export const klagebehandlingStatusTekst: Record<KlagebehandlingStatus, string> = {
    [KlagebehandlingStatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [KlagebehandlingStatus.UNDER_BEHANDLING]: 'Under behandling',
    [KlagebehandlingStatus.AVBRUTT]: 'Avbrutt',
    [KlagebehandlingStatus.VEDTATT]: 'Vedtatt',
    [KlagebehandlingStatus.OPPRETTHOLDT]: 'Opprettholdt',
    [KlagebehandlingStatus.OVERSENDT]: 'Oversendt',
    [KlagebehandlingStatus.FERDIGSTILT]: 'Ferdigstilt',
    [KlagebehandlingStatus.MOTTATT_FRA_KLAGEINSTANS]: 'Mottatt fra klageinstans',
    [KlagebehandlingStatus.OMGJØRING_ETTER_KLAGEINSTANS]: 'Omgjøring etter klageinstans',
} as const;

export const klagebehandlingResultatTekst: Record<KlagebehandlingResultat, string> = {
    [KlagebehandlingResultat.AVVIST]: 'Avvist',
    [KlagebehandlingResultat.OMGJØR]: 'Omgjør',
    [KlagebehandlingResultat.OPPRETTHOLDT]: 'Opprettholdt',
} as const;

export const omgjøringsårsakTekst: Record<OmgjøringÅrsak, string> = {
    [OmgjøringÅrsak.ANNET]: 'Annet',
    [OmgjøringÅrsak.FEIL_ELLER_ENDRET_FAKTA]: 'Feil eller endret fakta',
    [OmgjøringÅrsak.FEIL_LOVANVENDELSE]: 'Feil lovanvendelse',
    [OmgjøringÅrsak.FEIL_REGELVERKSFORSTAAELSE]: 'Feil regelverksforståelse',
    [OmgjøringÅrsak.PROSESSUELL_FEIL]: 'Prosessuelt feil',
} as const;
