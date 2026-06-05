import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { SakProps } from '~/lib/sak/SakTyper';
import { SakProvider } from '~/lib/sak/SakContext';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortbehandlingSide } from '~/lib/meldekort/v2/meldekortbehandling/MeldekortbehandlingSide';
import { MeldekortbehandlingV2Provider } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';

type Props = {
    sak: SakProps;
    meldekortbehandlingId: MeldekortbehandlingId;
};

const Meldekortbehandling = ({ sak, meldekortbehandlingId }: Props) => {
    return (
        <SakProvider sak={sak}>
            <MeldekortbehandlingV2Provider id={meldekortbehandlingId}>
                <MeldekortbehandlingSide />
            </MeldekortbehandlingV2Provider>
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
