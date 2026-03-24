import {
    BenkBehandlingsstatus,
    BenkBehandlingstype,
    BenkKolonne,
    BenkSortering,
    BenkSorteringRetning,
} from '~/types/Benk';
import { AkselColor } from '@navikt/ds-react/types/theme';
import { isValueInRecord } from '~/utils/object';

export const benkBehandlingstypeTekst: Record<BenkBehandlingstype, string> = {
    [BenkBehandlingstype.SØKNADSBEHANDLING]: 'Søknadsbehandling',
    [BenkBehandlingstype.REVURDERING]: 'Revurdering',
    [BenkBehandlingstype.MELDEKORTBEHANDLING]: 'Meldekortbehandling',
    [BenkBehandlingstype.INNSENDT_MELDEKORT]: 'Innsendt meldekort',
    [BenkBehandlingstype.KORRIGERT_MELDEKORT]: 'Korrigert meldekort',
    [BenkBehandlingstype.KLAGEBEHANDLING]: 'Klagebehandling',
    [BenkBehandlingstype.TILBAKEKREVING]: 'Tilbakekreving',
} as const;

export const benkBehandlingsstatusTekst: Record<BenkBehandlingsstatus, string> = {
    [BenkBehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING]: 'Under automatisk behandling',
    [BenkBehandlingsstatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [BenkBehandlingsstatus.UNDER_BEHANDLING]: 'Under behandling',
    [BenkBehandlingsstatus.KLAR_TIL_BESLUTNING]: 'Klar til beslutning',
    [BenkBehandlingsstatus.UNDER_BESLUTNING]: 'Under beslutning',
    [BenkBehandlingsstatus.KLAR_TIL_FERDIGSTILLING]: 'Klar til ferdigstilling',
} as const;

export const benkBehandlingsstatusColor: Record<BenkBehandlingsstatus, AkselColor> = {
    [BenkBehandlingsstatus.KLAR_TIL_BEHANDLING]: 'success',
    [BenkBehandlingsstatus.KLAR_TIL_BESLUTNING]: 'meta-lime',
    [BenkBehandlingsstatus.KLAR_TIL_FERDIGSTILLING]: 'success',
    [BenkBehandlingsstatus.UNDER_BEHANDLING]: 'info',
    [BenkBehandlingsstatus.UNDER_BESLUTNING]: 'info',
    [BenkBehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING]: 'info',
} as const;

const DEFAULT_KOLONNE = BenkKolonne.startet;
const DEFAULT_RETNING = BenkSorteringRetning.ASC;

export const BENK_SORTERING_DEFAULT: BenkSortering = `${DEFAULT_KOLONNE},${DEFAULT_RETNING}`;

export const parseBenkSortering = (
    sortering: string | null,
): [BenkKolonne, BenkSorteringRetning] => {
    if (!sortering) {
        return [DEFAULT_KOLONNE, DEFAULT_RETNING];
    }

    const [kolonne, retning] = sortering.split(',');

    return [
        isValueInRecord(kolonne, BenkKolonne) ? kolonne : DEFAULT_KOLONNE,
        isValueInRecord(retning, BenkSorteringRetning) ? retning : DEFAULT_RETNING,
    ];
};
