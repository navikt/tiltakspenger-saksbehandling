import { AkselColor } from '@navikt/ds-react/types/theme';
import {
    BenkBehandling,
    BenkBehandlingMedTilgang,
    BenkBehandlingsstatus,
    BenkOppsummering,
    BenkSorteringRetning,
    BenkTilgangsvurdering,
    BenkVentestatus,
} from '../typer/felles';
import { BenkKlageStatus } from '../typer/klage';
import { BenkMeldekortType, benkMeldekortTyper } from '../typer/meldekort';
import { BenkTilbakekrevingKilde, BenkTilbakekrevingStatus } from '../typer/tilbakekreving';
import { isValueInRecord } from '~/utils/object';
import { Nullable } from '~/types/UtilTypes';

export const benkBehandlingsstatusTekst: Record<BenkBehandlingsstatus, string> = {
    [BenkBehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING]: 'Under automatisk behandling',
    [BenkBehandlingsstatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [BenkBehandlingsstatus.UNDER_BEHANDLING]: 'Under behandling',
    [BenkBehandlingsstatus.KLAR_TIL_BESLUTNING]: 'Klar til beslutning',
    [BenkBehandlingsstatus.UNDER_BESLUTNING]: 'Under beslutning',
} as const;

export const benkBehandlingsstatusColor: Record<BenkBehandlingsstatus, AkselColor> = {
    [BenkBehandlingsstatus.KLAR_TIL_BEHANDLING]: 'success',
    [BenkBehandlingsstatus.KLAR_TIL_BESLUTNING]: 'meta-lime',
    [BenkBehandlingsstatus.UNDER_BEHANDLING]: 'info',
    [BenkBehandlingsstatus.UNDER_BESLUTNING]: 'info',
    [BenkBehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING]: 'info',
} as const;

export const benkKlageStatusTekst: Record<BenkKlageStatus, string> = {
    [BenkKlageStatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [BenkKlageStatus.UNDER_BEHANDLING]: 'Under behandling',
    [BenkKlageStatus.KLAR_TIL_FERDIGSTILLING]: 'Klar til ferdigstilling',
} as const;

export const benkKlageStatusColor: Record<BenkKlageStatus, AkselColor> = {
    [BenkKlageStatus.KLAR_TIL_BEHANDLING]: 'success',
    [BenkKlageStatus.UNDER_BEHANDLING]: 'info',
    [BenkKlageStatus.KLAR_TIL_FERDIGSTILLING]: 'success',
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
    [benkMeldekortTyper.MELDEKORTBEHANDLING]: 'Meldekortbehandling',
    [benkMeldekortTyper.INNSENDT_MELDEKORT]: 'Innsendt meldekort',
    [benkMeldekortTyper.KORRIGERT_MELDEKORT]: 'Korrigert meldekort',
} as const;

export const benkTilbakekrevingKildeTekst: Record<BenkTilbakekrevingKilde, string> = {
    [BenkTilbakekrevingKilde.MELDEKORT]: 'Meldekort',
    [BenkTilbakekrevingKilde.RAMMEVEDTAK]: 'Rammevedtak',
} as const;

export const parseBenkSortering = <Kolonne extends string>(
    sortering: string | null,
    kolonner: Record<string, Kolonne>,
    fallbackKolonne: Kolonne,
): `${Kolonne},${BenkSorteringRetning}` => {
    const [kolonne, retning] = sortering?.split(',') ?? [];

    const gyldigKolonne = isValueInRecord(kolonne, kolonner) ? kolonne : fallbackKolonne;
    const gyldigRetning =
        retning === BenkSorteringRetning.DESC
            ? BenkSorteringRetning.DESC
            : BenkSorteringRetning.ASC;

    return `${gyldigKolonne},${gyldigRetning}`;
};

/**
 * Speiler `kanFortsetteBehandling` for rammebehandlinger med feltene en benk-rad har:
 * saksbehandler eier behandlingen, og den er ikke satt på vent.
 */
export const kanFortsetteBenkRad = (
    rad: {
        status: BenkBehandlingsstatus;
        saksbehandler: Nullable<string>;
        beslutter: Nullable<string>;
        ventestatus: BenkVentestatus;
    },
    navIdent: string,
): boolean => {
    if (rad.ventestatus.erSattPåVent) {
        return false;
    }

    switch (rad.status) {
        case BenkBehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING:
        case BenkBehandlingsstatus.UNDER_BEHANDLING:
            return rad.saksbehandler === navIdent;
        case BenkBehandlingsstatus.UNDER_BESLUTNING:
            return rad.beslutter === navIdent;
        default:
            return false;
    }
};

/**
 * Kort oppsummering av radene på siden.
 * Markørene settes bare på rader uten tilgang, så de vises som underkategorier med «herav».
 * En flat oppramsing ville sett ut som om tallene kom i tillegg til hverandre.
 * Har alle rader tilgang, har oppsummeringen ingenting å fortelle, og linja skal ikke vises.
 */
export const benkOppsummeringTekst = (oppsummering: BenkOppsummering): Nullable<string> => {
    if (oppsummering.antallUtenTilgang === 0) {
        return null;
    }

    const markører = [
        { antall: oppsummering.antallSkjermet, tekst: 'skjermet' },
        { antall: oppsummering.antallKode6, tekst: 'med strengt fortrolig adresse' },
        { antall: oppsummering.antallKode7, tekst: 'med fortrolig adresse' },
    ]
        .filter(({ antall }) => antall > 0)
        .map(({ antall, tekst }) => `${antall} ${tekst}`);

    const utenTilgang = `${oppsummering.antallUtenTilgang} uten tilgang`;

    return markører.length === 0 ? utenTilgang : `${utenTilgang} (herav ${markører.join(', ')})`;
};

export const benkBehandlingHarTilgang = (
    behandling: BenkBehandling,
): behandling is BenkBehandlingMedTilgang => {
    return behandling.tilgang.vurdering === BenkTilgangsvurdering.HAR_TILGANG;
};
