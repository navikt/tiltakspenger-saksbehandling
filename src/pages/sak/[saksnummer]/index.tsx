import { ReactElement } from 'react';
import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import { NextPageWithLayout } from '../../_app';
import { SakLayout } from '../../../components/layout/SakLayout';
import { Sak } from '../../../types/SakTypes';
import { logger } from '@navikt/next-logger';
import { getToken, requestOboToken } from '@navikt/oasis';
import PersonaliaHeader from '../../../components/personaliaheader/PersonaliaHeader';
import { preload } from 'swr';
import { fetcher } from '../../../utils/http';
import { Saksoversikt } from '../../../components/saksoversikt/Saksoversikt';

const Saksside: NextPageWithLayout<Sak> = ({
    behandlingsoversikt,
    meldeperiodeoversikt,
    saksnummer,
    sakId,
    førsteLovligeStansdato,
}: Sak) => {
    preload(`/api/sak/${sakId}/personopplysninger`, fetcher);
    return (
        <>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} />
            <Saksoversikt
                sakId={sakId}
                saksnummer={saksnummer}
                behandlingsoversikt={behandlingsoversikt}
                meldeperioder={meldeperiodeoversikt}
                førsteLovligeStansdato={førsteLovligeStansdato}
            />
        </>
    );
};

Saksside.getLayout = function getLayout(page: ReactElement) {
    return <SakLayout>{page}</SakLayout>;
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const backendUrl = process.env.TILTAKSPENGER_SAKSBEHANDLING_API_URL;

    const token = await getToken(context.req);
    logger.info('Henter obo-token for tiltakspenger-saksbehandling-api');
    const obo = await requestOboToken(token, `${process.env.SAKSBEHANDLING_API_SCOPE}`);
    if (!obo.ok) {
        throw new Error(`Kunne ikke gjøre on-behalf-of-utveksling for saksbehandlertoken`);
    }

    const sakResponse: Response = await fetch(`${backendUrl}/sak/${context.params!.saksnummer}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${obo.token}`,
        },
    });
    const sak: Sak = await sakResponse.json();

    if (!sak) {
        return {
            notFound: true,
        };
    }

    return { props: { ...sak } };
});

export default Saksside;
