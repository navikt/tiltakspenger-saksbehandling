import React, { useRef } from 'react';
import { Alert, BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import NotificationBanner, {
    NotificationBannerRef,
} from '../notificationBanner/NotificationBanner';
import { BenkTabell } from '~/components/benk/tabell/BenkTabell';
import { BenkFilterVelger } from '~/components/benk/filter/BenkFilterVelger';
import { BenkOversiktResponse } from '~/types/Benk';

import styles from './BenkSide.module.css';

type Props = {
    benkOversikt: BenkOversiktResponse;
};

export const BenkSide = ({ benkOversikt }: Props) => {
    const bannerRef = useRef<NotificationBannerRef>(null);

    const { behandlingssammendrag, antallFiltrertPgaTilgang } = benkOversikt;

    return (
        <VStack gap={'space-20'} padding={'space-16'}>
            <NotificationBanner ref={bannerRef} />

            <Heading size="medium" level="2">
                {'Oversikt over åpne behandlinger'}
            </Heading>

            <BenkFilterVelger
                benkOversikt={benkOversikt}
                onUpdateFilter={() => {
                    bannerRef.current?.clearMessage();
                }}
            />

            {benkOversikt.totalAntall > 500 && (
                <div className={styles.høytAntallBehandlingerContainer}>
                    <Alert variant="warning" size="small">
                        Det finnes et høyt antall behandlinger på benken. Oversikten er begrenset,
                        og vil ikke vise alle behandlinger. Totalt antall behandlinger:{' '}
                        {benkOversikt.totalAntall}.
                    </Alert>
                </div>
            )}

            <HStack gap={'space-16'}>
                <BodyShort>{`Antall behandlinger: ${behandlingssammendrag.length}`}</BodyShort>
                {antallFiltrertPgaTilgang > 0 && (
                    <BodyShort>
                        {`Antall behandlinger filtrert vekk pga tilgang: ${antallFiltrertPgaTilgang}`}
                    </BodyShort>
                )}
            </HStack>

            <BenkTabell behandlinger={benkOversikt.behandlingssammendrag} />
        </VStack>
    );
};
