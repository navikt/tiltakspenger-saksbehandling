import { Button, HStack, Loader, Tag, VStack } from '@navikt/ds-react';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';
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
import { MeldeperioderProvider } from '../../../../hooks/meldekort/meldeperioder-context/MeldeperioderProvider';
import { MeldekortDetaljer } from '../../../../components/meldekort/meldekortdetaljer/MeldekortDetaljer';

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

    // TODO: selector komponent for å velge blant flere instanser av meldeperioden
    const valgtMeldeperiode = meldeperiodeKjede.meldeperioder[0];

    return (
        <VStack>
            <PersonaliaHeader sakId={sakId} saksnummer={saknummer}>
                <Button as={Link} href={`/sak/${saknummer}`} type="submit" size="small">
                    Tilbake til saksoversikt
                </Button>
                <Tag variant="alt3-filled" className={styles.behandlingTag}>
                    {finnMeldeperiodeStatusTekst[valgtMeldeperiode.status]}
                </Tag>
            </PersonaliaHeader>
            <HStack wrap={false} className={styles.behandlingLayout}>
                <MeldeperioderProvider
                    meldeperiodeKjede={meldeperiodeKjede}
                    valgtMeldeperiode={valgtMeldeperiode}
                >
                    <MeldekortDetaljer />
                    <Meldekortside />
                </MeldeperioderProvider>
            </HStack>
        </VStack>
    );
};

Meldekort.getLayout = function getLayout(page: ReactElement) {
    return <SakLayout>{page}</SakLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Meldekort;
