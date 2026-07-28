import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { SakProps } from '~/lib/sak/SakTyper';
import { Personoversikt } from '~/lib/personoversikt/Personoversikt';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { SakProvider } from '~/lib/sak/SakContext';
import { MELDEPERIODE_V2_COOKIE_NAME } from '~/lib/meldekort/v2/v2-velger/MeldeperiodeV2Velger';

type Props = {
    sak: SakProps;
    harValgtV2: boolean;
};

const Saksside = ({ sak, harValgtV2 }: Props) => {
    return (
        <SakProvider sak={sak}>
            <Personoversikt harValgtV2Initial={harValgtV2} />
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

    return {
        props: {
            sak,
            harValgtV2: context.req.cookies[MELDEPERIODE_V2_COOKIE_NAME] === 'true',
        } satisfies Props,
    };
});

export default Saksside;
