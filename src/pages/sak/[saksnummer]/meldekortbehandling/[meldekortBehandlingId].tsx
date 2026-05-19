import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { SakProps } from '~/lib/sak/SakTyper';
import { SakProvider } from '~/lib/sak/SakContext';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingPropsV2,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortbehandlingSide } from '~/lib/meldekort/v2/meldekortbehandling-side/MeldekortbehandlingSide';

type Props = {
    sak: SakProps;
    meldekortbehandling: MeldekortbehandlingPropsV2;
};

const Meldekortbehandling = ({ sak, meldekortbehandling }: Props) => {
    return (
        <SakProvider sak={sak}>
            <MeldekortbehandlingSide meldekortbehandling={meldekortbehandling} />
        </SakProvider>
    );
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const sak = await fetchSak(context.req, context.params!.saksnummer as string);

    const meldekortBehandlingId = context.params!.meldekortBehandlingId as MeldekortbehandlingId;
    const meldekortbehandling = sak.meldekortbehandlinger[meldekortBehandlingId];

    if (!meldekortbehandling) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            sak,
            meldekortbehandling,
        } satisfies Props,
    };
});

export default Meldekortbehandling;
