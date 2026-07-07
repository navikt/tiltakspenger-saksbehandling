import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { SakProps } from '~/lib/sak/SakTyper';
import { SakProvider } from '~/lib/sak/SakContext';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortbehandlingSide } from '~/lib/meldekort/meldekortbehandling/MeldekortbehandlingSide';
import { MeldekortbehandlingProvider } from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';

type Props = {
    sak: SakProps;
    meldekortbehandlingId: MeldekortbehandlingId;
};

const Meldekortbehandling = ({ sak, meldekortbehandlingId }: Props) => {
    return (
        <SakProvider sak={sak}>
            <MeldekortbehandlingProvider id={meldekortbehandlingId}>
                <MeldekortbehandlingSide />
            </MeldekortbehandlingProvider>
        </SakProvider>
    );
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const sak = await fetchSak(context.req, context.params!.saksnummer as string);

    const meldekortbehandlingId = context.params!.id as MeldekortbehandlingId;
    const meldekortbehandling = sak.meldekortbehandlinger[meldekortbehandlingId];

    if (!meldekortbehandling) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            sak,
            meldekortbehandlingId,
        } satisfies Props,
    };
});

export default Meldekortbehandling;
