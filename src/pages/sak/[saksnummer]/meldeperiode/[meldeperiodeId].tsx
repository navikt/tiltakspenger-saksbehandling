import { Button, HStack, Loader, Tag, VStack } from '@navikt/ds-react';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';
import { Meldekortside } from '../../../../components/meldekort/meldekortside/Meldekortside';
import { PersonaliaHeader } from '../../../../components/personaliaheader/PersonaliaHeader';
import { finnMeldeperiodeStatusTekst } from '../../../../utils/tekstformateringUtils';
import { useHentMeldeperiodeKjede } from '../../../../hooks/meldekort/useHentMeldeperiodeKjede';
import Varsel from '../../../../components/varsel/Varsel';
import Link from 'next/link';
import { MeldeperioderProvider } from '../../../../context/meldeperioder/MeldeperioderProvider';
import { MeldekortDetaljer } from '../../../../components/meldekort/meldekortdetaljer/MeldekortDetaljer';
import { MeldeperiodeKjedeId } from '../../../../types/meldekort/Meldeperiode';
import { Sak } from '../../../../types/SakTypes';
import { fetchSak } from '../../../../utils/server-fetch';
import { SakProvider } from '../../../../context/sak/SakProvider';
import { useSak } from '../../../../context/sak/useSak';

import styles from './meldeperiode.module.css';

const Meldekort = ({ meldeperiodeKjedeId }: { meldeperiodeKjedeId: MeldeperiodeKjedeId }) => {
    const { sak } = useSak();

    const { sakId, saksnummer } = sak;

    const { meldeperiodeKjede, error, laster } = useHentMeldeperiodeKjede(
        meldeperiodeKjedeId,
        sakId,
    );

    if (laster) {
        return <Loader />;
    }

    if (error) {
        console.error(error.message);
    }

    // TODO: selector komponent for å velge blant flere instanser av meldeperioden
    const valgtMeldeperiode = meldeperiodeKjede?.meldeperioder?.[0];

    return (
        <VStack>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer}>
                <Button as={Link} href={`/sak/${saksnummer}`} type="submit" size="small">
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

type Props = {
    meldeperiodeKjedeId: MeldeperiodeKjedeId;
    sak: Sak;
};

const SakWrapper = ({ meldeperiodeKjedeId, sak }: Props) => {
    return (
        <SakProvider sak={sak}>
            <Meldekort meldeperiodeKjedeId={meldeperiodeKjedeId} />
        </SakProvider>
    );
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const sak = await fetchSak(context.req, context.params!.saksnummer as string);

    return {
        props: {
            sak,
            meldeperiodeKjedeId: context.params!.meldeperiodeId,
        },
    };
});

export default SakWrapper;
