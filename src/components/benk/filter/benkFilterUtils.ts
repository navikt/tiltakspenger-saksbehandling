import {
    BehandlingssammendragBenktype,
    BenkBehandling,
    BenkBehandlingsstatus,
    BenkBehandlingstype,
    BenkFilterQueryParams,
    BenkFilters,
} from '~/types/Benk';
import { valueIsInRecord } from '~/utils/object';
import { Saksbehandler } from '~/types/Saksbehandler';
import { ParsedUrlQuery } from 'node:querystring';

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
        benktype: erBenktype(benktype) ? benktype : null,
        type: erBenkBehandlingstype(type) ? type : null,
        status: erBenkStatus(status) ? status : null,
        saksbehandler: typeof saksbehandler === 'string' ? saksbehandler : null,
    };
};

export const erBenktype = (value: unknown) => valueIsInRecord(value, BehandlingssammendragBenktype);

export const erBenkBehandlingstype = (value: unknown) =>
    valueIsInRecord(value, BenkBehandlingstype);

export const erBenkStatus = (value: unknown) => valueIsInRecord(value, BenkBehandlingsstatus);

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
