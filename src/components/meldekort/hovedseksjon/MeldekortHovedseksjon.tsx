import { HStack, VStack } from '@navikt/ds-react';
import { BrukersMeldekortVisning } from './brukers-meldekort/BrukersMeldekort';
import { useMeldeperiodeKjede } from '../context/MeldeperiodeKjedeContext';
import { MeldekortBehandling } from './meldekort-behandling/MeldekortBehandling';
import { MeldekortOppsummeringVelger } from './meldekort-behandling/oppsummering/velger/MeldekortOppsummeringVelger';
import { MeldekortKorrigertFraTidligerePeriode } from './meldekort-behandling/korrigert-fra-tidligere/MeldekortKorrigertFraTidligerePeriode';

import styles from './MeldekortHovedseksjon.module.css';

export const MeldekortHovedseksjon = () => {
    const {
        meldeperiodeKjede,
        sisteMeldeperiode,
        sisteMeldekortBehandling,
        tidligereMeldekortBehandlinger,
    } = useMeldeperiodeKjede();

    const { brukersMeldekort, korrigeringFraTidligerePeriode } = meldeperiodeKjede;

    return (
        <VStack gap={'5'} className={styles.wrapper}>
            <HStack gap={'5'}>
                {sisteMeldekortBehandling && (
                    <MeldekortBehandling meldekortBehandling={sisteMeldekortBehandling} />
                )}
                {korrigeringFraTidligerePeriode && (
                    <MeldekortKorrigertFraTidligerePeriode
                        korrigering={korrigeringFraTidligerePeriode}
                    />
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
