import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { SakProps } from '~/lib/sak/SakTyper';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { MeldekortSide } from '~/lib/meldekort/MeldekortSide';
import { SakProvider } from '~/lib/sak/SakContext';
import { MeldeperiodeKjedeProvider } from '~/lib/meldekort/context/MeldeperiodeKjedeContext';
import { Periode } from '~/types/Periode';
import { perioderErLike } from '~/utils/periode';
import { useState } from 'react';
import { useFeatureToggles } from '~/context/FeatureTogglesContext';
import {
    MELDEPERIODE_V2_COOKIE_NAME,
    MeldeperiodeV2Velger,
} from '~/lib/meldekort/v2/v2-velger/MeldeperiodeV2Velger';
import { MeldeperiodekjedeSideV2 } from '~/lib/meldekort/v2/meldeperiodekjede/MeldeperiodekjedeSideV2';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    sak: SakProps;
    v2Initial: boolean;
};

const Meldeperiode = ({ meldeperiodeKjede, sak, v2Initial }: Props) => {
    const { meldekortbehandlingV2Toggle } = useFeatureToggles();
    const [brukV2, setBrukV2] = useState(v2Initial);

    return (
        <>
            {meldekortbehandlingV2Toggle && (
                <MeldeperiodeV2Velger harValgtV2={brukV2} setHarValgtV2={setBrukV2} />
            )}
            <SakProvider sak={sak}>
                <MeldeperiodeKjedeProvider meldeperiodeKjede={meldeperiodeKjede}>
                    {meldekortbehandlingV2Toggle && brukV2 ? (
                        <MeldeperiodekjedeSideV2 kjedeId={meldeperiodeKjede.id} />
                    ) : (
                        <MeldekortSide />
                    )}
                </MeldeperiodeKjedeProvider>
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
            v2Initial: context.req.cookies[MELDEPERIODE_V2_COOKIE_NAME] === 'true',
        } satisfies Props,
    };
});

export default Meldeperiode;
