import { Nullable } from '~/types/UtilTypes';
import { isValueInRecord } from '~/utils/object';
import { BenkBehandlingsstatus } from '../typer/felles';
import { BenkTab } from '../typer/tabs';
import { BenkSøknaderFilter } from '../typer/søknader';
import { BenkRevurderingerFilter } from '../typer/revurderinger';
import { BenkMeldekortFilter, benkMeldekortTyper } from '../typer/meldekort';
import { BenkKlageFilter } from '../typer/klage';
import {
    BenkTilbakekrevingFilter,
    BenkTilbakekrevingKilde,
    BenkTilbakekrevingStatus,
} from '../typer/tilbakekreving';
import { Søknadstype } from '~/lib/søknad/søknadTyper';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { KlagebehandlingResultat } from '~/lib/klage/typer/Klage';

/**
 * Feltnavnene i filtrene er identiske med query-parameterne, slik at samme
 * parsing kan brukes både for URL-en og for lagrede filtre i cookie.
 */
export type BenkFilterMap = {
    [BenkTab.SØKNADER]: BenkSøknaderFilter;
    [BenkTab.REVURDERINGER]: BenkRevurderingerFilter;
    [BenkTab.MELDEKORT]: BenkMeldekortFilter;
    [BenkTab.KLAGE]: BenkKlageFilter;
    [BenkTab.TILBAKEKREVING]: BenkTilbakekrevingFilter;
};

/** Ukjent kilde: enten ParsedUrlQuery eller JSON fra cookie */
type BenkFilterKilde = Record<string, unknown>;

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

// Søknadstype er en string-union, ikke en enum, så vi trenger en record for validering
const søknadstyper: Record<Søknadstype, Søknadstype> = {
    DIGITAL: 'DIGITAL',
    PAPIR_SKJEMA: 'PAPIR_SKJEMA',
    PAPIR_FRIHAND: 'PAPIR_FRIHAND',
    MODIA: 'MODIA',
    ANNET: 'ANNET',
} as const;

export const parseBenkSøknaderFilter = (kilde: BenkFilterKilde): BenkSøknaderFilter => ({
    status: benkEnumVerdi(kilde.status, BenkBehandlingsstatus),
    søknadstype: benkEnumVerdi(kilde.søknadstype, søknadstyper),
    saksbehandler: benkStrengVerdi(kilde.saksbehandler),
    skjulPåVent: benkBoolskVerdi(kilde.skjulPåVent),
});

export const parseBenkRevurderingerFilter = (kilde: BenkFilterKilde): BenkRevurderingerFilter => ({
    status: benkEnumVerdi(kilde.status, BenkBehandlingsstatus),
    resultat: benkEnumVerdi(kilde.resultat, RevurderingResultat),
    saksbehandler: benkStrengVerdi(kilde.saksbehandler),
    skjulPåVent: benkBoolskVerdi(kilde.skjulPåVent),
});

export const parseBenkMeldekortFilter = (kilde: BenkFilterKilde): BenkMeldekortFilter => ({
    status: benkEnumVerdi(kilde.status, BenkBehandlingsstatus),
    type: benkEnumVerdi(kilde.type, benkMeldekortTyper),
    saksbehandler: benkStrengVerdi(kilde.saksbehandler),
    skjulPåVent: benkBoolskVerdi(kilde.skjulPåVent),
});

export const parseBenkKlageFilter = (kilde: BenkFilterKilde): BenkKlageFilter => ({
    status: benkEnumVerdi(kilde.status, BenkBehandlingsstatus),
    resultat: benkEnumVerdi(kilde.resultat, KlagebehandlingResultat),
    saksbehandler: benkStrengVerdi(kilde.saksbehandler),
    skjulPåVent: benkBoolskVerdi(kilde.skjulPåVent),
});

export const parseBenkTilbakekrevingFilter = (
    kilde: BenkFilterKilde,
): BenkTilbakekrevingFilter => ({
    status: benkEnumVerdi(kilde.status, BenkTilbakekrevingStatus),
    kilde: benkEnumVerdi(kilde.kilde, BenkTilbakekrevingKilde),
    saksbehandler: benkStrengVerdi(kilde.saksbehandler),
    kunOverMinstebeløp: benkBoolskVerdi(kilde.kunOverMinstebeløp),
    skjulPåVent: benkBoolskVerdi(kilde.skjulPåVent),
});

export const parseBenkFilterForTab = <T extends BenkTab>(
    tab: T,
    kilde: BenkFilterKilde,
): BenkFilterMap[T] => parserPerTab[tab](kilde) as BenkFilterMap[T];

const parserPerTab: {
    [T in BenkTab]: (kilde: BenkFilterKilde) => BenkFilterMap[T];
} = {
    [BenkTab.SØKNADER]: parseBenkSøknaderFilter,
    [BenkTab.REVURDERINGER]: parseBenkRevurderingerFilter,
    [BenkTab.MELDEKORT]: parseBenkMeldekortFilter,
    [BenkTab.KLAGE]: parseBenkKlageFilter,
    [BenkTab.TILBAKEKREVING]: parseBenkTilbakekrevingFilter,
} as const;

/**
 * Serialiserer et filter til query-parametere. Tomme verdier (null/false)
 * utelates, slik at URL-en kun inneholder aktive filtre.
 */
export const benkFilterTilQuery = (
    filter: Record<string, string | boolean | null>,
): Record<string, string> =>
    Object.entries(filter).reduce<Record<string, string>>((query, [nøkkel, verdi]) => {
        if (verdi === null || verdi === false || verdi === '') {
            return query;
        }
        query[nøkkel] = verdi === true ? 'true' : verdi;
        return query;
    }, {});

export const harBenkFilterVerdier = (filter: Record<string, string | boolean | null>): boolean =>
    Object.values(filter).some((verdi) => verdi !== null && verdi !== false && verdi !== '');
