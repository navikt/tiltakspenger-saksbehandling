import { ReactElement } from 'react';
import { logger } from '@navikt/next-logger';
import router from 'next/router';
import { Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { CheckmarkCircleIcon, EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { nonNullish } from '~/utils/object';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { saksnummerFraPageContext } from '~/lib/sak/Saksnummer';
import { SakProps } from '~/lib/sak/SakTyper';
import { Klagebehandling, KlageId } from '~/lib/klage/typer/Klage';
import KlageLayout, { KlageProvider, useKlage } from '../../layout';
import { finnNesteKlageSteg, KlageSteg } from '~/lib/klage/utils/KlageLayoutUtils';
import KlageForvaltningsmelding from '~/lib/klage/forvaltningsmelding/KlageForvaltningsmelding';
import styles from './index.module.css';

type Props = {
    sak: SakProps;
    initialKlage: Klagebehandling;
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const saksnummer = saksnummerFraPageContext(context);

    if (!saksnummer) {
        return {
            notFound: true,
        };
    }

    const klageId = nonNullish(context.params).klageId as KlageId;

    const sak = await fetchSak(context.req, saksnummer).catch((e) => {
        logger.error(`Feil under henting av sak med saksnummer ${saksnummer} - ${e.toString()}`);
        throw e;
    });

    const initialKlage = sak.klagebehandlinger.find((klage) => klage.id === klageId);

    if (!initialKlage) {
        logger.error(`Fant ikke klage ${klageId} på sak ${sak.sakId}`);

        return {
            notFound: true,
        };
    }

    return {
        props: {
            sak,
            initialKlage,
        } satisfies Props,
    };
});

const ForvaltningsmeldingKlagePage = () => {
    const { klage, setKlage } = useKlage();

    return (
        <VStack className={styles.formContainer}>
            <VStack marginBlock="space-32" gap="space-16">
                <HStack gap="space-8" align="start">
                    {klage.forvaltningsmelding ? (
                        <CheckmarkCircleIcon title="Sjekk ikon" fontSize="1.5rem" color="green" />
                    ) : (
                        <EnvelopeClosedIcon title="Konvolutt ikon" fontSize="1.5rem" />
                    )}
                    <Heading size="small">Forvaltningsmelding</Heading>
                </HStack>
            </VStack>

            <KlageForvaltningsmelding klage={klage} onSendt={setKlage} />

            <VStack marginBlock="space-32" align="start">
                <Button
                    type="button"
                    onClick={() =>
                        router.push(finnNesteKlageSteg(klage, KlageSteg.FORVALTNINGSMELDING))
                    }
                >
                    Fortsett
                </Button>
            </VStack>
        </VStack>
    );
};

ForvaltningsmeldingKlagePage.getLayout = function getLayout(page: ReactElement) {
    const { sak, initialKlage } = page.props as Props;

    return (
        <KlageProvider initialKlage={initialKlage}>
            <KlageLayout saksnummer={sak.saksnummer} activeTab={KlageSteg.FORVALTNINGSMELDING}>
                {page}
            </KlageLayout>
        </KlageProvider>
    );
};

export default ForvaltningsmeldingKlagePage;
