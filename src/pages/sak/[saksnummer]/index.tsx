import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { SakProps } from '~/lib/sak/SakTyper';
import { Personoversikt } from '~/lib/personoversikt/Personoversikt';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { SakProvider } from '~/lib/sak/SakContext';

type Props = {
    sak: SakProps;
};

const Saksside = ({ sak }: Props) => {
    return (
        <SakProvider sak={sak}>
            <Personoversikt />
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
