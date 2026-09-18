import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { SakProps } from '~/lib/sak/SakTyper';
import { Personoversikt } from '~/lib/personoversikt/Personoversikt';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { SakProvider } from '~/lib/sak/SakContext';
import { saksnummerFraPageContext } from '~/lib/sak/Saksnummer';

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
    const saksnummer = saksnummerFraPageContext(context);

    if (!saksnummer) {
        return {
            notFound: true,
        };
    }

    const sak = await fetchSak(context.req, saksnummer);

    if (!sak) {
        return {
            notFound: true,
        };
    }

    return {
        props: { sak } satisfies Props,
    };
});

export default Saksside;
