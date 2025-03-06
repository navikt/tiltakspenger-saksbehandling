import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import { SakProps } from '../../../types/SakTypes';
import { Saksoversikt } from '../../../components/saksoversikt/Saksoversikt';
import { fetchSak } from '../../../utils/fetch/fetch-server';
import { SakProvider } from '../../../context/sak/SakContext';

type Props = {
    sak: SakProps;
};

const Saksside = ({ sak }: Props) => {
    return (
        <SakProvider sak={sak}>
            <Saksoversikt />
        </SakProvider>
    );
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const sak = await fetchSak(context.req, context.params!.saksnummer as string);

    if (!sak) {
        return {
            notFound: true,
        };
    }

    return { props: { sak } satisfies Props };
});

export default Saksside;
