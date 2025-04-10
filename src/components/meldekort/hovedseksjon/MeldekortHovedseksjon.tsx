import { HStack, VStack } from '@navikt/ds-react';
import { BrukersMeldekortVisning } from './brukers-meldekort/BrukersMeldekort';
import { useMeldeperiodeKjede } from '../context/MeldeperiodeKjedeContext';
import { MeldekortBehandling } from './meldekort-behandling/MeldekortBehandling';
import { MeldekortTidligereBehandlinger } from './meldekort-behandling/tidligere-behandlinger/MeldekortTidligereBehandlinger';

import styles from './MeldekortHovedseksjon.module.css';
import { MeldekortBehandlingStatus } from '../../../types/meldekort/MeldekortBehandling';

export const MeldekortHovedseksjon = () => {
    const {
        meldeperiodeKjede,
        sisteMeldeperiode,
        sisteMeldekortBehandling,
        tidligereMeldekortBehandlinger,
    } = useMeldeperiodeKjede();

    const { brukersMeldekort } = meldeperiodeKjede;

    // Hvis den siste behandlingen av meldekortet er godkjent, ønsker vi å vise en evt korrigering
    // fra en tidligere kjede ovenfor dette. Dersom meldekortet er under behandling viser vi heller
    // denne korrigeringen ovenfor de tidligere behandlingene.
    const sisteBehandlingErGodkjent =
        sisteMeldekortBehandling?.status === MeldekortBehandlingStatus.GODKJENT;

    return (
        <VStack gap={'5'} className={styles.wrapper}>
            <HStack gap={'5'}>
                {sisteMeldekortBehandling && (
                    <MeldekortBehandling
                        meldekortBehandling={sisteMeldekortBehandling}
                        visKorrigeringFraTidligerePeriode={sisteBehandlingErGodkjent}
                    />
                )}
                <MeldekortTidligereBehandlinger
                    meldekortBehandlinger={tidligereMeldekortBehandlinger}
                    visKorrigeringFraTidligerePeriode={!sisteBehandlingErGodkjent}
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
