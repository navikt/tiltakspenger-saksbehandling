import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { fetchBenkOversikt } from '~/utils/fetch/fetch-server';
import { BenkSide } from '~/lib/benk/BenkSide';
import { ComponentProps } from 'react';
import { BenkOversiktRequestBody, BenkSortering } from '~/lib/benk/typer/Benk';
import { forceArray } from '~/utils/array';
import { ParsedUrlQuery } from 'node:querystring';
import {
    BENK_FILTER_COOKIE_NAME,
    benkFiltersFraCookie,
    benkFiltersFraQuery,
    benkFiltersTilQueryParams,
    erBenkBehandlingstype,
    erBenkBehandlingsstatus,
    erBenkBehandlingKlarEllerVenter,
    harAktiveFiltre,
} from '~/lib/benk/filter/benkFilterUtils';
import { BENK_SORTERING_DEFAULT } from '~/lib/benk/benkSideUtils';

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const filtersFraQuery = benkFiltersFraQuery(context.query);

    if (harAktiveFiltre(filtersFraQuery)) {
        const cookieValue = JSON.stringify(filtersFraQuery);
        context.res.setHeader(
            'Set-Cookie',
            `${BENK_FILTER_COOKIE_NAME}=${encodeURIComponent(cookieValue)}; Path=/; Max-Age=31536000`,
        );
    } else {
        const cookieValue = context.req.cookies[BENK_FILTER_COOKIE_NAME];
        const filtersFraCookie = benkFiltersFraCookie(cookieValue);

        if (harAktiveFiltre(filtersFraCookie)) {
            const queryParams = benkFiltersTilQueryParams(filtersFraCookie);
            const searchParams = new URLSearchParams();

            Object.entries(queryParams).forEach(([key, values]) => {
                forceArray(values).forEach((value) => searchParams.append(key, value));
            });

            return {
                redirect: {
                    destination: `/?${searchParams.toString()}`,
                    permanent: false,
                },
            };
        }
    }

    const benkOversikt = await fetchBenkOversikt(context.req, requestBodyFraQuery(context.query));

    return {
        props: { benkOversikt } satisfies ComponentProps<typeof BenkSide>,
    };
});

const requestBodyFraQuery = (queryParams: ParsedUrlQuery): BenkOversiktRequestBody => {
    const { benktype, type, status, saksbehandler, sortering } = queryParams;

    return {
        sortering: (sortering as BenkSortering) ?? BENK_SORTERING_DEFAULT,
        filters: {
            benktype: erBenkBehandlingKlarEllerVenter(benktype) ? forceArray(benktype) : null,
            behandlingstype: erBenkBehandlingstype(type) ? forceArray(type) : null,
            status: erBenkBehandlingsstatus(status) ? forceArray(status) : null,
            identer: saksbehandler ? forceArray(saksbehandler) : null,
        },
    };
};

export default BenkSide;
