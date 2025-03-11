import { HStack } from '@navikt/ds-react';
import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import AvsluttBehandling from '../../../saksoversikt/avsluttBehandling/AvsluttBehandling';
import router from 'next/router';
import React from 'react';
import { useFørstegangsbehandling } from '../../BehandlingContext';
import styles from './FørstegangsvedtakAvbrytBehandling.module.css';
import { BehandlingStatus } from '../../../../types/BehandlingTypes';

const FørstegangsvedtakAvbrytBehandling = () => {
    const { behandling } = useFørstegangsbehandling();

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

export default FørstegangsvedtakAvbrytBehandling;
