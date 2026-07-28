import { useRouter } from 'next/router';
import { useState } from 'react';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { SakProps } from '~/lib/sak/SakTyper';
import { SakProvider } from '~/lib/sak/SakContext';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortbehandlingSide } from '~/lib/meldekort/v2/meldekortbehandling/MeldekortbehandlingSide';
import { MeldekortbehandlingV2Provider } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import {
    MELDEPERIODE_V2_COOKIE_NAME,
    MeldeperiodeV2Velger,
} from '~/lib/meldekort/v2/v2-velger/MeldeperiodeV2Velger';
import { meldeperiodeUrl } from '~/utils/urls';

type Props = {
    sak: SakProps;
    meldekortbehandlingId: MeldekortbehandlingId;
};

/**
 * Denne siden finnes bare i V2-visningen.
 * Har saksbehandler valgt gammel visning, sender getServerSideProps videre til meldeperiode-siden, der behandlingen vises.
 * Velgeren rendres her også, slik at valget kan gjøres om uten å måtte tilbake til meldeperiode-siden.
 */
const Meldekortbehandling = ({ sak, meldekortbehandlingId }: Props) => {
    const router = useRouter();
    const periode = sak.meldekortbehandlinger[meldekortbehandlingId]?.periode;

    // Lokal state slik at switchen følger klikket umiddelbart -- redirecten til meldeperiode-siden tar et øyeblikk, og en hardkodet verdi ville latt den sprette tilbake imens.
    const [harValgtV2, setHarValgtV2] = useState(true);

    return (
        <SakProvider sak={sak}>
            {periode && (
                <MeldeperiodeV2Velger
                    harValgtV2={harValgtV2}
                    setHarValgtV2={(valgtV2) => {
                        setHarValgtV2(valgtV2);
                        if (!valgtV2) {
                            router.push(meldeperiodeUrl(sak.saksnummer, periode));
                        }
                    }}
                />
            )}
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

    if (context.req.cookies[MELDEPERIODE_V2_COOKIE_NAME] !== 'true') {
        return {
            redirect: {
                destination: meldeperiodeUrl(sak.saksnummer, meldekortbehandling.periode),
                permanent: false,
            },
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
