import { HStack, VStack } from '@navikt/ds-react';
import { BrukersMeldekortVisning } from './brukers-meldekort/BrukersMeldekort';
import { useMeldeperiodeKjede } from '../context/MeldeperiodeKjedeContext';
import { MeldekortBehandling } from './meldekort-behandling/MeldekortBehandling';
import { MeldekortOppsummeringVelger } from './meldekort-behandling/oppsummering/velger/MeldekortOppsummeringVelger';

import styles from './MeldekortHovedseksjon.module.css';

export const MeldekortHovedseksjon = () => {
    const {
        meldeperiodeKjede,
        sisteMeldeperiode,
        sisteMeldekortBehandling,
        tidligereMeldekortBehandlinger,
    } = useMeldeperiodeKjede();

    const { brukersMeldekort } = meldeperiodeKjede;

    return (
        <VStack gap={'5'} className={styles.wrapper}>
            <HStack gap={'5'}>
                {sisteMeldekortBehandling && (
                    <MeldekortBehandling meldekortBehandling={sisteMeldekortBehandling} />
                )}
                <MeldekortOppsummeringVelger
                    meldekortBehandlinger={tidligereMeldekortBehandlinger}
                />
                {brukersMeldekort && (
                    <BrukersMeldekortVisning
                        meldeperiode={sisteMeldeperiode}
                        brukersMeldekort={brukersMeldekort}
                    />
                )}
            </HStack>
        </VStack>
    );
};
