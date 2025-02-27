import { pageWithAuthentication } from '../auth/pageWithAuthentication';
import { fetchBenkOversikt } from '../utils/fetch/fetch-server';
import { BenkOversiktSide } from '../components/benk/BenkSide';
import { ComponentProps } from 'react';

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const søknaderOgBehandlinger = await fetchBenkOversikt(context.req);

    return { props: { søknaderOgBehandlinger } satisfies ComponentProps<typeof BenkOversiktSide> };
});

export default BenkOversiktSide;
