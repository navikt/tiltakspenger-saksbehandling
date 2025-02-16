import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import { BehandlingId } from '../../../types/BehandlingTypes';

type Props = {
    behandlingId: BehandlingId;
};

const FørstegangsBehandling = ({ behandlingId }: Props) => {
    return <div>{`Førstegangsbehandling for ${behandlingId}`}</div>;
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    return {
        props: {
            behandlingId: context.params!.behandlingId as BehandlingId,
        } satisfies Props,
    };
});

export default FørstegangsBehandling;
