import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { MeldeperiodeKjedeProps } from '~/types/meldekort/Meldeperiode';
import { SakProps } from '~/types/Sak';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { MeldekortSide } from '~/components/meldekort/MeldekortSide';
import { SakProvider } from '~/context/sak/SakContext';
import { MeldeperiodeKjedeProvider } from '~/components/meldekort/context/MeldeperiodeKjedeContext';
import { Periode } from '~/types/Periode';
import { perioderErLike } from '~/utils/periode';

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

    const periodeFraParam: Periode = {
        fraOgMed: context.params!.fraOgMed as string,
        tilOgMed: context.params!.tilOgMed as string,
    };

    const meldeperiodeKjede = sak.meldeperiodeKjeder.find((kjede) =>
        perioderErLike(kjede.periode, periodeFraParam),
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
