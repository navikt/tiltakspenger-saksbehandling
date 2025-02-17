import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import { BehandlingId } from '../../../types/BehandlingTypes';
import { Loader } from '@navikt/ds-react';
import React from 'react';
import { useHentBehandling } from '../../../hooks/useHentBehandling';

type Props = {
    behandlingId: BehandlingId;
};

const Behandling = ({ behandlingId }: Props) => {
    const { behandling, isLoading } = useHentBehandling(behandlingId);

    if (isLoading || !behandling) {
        return <Loader />;
    }

    return <div>{`Førstegangsbehandling for ${behandlingId}`}</div>;
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    return {
        props: {
            behandlingId: context.params!.behandlingId as BehandlingId,
        } satisfies Props,
    };
});

export default Behandling;
