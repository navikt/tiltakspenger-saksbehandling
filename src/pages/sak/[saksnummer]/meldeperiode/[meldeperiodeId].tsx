import { Button, HStack, Loader, Tag, VStack } from '@navikt/ds-react';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';
import MeldekortDetaljer from '../../../../components/meldekort/meldekortdetaljer/MeldekortDetaljer';
import { Meldekortside } from '../../../../components/meldekort/meldekortside/Meldekortside';
import { NextPageWithLayout } from '../../../_app';
import { SakContext, SakLayout } from '../../../../components/layout/SakLayout';
import { ReactElement, useContext } from 'react';
import PersonaliaHeader from '../../../../components/personaliaheader/PersonaliaHeader';
import router from 'next/router';
import { finnMeldeperiodeStatusTekst } from '../../../../utils/tekstformateringUtils';
import { useHentMeldeperiodeKjede } from '../../../../hooks/meldekort/useHentMeldeperiodeKjede';
import Varsel from '../../../../components/varsel/Varsel';
import Link from 'next/link';

import styles from '../../../behandling/Behandling.module.css';

const Meldekort: NextPageWithLayout = () => {
    const { sakId, saknummer } = useContext(SakContext);
    const meldeperiodeId = router.query.meldeperiodeId as string;

    const { meldeperiodeKjede, error, isLoading } = useHentMeldeperiodeKjede(meldeperiodeId, sakId);

    if (error) {
        console.error(error.message);
        return <Varsel variant="error" melding={error.message} />;
    }

    if (isLoading || !meldeperiodeKjede) {
        return <Loader />;
    }

    return (
        <VStack>
            <PersonaliaHeader sakId={sakId} saksnummer={saknummer}>
                <Button as={Link} href={`/sak/${saknummer}`} type="submit" size="small">
                    Tilbake til saksoversikt
                </Button>
                <Tag variant="alt3-filled" className={styles.behandlingTag}>
                    {finnMeldeperiodeStatusTekst[meldeperiodeKjede.meldeperioder[0].status]}
                </Tag>
            </PersonaliaHeader>
            <HStack wrap={false} className={styles.behandlingLayout}>
                <MeldekortDetaljer
                    meldeperiode={meldeperiodeKjede.meldeperioder[0]}
                    meldeperiodeKjede={meldeperiodeKjede}
                />
                <Meldekortside meldeperiodeKjede={meldeperiodeKjede} />
            </HStack>
        </VStack>
    );
};

Meldekort.getLayout = function getLayout(page: ReactElement) {
    return <SakLayout>{page}</SakLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Meldekort;
