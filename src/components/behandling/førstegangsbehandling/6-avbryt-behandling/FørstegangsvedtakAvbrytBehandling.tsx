import { HStack } from '@navikt/ds-react';
import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import AvsluttBehandling from '../../../saksoversikt/avsluttBehandling/AvsluttBehandling';

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
                />
            </HStack>
        </VedtakSeksjon.Høyre>
    );
};

export default FørstegangsvedtakAvbrytBehandling;
