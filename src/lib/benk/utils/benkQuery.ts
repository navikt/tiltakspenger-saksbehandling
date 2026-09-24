import { Nullable } from '~/types/UtilTypes';
import { isValueInRecord } from '~/utils/object';
import { BenkBehandlingsstatus, BenkFellesFilter, BenkFilter } from '../typer/felles';
import { BenkSøknaderFilter } from '../typer/søknader';
import { BenkRevurderingerFilter } from '../typer/revurderinger';
import { BenkMeldekortFilter, benkMeldekortTyper } from '../typer/meldekort';
import { BenkKlageFilter, BenkKlageStatus } from '../typer/klage';
import {
    BenkTilbakekrevingFilter,
    BenkTilbakekrevingKilde,
    BenkTilbakekrevingStatus,
} from '../typer/tilbakekreving';
import { BenkMineFilter } from '../typer/mine';
import { BenkTab } from '../typer/tabs';
import { Søknadstype } from '~/lib/søknad/søknadTyper';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { KlagebehandlingResultat } from '~/lib/klage/typer/Klage';

/** Ukjent kilde: enten ParsedUrlQuery eller JSON fra cookie */
export type BenkFilterKilde = Record<string, unknown>;

export const benkStrengVerdi = (verdi: unknown): Nullable<string> =>
    typeof verdi === 'string' && verdi.length > 0 ? verdi : null;

const benkEnumVerdi = <T extends Record<string, string>>(
    verdi: unknown,
    gyldigeVerdier: T,
): Nullable<T[keyof T]> => {
    const streng = benkStrengVerdi(verdi);
    return streng !== null && isValueInRecord(streng, gyldigeVerdier) ? streng : null;
};

export const benkBoolskVerdi = (verdi: unknown): boolean =>
    typeof verdi === 'boolean' ? verdi : verdi === 'true';

const harFilterVerdi = (verdi: BenkFilter[string]): boolean =>
    verdi !== null && verdi !== false && verdi !== '';

/**
 * Sidetallet i pagineringen (0-basert). Ugyldige verdier tolkes som
 * første side (0).
 */
export const parseBenkSide = (verdi: unknown): number => {
    const streng = benkStrengVerdi(verdi);

    if (streng === null) {
        return 0;
    }

    const tall = Number(streng);
    return Number.isInteger(tall) && tall > 0 ? tall : 0;
};

const parseBenkFellesFilter = (kilde: BenkFilterKilde): BenkFellesFilter => ({
    saksbehandler: benkStrengVerdi(kilde.saksbehandler),
    skjulEgneTilBeslutning: benkBoolskVerdi(kilde.skjulEgneTilBeslutning),
    skjulPåVent: benkBoolskVerdi(kilde.skjulPåVent),
});

// Søknadstype er en string-union, ikke en enum, så vi trenger en record for validering
const søknadstyper: Record<Søknadstype, Søknadstype> = {
    DIGITAL: 'DIGITAL',
    PAPIR_SKJEMA: 'PAPIR_SKJEMA',
    PAPIR_FRIHAND: 'PAPIR_FRIHAND',
    MODIA: 'MODIA',
    ANNET: 'ANNET',
} as const;

export const parseBenkSøknaderFilter = (kilde: BenkFilterKilde): BenkSøknaderFilter => ({
    ...parseBenkFellesFilter(kilde),
    status: benkEnumVerdi(kilde.status, BenkBehandlingsstatus),
    resultat: benkEnumVerdi(kilde.resultat, SøknadsbehandlingResultat),
    søknadstype: benkEnumVerdi(kilde.søknadstype, søknadstyper),
});

export const parseBenkRevurderingerFilter = (kilde: BenkFilterKilde): BenkRevurderingerFilter => ({
    ...parseBenkFellesFilter(kilde),
    status: benkEnumVerdi(kilde.status, BenkBehandlingsstatus),
    resultat: benkEnumVerdi(kilde.resultat, RevurderingResultat),
});

export const parseBenkMeldekortFilter = (kilde: BenkFilterKilde): BenkMeldekortFilter => ({
    ...parseBenkFellesFilter(kilde),
    status: benkEnumVerdi(kilde.status, BenkBehandlingsstatus),
    type: benkEnumVerdi(kilde.type, benkMeldekortTyper),
});

export const parseBenkKlageFilter = (kilde: BenkFilterKilde): BenkKlageFilter => ({
    ...parseBenkFellesFilter(kilde),
    status: benkEnumVerdi(kilde.status, BenkKlageStatus),
    resultat: benkEnumVerdi(kilde.resultat, KlagebehandlingResultat),
});

export const parseBenkTilbakekrevingFilter = (
    kilde: BenkFilterKilde,
): BenkTilbakekrevingFilter => ({
    ...parseBenkFellesFilter(kilde),
    status: benkEnumVerdi(kilde.status, BenkTilbakekrevingStatus),
    kilde: benkEnumVerdi(kilde.kilde, BenkTilbakekrevingKilde),
    kunOverMinstebeløp: benkBoolskVerdi(kilde.kunOverMinstebeløp),
});

export const parseBenkMineFilter = (kilde: BenkFilterKilde): BenkMineFilter => ({
    seksjon: benkEnumVerdi(kilde.seksjon, BenkTab),
    skjulEgneTilBeslutning: benkBoolskVerdi(kilde.skjulEgneTilBeslutning),
    skjulPåVent: benkBoolskVerdi(kilde.skjulPåVent),
});

/**
 * Serialiserer et filter til query-parametere. Tomme verdier (null/false/'')
 * utelates, slik at URL-en kun inneholder aktive filtre.
 */
export const benkFilterTilQuery = (filter: BenkFilter): Record<string, string> =>
    Object.entries(filter).reduce<Record<string, string>>((query, [nøkkel, verdi]) => {
        if (!harFilterVerdi(verdi)) {
            return query;
        }
        query[nøkkel] = String(verdi);
        return query;
    }, {});

export const harBenkFilterVerdier = (filter: BenkFilter): boolean =>
    Object.values(filter).some(harFilterVerdi);
