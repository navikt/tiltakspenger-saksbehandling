import {
    mockKlage,
    mockMeldekort,
    mockRevurderinger,
    mockSøknader,
    mockTilbakekrevinger,
} from './mockData';
import { BenkV2Oversikt, BenkV2SorteringRetning } from '../typer/felles';
import { BenkV2Tab } from '../typer/tabs';
import { BenkSøknaderKolonne, BenkSøknaderRequest, BenkSøknadsbehandling } from '../typer/søknader';
import {
    BenkRevurderingerKolonne,
    BenkRevurderingerRequest,
    BenkRevurdering,
} from '../typer/revurderinger';
import { BenkMeldekort, BenkMeldekortKolonne, BenkMeldekortRequest } from '../typer/meldekort';
import { BenkKlagebehandling, BenkKlageKolonne, BenkKlageRequest } from '../typer/klage';
import {
    BenkTilbakekreving,
    BenkTilbakekrevingKolonne,
    BenkTilbakekrevingRequest,
} from '../typer/tilbakekreving';

/**
 * Simulerer backend for benk v2 med mock-data.
 *
 * Når backend er klar skal kun denne modulen byttes ut med ekte API-kall -
 * request/response-typene er ment å speile det fremtidige API-et.
 */

const TILBAKEKREVING_MINSTEBELØP = 5380;

const filtrerSaksbehandler = <T extends { saksbehandler: string | null }>(
    behandlinger: T[],
    saksbehandler: string | 'IKKE_TILDELT' | null,
): T[] => {
    if (!saksbehandler) {
        return behandlinger;
    }
    return behandlinger.filter((b) =>
        saksbehandler === 'IKKE_TILDELT'
            ? b.saksbehandler === null
            : b.saksbehandler === saksbehandler,
    );
};

const sorter = <T, Kolonne extends string>(
    behandlinger: T[],
    sortering: `${Kolonne},${BenkV2SorteringRetning}`,
    felt: Record<Kolonne, (b: T) => string | number | null>,
): T[] => {
    const [kolonne, retning] = sortering.split(',') as [Kolonne, BenkV2SorteringRetning];
    const hentVerdi = felt[kolonne];
    const fortegn = retning === BenkV2SorteringRetning.ASC ? 1 : -1;

    return behandlinger.toSorted((a, b) => {
        const verdiA = hentVerdi(a);
        const verdiB = hentVerdi(b);
        if (verdiA === null || verdiA === undefined) return 1;
        if (verdiB === null || verdiB === undefined) return -1;
        if (typeof verdiA === 'number' && typeof verdiB === 'number') {
            return (verdiA - verdiB) * fortegn;
        }
        return String(verdiA).localeCompare(String(verdiB), 'nb') * fortegn;
    });
};

const tilOversikt = <T>(ufiltrert: T[], filtrert: T[]): BenkV2Oversikt<T> => ({
    behandlinger: filtrert,
    totalAntall: filtrert.length,
    totalAntallUfiltrert: ufiltrert.length,
    antallFiltrertPgaTilgang: 0,
});

export const hentSøknaderOversikt = (
    request: BenkSøknaderRequest,
): BenkV2Oversikt<BenkSøknadsbehandling> => {
    const { status, søknadstype, saksbehandler } = request.filters;

    const filtrert = mockSøknader.filter(
        (b) => (!status || b.status === status) && (!søknadstype || b.søknadstype === søknadstype),
    );

    return tilOversikt(
        mockSøknader,
        sorter(filtrerSaksbehandler(filtrert, saksbehandler), request.sortering, {
            [BenkSøknaderKolonne.fnr]: (b) => b.fnr,
            [BenkSøknaderKolonne.søknadstype]: (b) => b.søknadstype,
            [BenkSøknaderKolonne.status]: (b) => b.status,
            [BenkSøknaderKolonne.kravtidspunkt]: (b) => b.kravtidspunkt,
            [BenkSøknaderKolonne.sistEndret]: (b) => b.sistEndret,
            [BenkSøknaderKolonne.saksbehandler]: (b) => b.saksbehandler,
            [BenkSøknaderKolonne.beslutter]: (b) => b.beslutter,
        }),
    );
};

