import { Heading, HStack, VStack } from '@navikt/ds-react';
import { meldekortHeading } from '../../../utils/date';
import { MeldekortBehandlingProps, MeldekortBehandlingStatus } from '../../../types/MeldekortTypes';
import { MeldekortBehandling } from './meldekort-behandling/behandling/MeldekortBehandling';
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
                {meldekortBehandling && (
                    <VStack gap={'5'}>
                        <Heading level={'2'} size={'medium'}>
                            {meldekortHeading(meldeperiodeKjede.periode)}
                        </Heading>
                        {erUnderBehandling(meldekortBehandling) && kanSaksbehandle ? (
                            <MeldekortBehandling
                                meldekortBehandling={meldekortBehandling}
                                maksAntallDager={valgtMeldeperiode.antallDager}
                                brukersMeldekort={brukersMeldekort}
                            />
                        ) : (
                            <MeldekortBehandlingOppsummering meldeperiode={valgtMeldeperiode} />
                        )}
                    </VStack>
                )}
            </HStack>
        </VStack>
    );
};

const erUnderBehandling = (meldekortBehandling: MeldekortBehandlingProps) =>
    meldekortBehandling?.status === MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING;
