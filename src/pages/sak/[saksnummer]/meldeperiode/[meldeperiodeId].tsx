import { Button, HStack, Loader, Tag, VStack } from '@navikt/ds-react';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';
import { Meldekortside } from '../../../../components/meldekort/meldekortside/Meldekortside';
import { NextPageWithLayout } from '../../../_app';
import { SakLayout, useSak } from '../../../../components/layout/SakLayout';
import { ReactElement } from 'react';
import { PersonaliaHeader } from '../../../../components/personaliaheader/PersonaliaHeader';
import { finnMeldeperiodeStatusTekst } from '../../../../utils/tekstformateringUtils';
import { useHentMeldeperiodeKjede } from '../../../../hooks/meldekort/useHentMeldeperiodeKjede';
import Varsel from '../../../../components/varsel/Varsel';
import Link from 'next/link';
import { MeldeperioderProvider } from '../../../../context/meldeperioder/MeldeperioderProvider';
import { MeldekortDetaljer } from '../../../../components/meldekort/meldekortdetaljer/MeldekortDetaljer';
import { MeldeperiodeKjedeId } from '../../../../types/meldekort/Meldeperiode';

import styles from './meldeperiode.module.css';

type Props = {
    meldeperiodeKjedeId: MeldeperiodeKjedeId;
};

const Meldekort: NextPageWithLayout<Props> = ({ meldeperiodeKjedeId }) => {
    const { sakId, saknummer } = useSak();

    const { meldeperiodeKjede, error, laster } = useHentMeldeperiodeKjede(
        meldeperiodeKjedeId,
        sakId,
    );

    if (error) {
        console.error(error.message);
    }

    // TODO: selector komponent for å velge blant flere instanser av meldeperioden
    const valgtMeldeperiode = meldeperiodeKjede?.meldeperioder[0];

    return (
        <VStack>
            <PersonaliaHeader sakId={sakId} saksnummer={saknummer}>
                <Button as={Link} href={`/sak/${saknummer}`} type="submit" size="small">
                    Tilbake til saksoversikt
                </Button>
                {valgtMeldeperiode && (
                    <Tag variant="alt3-filled" className={styles.behandlingTag}>
                        {finnMeldeperiodeStatusTekst[valgtMeldeperiode.status]}
                    </Tag>
                )}
            </PersonaliaHeader>
            <HStack wrap={false} className={styles.behandlingLayout}>
                {laster ? (
                    <Loader />
                ) : error ? (
                    <Varsel variant="error" melding={error.message} />
                ) : !valgtMeldeperiode ? (
                    <Varsel
                        variant="error"
                        melding={`Fant ingen meldeperioder for ${meldeperiodeKjedeId}`}
                    />
                ) : (
                    <MeldeperioderProvider
                        meldeperiodeKjede={meldeperiodeKjede}
                        valgtMeldeperiode={valgtMeldeperiode}
                    >
                        <MeldekortDetaljer />
                        <Meldekortside />
                    </MeldeperioderProvider>
                )}
            </HStack>
        </VStack>
    );
};

Meldekort.getLayout = function getLayout(page: ReactElement) {
    return <SakLayout>{page}</SakLayout>;
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    return {
        props: {
            meldeperiodeKjedeId: context.params!.meldeperiodeId,
        },
    };
});

export default Meldekort;
