import React, { useRef } from 'react';
import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import NotificationBanner, {
    NotificationBannerRef,
} from '../notificationBanner/NotificationBanner';
import { BenkTabell } from '~/lib/benk/tabell/BenkTabell';
import { BenkFilterVelger } from '~/lib/benk/filter/BenkFilterVelger';
import { BenkOversiktProps } from '~/types/Benk';

import styles from './BenkSide.module.css';

type Props = {
    benkOversikt: BenkOversiktProps;
};

export const BenkSide = ({ benkOversikt }: Props) => {
    const bannerRef = useRef<NotificationBannerRef>(null);

    const {
        behandlingssammendrag,
        antallFiltrertPgaTilgang,
        totalAntallUfiltrert,
        totalAntall,
        limit,
    } = benkOversikt;

    const antallBehandlinger = behandlingssammendrag.length;

    const antallOverLimit = Math.max(totalAntall - limit, 0);

    const antallFiltrertAvFiltervalg = totalAntallUfiltrert - totalAntall;

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

            {antallOverLimit > 0 && (
                <Alert variant={'warning'} size={'small'} className={styles.høytAntallBehandlinger}>
                    {`Det finnes et høyt antall behandlinger på benken, vi viser maks ${limit}. `}
                    {`Totalt antall behandlinger: ${totalAntall}.`}
                </Alert>
            )}

            <VStack gap={'space-4'}>
                <BodyShort>{`Viser ${antallBehandlinger} av ${totalAntallUfiltrert} behandlinger`}</BodyShort>

                {antallFiltrertAvFiltervalg > 0 && (
                    <Alert variant={'info'} size={'small'} inline={true}>
                        {`${antallFiltrertAvFiltervalg} filtrert vekk av valgte filtre`}
                    </Alert>
                )}

                {antallFiltrertPgaTilgang > 0 && (
                    <Alert variant={'warning'} size={'small'} inline={true}>
                        {`${antallFiltrertPgaTilgang} filtrert vekk pga manglende tilgang`}
                    </Alert>
                )}
            </VStack>

            <BenkTabell behandlinger={benkOversikt.behandlingssammendrag} />
        </VStack>
    );
};
