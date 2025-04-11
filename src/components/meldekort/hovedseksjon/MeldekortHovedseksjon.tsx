import { HStack, VStack } from '@navikt/ds-react';
import { BrukersMeldekortVisning } from './brukers-meldekort/BrukersMeldekort';
import { useMeldeperiodeKjede } from '../context/MeldeperiodeKjedeContext';
import { MeldekortBehandling } from './meldekort-behandling/MeldekortBehandling';
import { MeldekortTidligereBehandlinger } from './meldekort-behandling/tidligere-behandlinger/MeldekortTidligereBehandlinger';
import { MeldekortBehandlingStatus } from '../../../types/meldekort/MeldekortBehandling';
import { MeldekortKorrigertFraTidligerePeriode } from './meldekort-behandling/korrigert-fra-tidligere/MeldekortKorrigertFraTidligerePeriode';

import styles from './MeldekortHovedseksjon.module.css';

export const MeldekortHovedseksjon = () => {
    const {
        meldeperiodeKjede,
        sisteMeldeperiode,
        sisteMeldekortBehandling,
        tidligereMeldekortBehandlinger,
        alleMeldekortBehandlinger,
    } = useMeldeperiodeKjede();

    const { brukersMeldekort, korrigeringFraTidligerePeriode } = meldeperiodeKjede;

    const sisteErGodkjent = sisteMeldekortBehandling?.status === MeldekortBehandlingStatus.GODKJENT;

    // Hvis den siste behandlingen er godkjent, og beregningen senere er overstyrt av korrigering på en
    // tidligere periode, så viser vi siste behandling under "tidligere behandlinger", og fremhever
    // korrigeringen som gjeldende beregning
    const skalIkkeViseSisteBehandling = !!korrigeringFraTidligerePeriode && sisteErGodkjent;

    return (
        <VStack gap={'5'} className={styles.wrapper}>
            <HStack gap={'5'}>
                {skalIkkeViseSisteBehandling ? (
                    <MeldekortKorrigertFraTidligerePeriode
                        korrigering={korrigeringFraTidligerePeriode}
                    />
                ) : (
                    sisteMeldekortBehandling && (
                        <MeldekortBehandling meldekortBehandling={sisteMeldekortBehandling} />
                    )
                )}
                <MeldekortTidligereBehandlinger
                    meldekortBehandlinger={
                        skalIkkeViseSisteBehandling
                            ? alleMeldekortBehandlinger
                            : tidligereMeldekortBehandlinger
                    }
                    korrigeringFraTidligerePeriode={
                        !sisteErGodkjent ? korrigeringFraTidligerePeriode : undefined
                    }
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
