import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { nonNullish } from '~/utils/object';
import { SakProps } from '~/lib/sak/SakTyper';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { saksnummerFraPageContext } from '~/lib/sak/Saksnummer';
import { SakProvider } from '~/lib/sak/SakContext';
import { Periode } from '~/types/Periode';
import { periodeTilMeldeperiodeKjedeId } from '~/utils/periode';
import { MeldeperiodekjedeSide } from '~/lib/meldekort/meldeperiodekjede/MeldeperiodekjedeSide';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiodekjede';

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
    const saksnummer = saksnummerFraPageContext(context);

    if (!saksnummer) {
        return {
            notFound: true,
        };
    }

    const sak = await fetchSak(context.req, saksnummer);

    const periodeFraParam: Periode = {
        fraOgMed: nonNullish(context.params).fraOgMed as string,
        tilOgMed: nonNullish(context.params).tilOgMed as string,
    };

    const kjedeId = periodeTilMeldeperiodeKjedeId(periodeFraParam);

    const meldeperiodeKjede = sak.meldeperiodeKjeder.find((kjede) => kjede.id === kjedeId);

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