export const hentRevurderingerOversikt = (
    request: BenkRevurderingerRequest,
): BenkV2Oversikt<BenkRevurdering> => {
    const { status, resultat, saksbehandler } = request.filters;

    const filtrert = mockRevurderinger.filter(
        (b) => (!status || b.status === status) && (!resultat || b.resultat === resultat),
    );

    return tilOversikt(
        mockRevurderinger,
        sorter(filtrerSaksbehandler(filtrert, saksbehandler), request.sortering, {
            [BenkRevurderingerKolonne.fnr]: (b) => b.fnr,
            [BenkRevurderingerKolonne.resultat]: (b) => b.resultat,
            [BenkRevurderingerKolonne.status]: (b) => b.status,
            [BenkRevurderingerKolonne.startet]: (b) => b.startet,
            [BenkRevurderingerKolonne.sistEndret]: (b) => b.sistEndret,
            [BenkRevurderingerKolonne.saksbehandler]: (b) => b.saksbehandler,
            [BenkRevurderingerKolonne.beslutter]: (b) => b.beslutter,
        }),
    );
};

export const hentMeldekortOversikt = (
    request: BenkMeldekortRequest,
): BenkV2Oversikt<BenkMeldekort> => {
    const { status, type, saksbehandler } = request.filters;

    const filtrert = mockMeldekort.filter(
        (b) => (!status || b.status === status) && (!type || b.type === type),
    );

    return tilOversikt(
        mockMeldekort,
        sorter(filtrerSaksbehandler(filtrert, saksbehandler), request.sortering, {
            [BenkMeldekortKolonne.fnr]: (b) => b.fnr,
            [BenkMeldekortKolonne.type]: (b) => b.type,
            [BenkMeldekortKolonne.periode]: (b) => b.periode.fraOgMed,
            [BenkMeldekortKolonne.beløp]: (b) => b.beløp,
            [BenkMeldekortKolonne.status]: (b) => b.status,
            [BenkMeldekortKolonne.mottatt]: (b) => b.mottattTidspunkt,
            [BenkMeldekortKolonne.saksbehandler]: (b) => b.saksbehandler,
        }),
    );
};

export const hentKlageOversikt = (
    request: BenkKlageRequest,
): BenkV2Oversikt<BenkKlagebehandling> => {
    const { status, resultat, saksbehandler } = request.filters;

    const filtrert = mockKlage.filter(
        (b) => (!status || b.status === status) && (!resultat || b.resultat === resultat),
    );

    return tilOversikt(
        mockKlage,
        sorter(filtrerSaksbehandler(filtrert, saksbehandler), request.sortering, {
            [BenkKlageKolonne.fnr]: (b) => b.fnr,
            [BenkKlageKolonne.resultat]: (b) => b.resultat,
            [BenkKlageKolonne.status]: (b) => b.status,
            [BenkKlageKolonne.kravtidspunkt]: (b) => b.kravtidspunkt,
            [BenkKlageKolonne.sistEndret]: (b) => b.sistEndret,
            [BenkKlageKolonne.saksbehandler]: (b) => b.saksbehandler,
            [BenkKlageKolonne.beslutter]: (b) => b.beslutter,
        }),
    );
};

export const hentTilbakekrevingOversikt = (
    request: BenkTilbakekrevingRequest,
): BenkV2Oversikt<BenkTilbakekreving> => {
    const { status, kilde, saksbehandler, kunOverMinstebeløp } = request.filters;

    const filtrert = mockTilbakekrevinger.filter(
        (b) =>
            (!status || b.status === status) &&
            (!kilde || b.kilde === kilde) &&
            (!kunOverMinstebeløp || b.beløp >= TILBAKEKREVING_MINSTEBELØP),
    );

    return tilOversikt(
        mockTilbakekrevinger,
        sorter(filtrerSaksbehandler(filtrert, saksbehandler), request.sortering, {
            [BenkTilbakekrevingKolonne.fnr]: (b) => b.fnr,
            [BenkTilbakekrevingKolonne.beløp]: (b) => b.beløp,
            [BenkTilbakekrevingKolonne.kilde]: (b) => b.kilde,
            [BenkTilbakekrevingKolonne.status]: (b) => b.status,
            [BenkTilbakekrevingKolonne.startet]: (b) => b.startet,
            [BenkTilbakekrevingKolonne.sistEndret]: (b) => b.sistEndret,
            [BenkTilbakekrevingKolonne.saksbehandler]: (b) => b.saksbehandler,
        }),
    );
};

export const hentAntallPerTab = (): Record<BenkV2Tab, number> => ({
    [BenkV2Tab.SØKNADER]: mockSøknader.length,
    [BenkV2Tab.REVURDERINGER]: mockRevurderinger.length,
    [BenkV2Tab.MELDEKORT]: mockMeldekort.length,
    [BenkV2Tab.KLAGE]: mockKlage.length,
    [BenkV2Tab.TILBAKEKREVING]: mockTilbakekrevinger.length,
});
