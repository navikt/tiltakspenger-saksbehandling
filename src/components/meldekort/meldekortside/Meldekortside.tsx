import { Heading, HStack, VStack } from '@navikt/ds-react';
import { meldekortHeading } from '../../../utils/date';
import { MeldekortBehandlingProps, MeldekortBehandlingStatus } from '../../../types/MeldekortTypes';
import { MeldekortBehandlingUtfylling } from './meldekort-behandling/MeldekortBehandlingUtfylling';
import { MeldekortBehandlingOppsummering } from './meldekort-behandling/MeldekortBehandlingOppsummering';
import { BrukersMeldekortVisning } from './BrukersMeldekort';
import { useMeldeperioder } from '../../../hooks/meldekort/useMeldeperioder';
import { kanSaksbehandleMeldekort } from '../../../utils/tilganger';
import { useSaksbehandler } from '../../../hooks/useSaksbehandler';

import styles from './Meldekort.module.css';

export const Meldekortside = () => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { meldeperiodeKjede, valgtMeldeperiode } = useMeldeperioder();
    const { brukersMeldekort, meldekortBehandling } = valgtMeldeperiode;

    const kanSaksbehandle = kanSaksbehandleMeldekort(
        meldekortBehandling.status,
        innloggetSaksbehandler,
        innloggetSaksbehandler.navIdent,
    );

    return (
        <VStack gap={'5'} className={styles.wrapper}>
            <HStack gap={'5'}>
                {brukersMeldekort && (
                    <BrukersMeldekortVisning
                        meldeperiode={valgtMeldeperiode}
                        brukersMeldekort={brukersMeldekort}
                    />
                )}
                <VStack gap={'5'}>
                    <Heading level={'2'} size={'medium'}>
                        {meldekortHeading(meldeperiodeKjede.periode)}
                    </Heading>
                    {meldekortBehandling &&
                        (erUnderBehandling(meldekortBehandling) && kanSaksbehandle ? (
                            <MeldekortBehandlingUtfylling
                                meldekortBehandling={meldekortBehandling}
                                brukersMeldekort={brukersMeldekort}
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
