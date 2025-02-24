import { pageWithAuthentication } from '../../../../../auth/pageWithAuthentication';
import { MeldeperiodeKjedeProps } from '../../../../../types/meldekort/Meldeperiode';
import { SakProps } from '../../../../../types/SakTypes';
import { fetchSak } from '../../../../../utils/server-fetch';
import { SakProvider } from '../../../../../context/sak/SakProvider';
import { MeldeperiodeSide } from '../../../../../components/meldekort/MeldeperiodeSide';
import { MeldeperioderProvider } from '../../../../../context/meldeperioder/MeldeperioderProvider';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    sak: SakProps;
};

const Meldeperiode = ({ meldeperiodeKjede, sak }: Props) => {
    return (
        <SakProvider sak={sak}>
            <MeldeperioderProvider meldeperiodeKjede={meldeperiodeKjede}>
                <MeldeperiodeSide />
            </MeldeperioderProvider>
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
