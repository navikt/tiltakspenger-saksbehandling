import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { fetchJsonFraApiServerSide } from '~/utils/fetch/fetch-server';
import { BenkSide } from '~/components/benk/BenkSide';
import { ComponentProps } from 'react';
import { BenkOversiktRequestBody, BenkOversiktResponse, BenkSorteringRetning } from '~/types/Benk';
import { forceArray } from '~/utils/array';
import { ParsedUrlQuery } from 'node:querystring';
import { isValueInRecord } from '~/utils/object';
import {
    BENK_FILTER_COOKIE_NAME,
    benkFiltersFraCookie,
    benkFiltersFraQuery,
    benkFiltersTilCookieValue,
    benkFiltersTilQueryParams,
    erBenkBehandlingstype,
    erBenkStatus,
    erBenkBehandlingKlarEllerVenter,
    harAktiveFiltre,
} from '~/components/benk/filter/benkFilterUtils';

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const filtersFraQuery = benkFiltersFraQuery(context.query);

    if (harAktiveFiltre(filtersFraQuery)) {
        const cookieValue = benkFiltersTilCookieValue(filtersFraQuery);
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

    const benkOversikt = await fetchJsonFraApiServerSide<BenkOversiktResponse>(
        context.req,
        '/behandlinger',
        {
            body: JSON.stringify(requestBodyFraQuery(context.query)),
            method: 'POST',
        },
    );

    return {
        props: { benkOversikt } satisfies ComponentProps<typeof BenkSide>,
    };
});

const requestBodyFraQuery = (queryParams: ParsedUrlQuery): BenkOversiktRequestBody => {
    const { benktype, type, status, saksbehandler, sortering } = queryParams;

    return {
        sortering: isValueInRecord(sortering, BenkSorteringRetning)
            ? sortering
            : BenkSorteringRetning.ASC,
        filters: {
            benktype: erBenkBehandlingKlarEllerVenter(benktype) ? forceArray(benktype) : null,
            behandlingstype: erBenkBehandlingstype(type) ? forceArray(type) : null,
            status: erBenkStatus(status) ? forceArray(status) : null,
            identer: saksbehandler ? forceArray(saksbehandler) : null,
        },
    };
};

export default BenkSide;
