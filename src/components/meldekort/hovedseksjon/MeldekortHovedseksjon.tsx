import { HStack, VStack } from '@navikt/ds-react';
import { BrukersMeldekortVisning } from './brukers-meldekort/BrukersMeldekort';
import { useMeldeperiodeKjede } from '../context/MeldeperiodeKjedeContext';
import { MeldekortBehandling } from './meldekort-behandling/MeldekortBehandling';
import { MeldekortOppsummeringVelger } from './meldekort-behandling/oppsummering/velger/MeldekortOppsummeringVelger';
import { MeldekortKorrigertOppsummering } from './meldekort-behandling/oppsummering/korrigeringer/MeldekortKorrigertOppsummering';

import styles from './MeldekortHovedseksjon.module.css';

export const MeldekortHovedseksjon = () => {
    const {
        meldeperiodeKjede,
        sisteMeldeperiode,
        sisteMeldekortBehandling,
        tidligereMeldekortBehandlinger,
    } = useMeldeperiodeKjede();

    const { brukersMeldekort, korrigering } = meldeperiodeKjede;

    return (
        <VStack gap={'5'} className={styles.wrapper}>
            <HStack gap={'5'}>
                {sisteMeldekortBehandling && (
                    <MeldekortBehandling meldekortBehandling={sisteMeldekortBehandling} />
                )}
                {korrigering && <MeldekortKorrigertOppsummering korrigering={korrigering} />}
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
