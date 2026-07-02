import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { SakProps } from '~/lib/sak/SakTyper';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { MeldekortSide } from '~/lib/meldekort/MeldekortSide';
import { SakProvider } from '~/lib/sak/SakContext';
import { MeldeperiodeKjedeProvider } from '~/lib/meldekort/context/MeldeperiodeKjedeContext';
import { Periode } from '~/types/Periode';
import { periodeTilMeldeperiodeKjedeId } from '~/utils/periode';
import { useState } from 'react';
import { useFeatureToggles } from '~/context/FeatureTogglesContext';
import {
    MELDEPERIODE_V2_COOKIE_NAME,
    MeldeperiodeV2Velger,
} from '~/lib/meldekort/v2/v2-velger/MeldeperiodeV2Velger';
import { MeldeperiodekjedeSideV2 } from '~/lib/meldekort/v2/meldeperiodekjede/MeldeperiodekjedeSideV2';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
    sak: SakProps;
    v2Initial: boolean;
};

const Meldeperiode = ({ kjedeId, sak, v2Initial }: Props) => {
    const { meldekortbehandlingV2Toggle } = useFeatureToggles();
    const [brukV2, setBrukV2] = useState(v2Initial);

    return (
        <>
            {meldekortbehandlingV2Toggle && (
                <MeldeperiodeV2Velger harValgtV2={brukV2} setHarValgtV2={setBrukV2} />
            )}
            <SakProvider sak={sak}>
                {meldekortbehandlingV2Toggle && brukV2 ? (
                    <MeldeperiodekjedeSideV2 kjedeId={kjedeId} />
                ) : (
                    <MeldeperiodeKjedeProvider kjedeId={kjedeId}>
                        <MeldekortSide />
                    </MeldeperiodeKjedeProvider>
                )}
            </SakProvider>
        </>
    );
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const sak = await fetchSak(context.req, context.params!.saksnummer as string);

    const periodeFraParam: Periode = {
        fraOgMed: context.params!.fraOgMed as string,
        tilOgMed: context.params!.tilOgMed as string,
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
            v2Initial: context.req.cookies[MELDEPERIODE_V2_COOKIE_NAME] === 'true',
        } satisfies Props,
    };
});

export default Meldeperiode;
