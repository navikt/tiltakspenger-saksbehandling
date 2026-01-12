import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { SakProps } from '~/types/Sak';
import { Personoversikt } from '~/components/personoversikt/Personoversikt';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { SakProvider } from '~/context/sak/SakContext';

type Props = {
    sak: SakProps;
    isLocalOrDev: boolean;
};

const Saksside = ({ sak, isLocalOrDev }: Props) => {
    return (
        <SakProvider sak={sak}>
            <Personoversikt isLocalOrDev={isLocalOrDev} />
        </SakProvider>
    );
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const sak = await fetchSak(context.req, context.params!.saksnummer as string);

    const isLocalOrDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

    if (!sak) {
        return {
            notFound: true,
        };
    }

    return { props: { sak, isLocalOrDev } satisfies Props };
});

export default Saksside;
