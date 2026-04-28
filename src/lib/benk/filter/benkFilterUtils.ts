import {
    BenkBehandlingKlarEllerVenter,
    BenkBehandling,
    BenkBehandlingsstatus,
    BenkBehandlingstype,
    BenkFiltersQueryParams,
    BenkFilters,
} from '~/lib/benk/typer/Benk';
import { isValueInRecord } from '~/utils/object';
import { SaksbehandlerTyper } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { ParsedUrlQuery } from 'node:querystring';
import Cookies from 'js-cookie';

export const BENK_FILTER_COOKIE_NAME = 'benkFilters';

export const benkFiltersTilQueryParams = (benkFilters: BenkFilters): BenkFiltersQueryParams => {
    const queryParams: BenkFiltersQueryParams = {};

    const { benktype, type, status, saksbehandler } = benkFilters;

    if (benktype) {
        queryParams.benktype = [benktype];
    }
    if (type) {
        queryParams.type = [type];
    }
    if (status) {
        queryParams.status = [status];
    }
    if (saksbehandler) {
        queryParams.saksbehandler = [saksbehandler];
    }

    return queryParams;
};

export const benkFiltersFraSearchParams = (searchParams: URLSearchParams): BenkFilters => {
    const benktype = searchParams.get('benktype');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const saksbehandler = searchParams.get('saksbehandler');

    return {
        benktype: erBenkBehandlingKlarEllerVenter(benktype) ? benktype : null,
        type: erBenkBehandlingstype(type) ? type : null,
        status: erBenkBehandlingsstatus(status) ? status : null,
        saksbehandler: typeof saksbehandler === 'string' ? saksbehandler : null,
    };
};

export const erBenkBehandlingKlarEllerVenter = (
    value: unknown,
): value is BenkBehandlingKlarEllerVenter => isValueInRecord(value, BenkBehandlingKlarEllerVenter);

export const erBenkBehandlingstype = (value: unknown): value is BenkBehandlingstype =>
    isValueInRecord(value, BenkBehandlingstype);

export const erBenkBehandlingsstatus = (value: unknown): value is BenkBehandlingsstatus =>
    isValueInRecord(value, BenkBehandlingsstatus);

export const hentSaksbehandlereTilFiltrering = (
    behandlinger: BenkBehandling[],
    innloggetSaksbehandler: SaksbehandlerTyper,
): string[] => {
    return behandlinger
        .reduce(
            (acc, { saksbehandler, beslutter }) => {
                if (saksbehandler) {
                    acc.add(saksbehandler);
                }
                if (beslutter) {
                    acc.add(beslutter);
                }

                return acc;
            },
            new Set<string>([innloggetSaksbehandler.navIdent]),
        )
        .values()
        .toArray()
        .sort((a, b) => {
            if (a === innloggetSaksbehandler.navIdent) return -1;
            if (b === innloggetSaksbehandler.navIdent) return 1;
            return a.localeCompare(b);
        });
};

export const queryUtenBenkFilter = (query: ParsedUrlQuery): ParsedUrlQuery => {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { benktype, type, status, saksbehandler, ...rest } = query;
    return rest;
};

export const benkFiltersFraQuery = (query: ParsedUrlQuery): BenkFilters => {
    return validerBenkFilters(query);
};

export const benkFiltersFraCookie = (cookieValue: string | undefined): BenkFilters | null => {
    if (!cookieValue) {
        return null;
    }

    try {
        const parsed = JSON.parse(cookieValue) as Record<string, unknown>;

        return validerBenkFilters(parsed);
    } catch {
        return null;
    }
};

const validerBenkFilters = (benkFilters: Record<string, unknown>): BenkFilters => {
    const { benktype, type, status, saksbehandler } = benkFilters;

    return {
        benktype: erBenkBehandlingKlarEllerVenter(benktype) ? benktype : null,
        type: erBenkBehandlingstype(type) ? type : null,
        status: erBenkBehandlingsstatus(status) ? status : null,
        saksbehandler: typeof saksbehandler === 'string' ? saksbehandler : null,
    };
};

export const harAktiveFiltre = (filters: BenkFilters | null): filters is BenkFilters => {
    return !!filters && Object.values(filters).some(Boolean);
};

export const setBenkFilterCookie = (filters: BenkFilters) => {
    Cookies.set(BENK_FILTER_COOKIE_NAME, JSON.stringify(filters), { expires: 365 });
};

export const clearBenkFilterCookie = () => {
    Cookies.remove(BENK_FILTER_COOKIE_NAME);
};
