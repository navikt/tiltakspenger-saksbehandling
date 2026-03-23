import {
    BenkBehandlingKlarEllerVenter,
    BenkBehandling,
    BenkBehandlingsstatus,
    BenkBehandlingstype,
    BenkFilterQueryParams,
    BenkFilters,
} from '~/types/Benk';
import { isValueInRecord } from '~/utils/object';
import { Saksbehandler } from '~/types/Saksbehandler';
import { ParsedUrlQuery } from 'node:querystring';
import Cookies from 'js-cookie';

export const BENK_FILTER_COOKIE_NAME = 'benkFilters';

export const benkFiltersTilQueryParams = (benkFilters: BenkFilters): BenkFilterQueryParams => {
    const queryParams: BenkFilterQueryParams = {};

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
        status: erBenkStatus(status) ? status : null,
        saksbehandler: typeof saksbehandler === 'string' ? saksbehandler : null,
    };
};

export const erBenkBehandlingKlarEllerVenter = (
    value: unknown,
): value is BenkBehandlingKlarEllerVenter => isValueInRecord(value, BenkBehandlingKlarEllerVenter);

export const erBenkBehandlingstype = (value: unknown): value is BenkBehandlingstype =>
    isValueInRecord(value, BenkBehandlingstype);

export const erBenkStatus = (value: unknown): value is BenkBehandlingsstatus =>
    isValueInRecord(value, BenkBehandlingsstatus);

export const hentSaksbehandlereTilFiltrering = (
    behandlinger: BenkBehandling[],
    innloggetSaksbehandler: Saksbehandler,
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
    const { benktype, type, status, saksbehandler } = query;
    return {
        benktype: erBenkBehandlingKlarEllerVenter(benktype) ? benktype : null,
        type: erBenkBehandlingstype(type) ? type : null,
        status: erBenkStatus(status) ? status : null,
        saksbehandler: typeof saksbehandler === 'string' ? saksbehandler : null,
    };
};

export const benkFiltersFraCookie = (cookieValue: string | undefined): BenkFilters | null => {
    if (!cookieValue) {
        return null;
    }

    try {
        const parsed = JSON.parse(cookieValue) as BenkFilters;

        return {
            benktype: erBenkBehandlingKlarEllerVenter(parsed.benktype) ? parsed.benktype : null,
            type: erBenkBehandlingstype(parsed.type) ? parsed.type : null,
            status: erBenkStatus(parsed.status) ? parsed.status : null,
            saksbehandler: typeof parsed.saksbehandler === 'string' ? parsed.saksbehandler : null,
        };
    } catch {
        return null;
    }
};

export const benkFiltersTilCookieValue = (filters: BenkFilters): string => {
    return JSON.stringify(filters);
};

export const harAktiveFiltre = (filters: BenkFilters | null): filters is BenkFilters => {
    return !!filters && Object.values(filters).some(Boolean);
};

export const setBenkFilterCookie = (filters: BenkFilters): void => {
    const value = benkFiltersTilCookieValue(filters);
    Cookies.set(BENK_FILTER_COOKIE_NAME, value, { expires: 365 });
};

export const clearBenkFilterCookie = (): void => {
    Cookies.remove(BENK_FILTER_COOKIE_NAME);
};
