import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import { BehandlingId } from '../../../types/BehandlingTypes';
import { BehandlingPage } from '../../../components/behandling-page/BehandlingPage';
import { ComponentProps } from 'react';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = pageWithAuthentication(async (context) => {
    return {
        props: {
            behandlingId: context.params!.behandlingId as BehandlingId,
        } satisfies ComponentProps<typeof BehandlingPage>,
    };
});

export default BehandlingPage;
