import { AkselColor } from '@navikt/ds-react/types/theme';
import { BenkV2Behandlingsstatus, BenkV2SorteringRetning, BenkV2Ventestatus } from './typer/felles';
import { BenkMeldekortType } from './typer/meldekort';
import { BenkTilbakekrevingKilde, BenkTilbakekrevingStatus } from './typer/tilbakekreving';
import { isValueInRecord } from '~/utils/object';
import { Nullable } from '~/types/UtilTypes';

export const benkV2BehandlingsstatusTekst: Record<BenkV2Behandlingsstatus, string> = {
    [BenkV2Behandlingsstatus.UNDER_AUTOMATISK_BEHANDLING]: 'Under automatisk behandling',
    [BenkV2Behandlingsstatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [BenkV2Behandlingsstatus.UNDER_BEHANDLING]: 'Under behandling',
    [BenkV2Behandlingsstatus.KLAR_TIL_BESLUTNING]: 'Klar til beslutning',
    [BenkV2Behandlingsstatus.UNDER_BESLUTNING]: 'Under beslutning',
    [BenkV2Behandlingsstatus.KLAR_TIL_FERDIGSTILLING]: 'Klar til ferdigstilling',
} as const;

export const benkV2BehandlingsstatusColor: Record<BenkV2Behandlingsstatus, AkselColor> = {
    [BenkV2Behandlingsstatus.KLAR_TIL_BEHANDLING]: 'success',
    [BenkV2Behandlingsstatus.KLAR_TIL_BESLUTNING]: 'meta-lime',
    [BenkV2Behandlingsstatus.KLAR_TIL_FERDIGSTILLING]: 'success',
    [BenkV2Behandlingsstatus.UNDER_BEHANDLING]: 'info',
    [BenkV2Behandlingsstatus.UNDER_BESLUTNING]: 'info',
    [BenkV2Behandlingsstatus.UNDER_AUTOMATISK_BEHANDLING]: 'info',
} as const;

export const benkTilbakekrevingStatusTekst: Record<BenkTilbakekrevingStatus, string> = {
    [BenkTilbakekrevingStatus.OPPRETTET]: 'Opprettet',
    [BenkTilbakekrevingStatus.TIL_FORHÅNDSVARSEL]: 'Til forhåndsvarsel',
    [BenkTilbakekrevingStatus.UNDER_FORHÅNDSVARSLING]: 'Under forhåndsvarsling',
    [BenkTilbakekrevingStatus.TIL_BEHANDLING]: 'Til behandling',
    [BenkTilbakekrevingStatus.UNDER_BEHANDLING]: 'Under behandling',
    [BenkTilbakekrevingStatus.TIL_GODKJENNING]: 'Til godkjenning',
    [BenkTilbakekrevingStatus.UNDER_GODKJENNING]: 'Under godkjenning',
} as const;

export const benkTilbakekrevingStatusColor: Record<BenkTilbakekrevingStatus, AkselColor> = {
    [BenkTilbakekrevingStatus.OPPRETTET]: 'info',
    [BenkTilbakekrevingStatus.TIL_FORHÅNDSVARSEL]: 'info',
    [BenkTilbakekrevingStatus.UNDER_FORHÅNDSVARSLING]: 'warning',
    [BenkTilbakekrevingStatus.TIL_BEHANDLING]: 'success',
    [BenkTilbakekrevingStatus.UNDER_BEHANDLING]: 'info',
    [BenkTilbakekrevingStatus.TIL_GODKJENNING]: 'meta-lime',
    [BenkTilbakekrevingStatus.UNDER_GODKJENNING]: 'info',
} as const;

export const benkMeldekortTypeTekst: Record<BenkMeldekortType, string> = {
    [BenkMeldekortType.MELDEKORTBEHANDLING]: 'Meldekortbehandling',
    [BenkMeldekortType.INNSENDT_MELDEKORT]: 'Innsendt meldekort',
    [BenkMeldekortType.KORRIGERT_MELDEKORT]: 'Korrigert meldekort',
} as const;

export const benkTilbakekrevingKildeTekst: Record<BenkTilbakekrevingKilde, string> = {
    [BenkTilbakekrevingKilde.MELDEKORT]: 'Meldekort',
    [BenkTilbakekrevingKilde.RAMMEVEDTAK]: 'Rammevedtak',
} as const;

export const parseSortering = <Kolonne extends string>(
    sortering: string | null,
    kolonner: Record<string, Kolonne>,
    fallbackKolonne: Kolonne,
): `${Kolonne},${BenkV2SorteringRetning}` => {
    const [kolonne, retning] = sortering?.split(',') ?? [];

    const gyldigKolonne = isValueInRecord(kolonne, kolonner) ? kolonne : fallbackKolonne;
    const gyldigRetning =
        retning === BenkV2SorteringRetning.DESC
            ? BenkV2SorteringRetning.DESC
            : BenkV2SorteringRetning.ASC;

    return `${gyldigKolonne},${gyldigRetning}`;
};

/**
 * Speiler `kanFortsetteBehandling` for rammebehandlinger med feltene en benk-rad har:
 * saksbehandler eier behandlingen, og den er ikke satt på vent.
 */
export const kanFortsetteBenkRad = (
    rad: {
        status: BenkV2Behandlingsstatus;
        saksbehandler: Nullable<string>;
        beslutter: Nullable<string>;
        ventestatus: BenkV2Ventestatus;
    },
    navIdent: string,
): boolean => {
    if (rad.ventestatus.erSattPåVent) {
        return false;
    }

    switch (rad.status) {
        case BenkV2Behandlingsstatus.UNDER_AUTOMATISK_BEHANDLING:
        case BenkV2Behandlingsstatus.UNDER_BEHANDLING:
            return rad.saksbehandler === navIdent;
        case BenkV2Behandlingsstatus.UNDER_BESLUTNING:
            return rad.beslutter === navIdent;
        default:
            return false;
    }
};
