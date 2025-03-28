import { HStack } from '@navikt/ds-react';
import router from 'next/router';
import React from 'react';
import { useRevurderingBehandling } from '../../../BehandlingContext';
import { BehandlingStatus } from '../../../../../types/BehandlingTypes';
import AvsluttBehandling from '../../../../saksoversikt/avsluttBehandling/AvsluttBehandling';
import { VedtakSeksjon } from '../../../vedtak-layout/seksjon/VedtakSeksjon';

import styles from './RevurderingStansAvbrytBehandling.module.css';

const RevurderingStansAvbrytBehandling = () => {
    const { behandling } = useRevurderingBehandling();

    if (
        behandling.status === BehandlingStatus.UNDER_BESLUTNING ||
        behandling.status === BehandlingStatus.KLAR_TIL_BESLUTNING ||
        behandling.status === BehandlingStatus.VEDTATT
    ) {
        return null;
    }

    return (
        <VedtakSeksjon.Høyre className={styles.vedtakContainer}>
            <HStack justify="end">
                <AvsluttBehandling
                    saksnummer={behandling.saksnummer}
                    behandlingsId={behandling.id}
                    button={{
                        size: 'medium',
                        alignment: 'end',
                    }}
                    onSuccess={() => {
                        router.push(`/sak/${behandling.saksnummer}`);
                    }}
                />
            </HStack>
        </VedtakSeksjon.Høyre>
    );
};

export default RevurderingStansAvbrytBehandling;
