import { ReactElement } from 'react';
import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import { NextPageWithLayout } from '../../_app';
import { SakLayout } from '../../../components/layout/SakLayout';
import { Sak } from '../../../types/SakTypes';
import { PersonaliaHeader } from '../../../components/personaliaheader/PersonaliaHeader';
import { preload } from 'swr';
import { fetcher } from '../../../utils/http';
import { Saksoversikt } from '../../../components/saksoversikt/Saksoversikt';
import { fetchJsonFraApi } from '../../../utils/auth';

const Saksside: NextPageWithLayout<Sak> = ({
    behandlingsoversikt,
    meldeperiodeoversikt,
    saksnummer,
    sakId,
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
            />
        </>
    );
};

Saksside.getLayout = function getLayout(page: ReactElement) {
    return <SakLayout>{page}</SakLayout>;
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const sak = await fetchJsonFraApi<Sak>(context.req, `/sak/${context.params!.saksnummer}`);

    if (!sak) {
        return {
            notFound: true,
        };
    }

    return { props: { ...sak } };
});

export default Saksside;
