import { useParams } from 'next/navigation';
import { pageWithAuthentication } from '../../../../../auth/pageWithAuthentication';
import { PersonaliaHeader } from '../../../../../components/personaliaheader/PersonaliaHeader';
import { SakProvider } from '../../../../../context/sak/SakContext';
import { SakProps } from '../../../../../types/SakTypes';
import { fetchSak } from '../../../../../utils/fetch/fetch-server';
import { singleOrFirst } from '../../../../../utils/array';
import OppsummeringAvSøknad from '../../../../../components/oppsummeringer/oppsummeringAvSøknad/OppsummeringAvSøknad';
import AvbruttOppsummering from '../../../../../components/oppsummeringer/oppsummeringAvAvbruttBehandling/OppsummeringAvAvbruttBehandling';
import SideBarMain from '../../../../../layouts/sidebar-main/SideBarMain';

interface Props {
    sak: SakProps;
}

/**
 * For avbrutt behandling brukes bare behandlingssiden med deaktiverte felter.
 */
const AvbruttPage = (props: Props) => {
    const { id } = useParams();

    const søknad = props.sak.søknader.find((s) => s.id === id);

    if (!søknad) {
        return <div>Fant ikke søknad</div>;
    }

    if (!søknad.avbrutt) {
        return <div>Dette er ikke en avbrutt søknad</div>;
    }

    const tiltakFraSøknad = singleOrFirst(søknad.tiltak);

    return (
        <SakProvider sak={props.sak}>
            <PersonaliaHeader
                sakId={props.sak.sakId}
                saksnummer={props.sak.saksnummer}
                visTilbakeKnapp={true}
                kanSendeInnHelgForMeldekort={props.sak.kanSendeInnHelgForMeldekort}
            />
            <SideBarMain
                sidebar={
                    <OppsummeringAvSøknad
                        søknad={søknad}
                        tiltaksperiode={{
                            fraOgMed: tiltakFraSøknad.fraOgMed,
                            tilOgMed: tiltakFraSøknad.tilOgMed,
                        }}
                        medTittel
                    />
                }
                main={<AvbruttOppsummering avbrutt={søknad.avbrutt} />}
            />
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

export default AvbruttPage;
