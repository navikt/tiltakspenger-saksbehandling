import React, { useRef } from 'react';
import { Alert, BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import NotificationBanner, {
    NotificationBannerRef,
} from '../notificationBanner/NotificationBanner';
import { BenkTabell } from '~/components/benk/tabell/BenkTabell';
import { BenkFilterVelger } from '~/components/benk/filter/BenkFilterVelger';
import {
    BenkKolonne,
    BenkOversiktResponse,
    BenkSortering,
    BenkSorteringRetning,
} from '~/types/Benk';
import { Nullable } from '~/types/UtilTypes';

import styles from './BenkSide.module.css';

type Props = {
    benkOversikt: BenkOversiktResponse;
};

export const BenkSide = ({ benkOversikt }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bannerRef = useRef<NotificationBannerRef>(null);

    const sorteringRetningParam = searchParams.get('sortering') as Nullable<BenkSorteringRetning>;

    const { behandlingssammendrag, antallFiltrertPgaTilgang } = benkOversikt;

    // const handleOppdaterFilter = () => {
    //     bannerRef.current?.clearMessage();
    // };

    return (
        <VStack gap="space-20" style={{ padding: '1rem' }}>
            <NotificationBanner ref={bannerRef} />

            <Heading size="medium" level="2">
                Oversikt over behandlinger og søknader
            </Heading>

            <BenkFilterVelger benkOversikt={benkOversikt} />

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

            <BenkTabell
                behandlinger={benkOversikt.behandlingssammendrag}
                sorteringRetningInitial={sorteringRetningParam ?? BenkSorteringRetning.ASC}
                onSortChange={(kolonne, sorteringRetning) => {
                    const sortering: BenkSortering = `${kolonne},${sorteringRetning}`;

                    const erDefaultSortering = sortering === `${BenkKolonne.startet},ASC`;

                    const currentParams = new URLSearchParams(searchParams.toString());

                    if (erDefaultSortering) {
                        currentParams.delete('sortering');
                    } else {
                        currentParams.set('sortering', sortering);
                    }

                    router.push({
                        pathname: router.pathname,
                        search: currentParams.toString(),
                    });
                }}
            />
        </VStack>
    );
};
