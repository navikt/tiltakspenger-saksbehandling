import { Heading, HStack, VStack } from '@navikt/ds-react';
import { meldekortHeading } from '../../../utils/date';
import { MeldekortBehandlingProps, MeldekortBehandlingStatus } from '../../../types/MeldekortTypes';
import { MeldekortBehandlingUtfylling } from './meldekort-behandling/MeldekortBehandlingUtfylling';
import { MeldekortBehandlingOppsummering } from './meldekort-behandling/MeldekortBehandlingOppsummering';
import { BrukersMeldekortVisning } from './BrukersMeldekort';
import { useMeldeperioder } from '../../../hooks/meldekort/meldeperioder-context/useMeldeperioder';

import styles from './Meldekort.module.css';

export const Meldekortside = () => {
    const { meldeperiodeKjede, valgtMeldeperiode } = useMeldeperioder();

    const { brukersMeldekort, meldekortBehandling } = valgtMeldeperiode;

    return (
        <VStack gap="5" className={styles.wrapper}>
            <HStack gap={'5'}>
                {brukersMeldekort && (
                    <BrukersMeldekortVisning
                        meldeperiode={valgtMeldeperiode}
                        brukersMeldekort={brukersMeldekort}
                    />
                )}
                <VStack gap="5">
                    <Heading level="2" size="medium">
                        {meldekortHeading(meldeperiodeKjede.periode)}
                    </Heading>
                    {meldekortBehandling &&
                        (erUnderBehandling(meldekortBehandling) ? (
                            <MeldekortBehandlingUtfylling
                                meldekortBehandling={valgtMeldeperiode.meldekortBehandling}
                            />
                        ) : (
                            <MeldekortBehandlingOppsummering meldeperiode={valgtMeldeperiode} />
                        ))}
                </VStack>
            </HStack>
        </VStack>
    );
};

const erUnderBehandling = (meldekortBehandling: MeldekortBehandlingProps) =>
    meldekortBehandling?.status === MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING;
