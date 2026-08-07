import { Nullable } from '~/types/UtilTypes';
import { isValueInRecord } from '~/utils/object';
import { BenkV2Behandlingsstatus } from './typer/felles';
import { BenkV2Tab } from './typer/tabs';
import { BenkSøknaderFilter } from './typer/søknader';
import { BenkRevurderingerFilter } from './typer/revurderinger';
import { BenkMeldekortFilter, benkMeldekortTyper } from './typer/meldekort';
import { BenkKlageFilter } from './typer/klage';
import {
    BenkTilbakekrevingFilter,
    BenkTilbakekrevingKilde,
    BenkTilbakekrevingStatus,
} from './typer/tilbakekreving';
import { Søknadstype } from '~/lib/søknad/søknadTyper';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { KlagebehandlingResultat } from '~/lib/klage/typer/Klage';

/**
 * Feltnavnene i filtrene er identiske med query-parameterne, slik at samme
 * parsing kan brukes både for URL-en og for lagrede filtre i cookie.
 */
export type BenkV2FilterMap = {
    [BenkV2Tab.SØKNADER]: BenkSøknaderFilter;
    [BenkV2Tab.REVURDERINGER]: BenkRevurderingerFilter;
    [BenkV2Tab.MELDEKORT]: BenkMeldekortFilter;
    [BenkV2Tab.KLAGE]: BenkKlageFilter;
    [BenkV2Tab.TILBAKEKREVING]: BenkTilbakekrevingFilter;
};

/** Ukjent kilde: enten ParsedUrlQuery eller JSON fra cookie */
export type FilterKilde = Record<string, unknown>;

export const strengVerdi = (verdi: unknown): Nullable<string> =>
    typeof verdi === 'string' && verdi.length > 0 ? verdi : null;

export const enumVerdi = <T extends Record<string, string>>(
    verdi: unknown,
    gyldigeVerdier: T,
): Nullable<T[keyof T]> => {
    const streng = strengVerdi(verdi);
    return streng !== null && isValueInRecord(streng, gyldigeVerdier) ? streng : null;
};

export const boolskVerdi = (verdi: unknown): boolean =>
    typeof verdi === 'boolean' ? verdi : verdi === 'true';

// Søknadstype er en string-union, ikke en enum, så vi trenger en record for validering
const søknadstyper: Record<Søknadstype, Søknadstype> = {
    DIGITAL: 'DIGITAL',
    PAPIR_SKJEMA: 'PAPIR_SKJEMA',
    PAPIR_FRIHAND: 'PAPIR_FRIHAND',
    MODIA: 'MODIA',
    ANNET: 'ANNET',
} as const;

export const parseSøknaderFilter = (kilde: FilterKilde): BenkSøknaderFilter => ({
    status: enumVerdi(kilde.status, BenkV2Behandlingsstatus),
    søknadstype: enumVerdi(kilde.søknadstype, søknadstyper),
    saksbehandler: strengVerdi(kilde.saksbehandler),
    skjulPåVent: boolskVerdi(kilde.skjulPåVent),
});

export const parseRevurderingerFilter = (kilde: FilterKilde): BenkRevurderingerFilter => ({
    status: enumVerdi(kilde.status, BenkV2Behandlingsstatus),
    resultat: enumVerdi(kilde.resultat, RevurderingResultat),
    saksbehandler: strengVerdi(kilde.saksbehandler),
    skjulPåVent: boolskVerdi(kilde.skjulPåVent),
});

export const parseMeldekortFilter = (kilde: FilterKilde): BenkMeldekortFilter => ({
    status: enumVerdi(kilde.status, BenkV2Behandlingsstatus),
    type: enumVerdi(kilde.type, benkMeldekortTyper),
    saksbehandler: strengVerdi(kilde.saksbehandler),
    skjulPåVent: boolskVerdi(kilde.skjulPåVent),
});

export const parseKlageFilter = (kilde: FilterKilde): BenkKlageFilter => ({
    status: enumVerdi(kilde.status, BenkV2Behandlingsstatus),
    resultat: enumVerdi(kilde.resultat, KlagebehandlingResultat),
    saksbehandler: strengVerdi(kilde.saksbehandler),
    skjulPåVent: boolskVerdi(kilde.skjulPåVent),
});

export const parseTilbakekrevingFilter = (kilde: FilterKilde): BenkTilbakekrevingFilter => ({
    status: enumVerdi(kilde.status, BenkTilbakekrevingStatus),
    kilde: enumVerdi(kilde.kilde, BenkTilbakekrevingKilde),
    saksbehandler: strengVerdi(kilde.saksbehandler),
    kunOverMinstebeløp: boolskVerdi(kilde.kunOverMinstebeløp),
    skjulPåVent: boolskVerdi(kilde.skjulPåVent),
});

export const parseFilterForTab = <T extends BenkV2Tab>(
    tab: T,
    kilde: FilterKilde,
): BenkV2FilterMap[T] => parserPerTab[tab](kilde) as BenkV2FilterMap[T];

const parserPerTab: {
    [T in BenkV2Tab]: (kilde: FilterKilde) => BenkV2FilterMap[T];
} = {
    [BenkV2Tab.SØKNADER]: parseSøknaderFilter,
    [BenkV2Tab.REVURDERINGER]: parseRevurderingerFilter,
    [BenkV2Tab.MELDEKORT]: parseMeldekortFilter,
    [BenkV2Tab.KLAGE]: parseKlageFilter,
    [BenkV2Tab.TILBAKEKREVING]: parseTilbakekrevingFilter,
} as const;

/**
 * Serialiserer et filter til query-parametere. Tomme verdier (null/false)
 * utelates, slik at URL-en kun inneholder aktive filtre.
 */
export const filterTilQuery = (
    filter: Record<string, string | boolean | null>,
): Record<string, string> =>
    Object.entries(filter).reduce<Record<string, string>>((query, [nøkkel, verdi]) => {
        if (verdi === null || verdi === false || verdi === '') {
            return query;
        }
        query[nøkkel] = verdi === true ? 'true' : verdi;
        return query;
    }, {});

export const harFilterVerdier = (filter: Record<string, string | boolean | null>): boolean =>
    Object.values(filter).some((verdi) => verdi !== null && verdi !== false && verdi !== '');
