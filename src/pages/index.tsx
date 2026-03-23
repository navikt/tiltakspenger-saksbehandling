import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { fetchJsonFraApiServerSide } from '~/utils/fetch/fetch-server';
import { BenkOversiktSide } from '~/components/benk/BenkSide';
import { ComponentProps } from 'react';
import { BenkOversiktRequestBody, BenkOversiktResponse, BenkSorteringRetning } from '~/types/Benk';
import { forceArray } from '~/utils/array';
import { ParsedUrlQuery } from 'node:querystring';
import { valueIsInRecord } from '~/utils/object';
import {
    erBenkBehandlingstype,
    erBenkStatus,
    erBenktype,
} from '~/components/benk/filter/benkFilterUtils';

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const benkOversikt = await fetchJsonFraApiServerSide<BenkOversiktResponse>(
        context.req,
        '/behandlinger',
        {
            body: JSON.stringify(requestBodyFraQuery(context.query)),
            method: 'POST',
        },
    );

    return {
        props: { benkOversikt } satisfies ComponentProps<typeof BenkOversiktSide>,
    };
});

const requestBodyFraQuery = (queryParams: ParsedUrlQuery): BenkOversiktRequestBody => {
    const { benktype, type, status, saksbehandler, sortering } = queryParams;

    return {
        sortering: valueIsInRecord(sortering, BenkSorteringRetning)
            ? sortering
            : BenkSorteringRetning.ASC,
        filters: {
            benktype: erBenktype(benktype) ? forceArray(benktype) : null,
            behandlingstype: erBenkBehandlingstype(type) ? forceArray(type) : null,
            status: erBenkStatus(status) ? forceArray(status) : null,
            identer: saksbehandler ? forceArray(saksbehandler) : null,
        },
    };
};

export default BenkOversiktSide;
