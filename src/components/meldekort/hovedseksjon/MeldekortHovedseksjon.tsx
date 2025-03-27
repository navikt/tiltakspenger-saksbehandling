import { HStack, VStack } from '@navikt/ds-react';
import { BrukersMeldekortVisning } from './brukers-meldekort/BrukersMeldekort';
import { useMeldeperiodeKjede } from '../context/MeldeperiodeKjedeContext';
import { MeldekortBehandling } from './meldekort-behandling/MeldekortBehandling';
import { MeldekortOppsummeringVelger } from './meldekort-behandling/oppsummering/velger/MeldekortOppsummeringVelger';

import styles from './MeldekortHovedseksjon.module.css';

export const MeldekortHovedseksjon = () => {
    const { meldeperiodeKjede, sisteMeldeperiode, sisteMeldekortBehandling } =
        useMeldeperiodeKjede();

    const { brukersMeldekort, meldekortBehandlinger } = meldeperiodeKjede;

    const tidligereBehandlinger =
        sisteMeldekortBehandling &&
        meldekortBehandlinger
            .filter((behandling) => behandling.id !== sisteMeldekortBehandling.id)
            .toSorted((a, b) => (a.opprettet > b.opprettet ? -1 : 1));

    return (
        <VStack gap={'5'} className={styles.wrapper}>
            <HStack gap={'5'}>
                {sisteMeldekortBehandling && (
                    <MeldekortBehandling meldekortBehandling={sisteMeldekortBehandling} />
                )}
                {tidligereBehandlinger && (
                    <MeldekortOppsummeringVelger meldekortBehandlinger={tidligereBehandlinger} />
                )}
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
