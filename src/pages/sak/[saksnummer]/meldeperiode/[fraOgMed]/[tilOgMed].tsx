import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { SakProps } from '~/lib/sak/SakTyper';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { SakProvider } from '~/lib/sak/SakContext';
import { Periode } from '~/types/Periode';
import { periodeTilMeldeperiodeKjedeId } from '~/utils/periode';
import { MeldeperiodekjedeSide } from '~/lib/meldekort/meldeperiodekjede/MeldeperiodekjedeSide';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
    sak: SakProps;
};

const Meldeperiode = ({ kjedeId, sak }: Props) => {
    return (
        <SakProvider sak={sak}>
            <MeldeperiodekjedeSide kjedeId={kjedeId} />
        </SakProvider>
    );
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const sak = await fetchSak(context.req, context.params!.saksnummer as string);

    const periodeFraParam: Periode = {
        fraOgMed: context.params!.fraOgMed as string,
        tilOgMed: context.params!.tilOgMed as string,
    };

    const kjedeId = periodeTilMeldeperiodeKjedeId(periodeFraParam);

    const meldeperiodeKjede = sak.meldeperiodeKjederV2.find((kjede) => kjede.id === kjedeId);

    if (!meldeperiodeKjede) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            sak,
            kjedeId,
        } satisfies Props,
    };
});

export default Meldeperiode;
