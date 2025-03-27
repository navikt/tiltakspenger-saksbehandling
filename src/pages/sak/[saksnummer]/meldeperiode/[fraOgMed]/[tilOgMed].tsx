import { pageWithAuthentication } from '../../../../../auth/pageWithAuthentication';
import { MeldeperiodeKjedeProps } from '../../../../../types/meldekort/Meldeperiode';
import { SakProps } from '../../../../../types/SakTypes';
import { fetchSak } from '../../../../../utils/fetch/fetch-server';
import { MeldekortSide } from '../../../../../components/meldekort/MeldekortSide';
import { SakProvider } from '../../../../../context/sak/SakContext';
import { MeldeperiodeKjedeProvider } from '../../../../../components/meldekort/context/MeldeperiodeKjedeContext';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    sak: SakProps;
};

const Meldeperiode = ({ meldeperiodeKjede, sak }: Props) => {
    return (
        <SakProvider sak={sak}>
            <MeldeperiodeKjedeProvider meldeperiodeKjede={meldeperiodeKjede}>
                <MeldekortSide />
            </MeldeperiodeKjedeProvider>
        </SakProvider>
    );
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const sak = await fetchSak(context.req, context.params!.saksnummer as string);

    const fraOgMed = context.params!.fraOgMed;
    const tilOgMed = context.params!.tilOgMed;

    const meldeperiodeKjede = sak.meldeperiodeKjeder.find(
        (kjede) => kjede.periode.fraOgMed === fraOgMed && kjede.periode.tilOgMed === tilOgMed,
    );

    if (!meldeperiodeKjede) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            sak,
            meldeperiodeKjede,
        } satisfies Props,
    };
});

export default Meldeperiode;
