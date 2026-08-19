import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { SakProvider } from '~/lib/sak/SakContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { PersonaliaHeader } from '~/lib/personaliaheader/PersonaliaHeader';
import { useHentPersonopplysninger } from '~/lib/personaliaheader/useHentPersonopplysninger';
import { ManuellSøknadFormProvider } from '~/lib/søknad/manuell-søknad/ManuellSøknadFormProvider';
import { ManuellSøknadSide } from '~/lib/søknad/manuell-søknad/ManuellSøknadSide';

type Props = {
    sak: SakProps;
};

const RegistrerSøknadManueltPage = ({ sak }: Props) => {
    const { sakId, saksnummer } = sak;

    const { personopplysninger } = useHentPersonopplysninger(sakId);

    return (
        <SakProvider sak={sak}>
            <ManuellSøknadFormProvider
                saksnummer={saksnummer}
                personopplysninger={personopplysninger}
            >
                <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true} />
                <ManuellSøknadSide fnrFraPersonopplysninger={personopplysninger?.fnr} />
            </ManuellSøknadFormProvider>
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

export default RegistrerSøknadManueltPage;
