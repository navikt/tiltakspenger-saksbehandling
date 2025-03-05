import { HStack } from '@navikt/ds-react';
import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import AvsluttBehandling from '../../../saksoversikt/avsluttBehandling/AvsluttBehandling';
import router from 'next/router';
import React from 'react';
import { useFørstegangsbehandling } from '../../BehandlingContext';
import styles from './FørstegangsvedtakAvbrytBehandling.module.css';

const FørstegangsvedtakAvbrytBehandling = () => {
    const { behandling } = useFørstegangsbehandling();

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
                        console.log('router.psuh');
                        router.push(`/sak/${behandling.saksnummer}`);
                    }}
                />
            </HStack>
        </VedtakSeksjon.Høyre>
    );
};

export default FørstegangsvedtakAvbrytBehandling;
