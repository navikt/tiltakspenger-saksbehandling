import { Heading, HStack, VStack } from '@navikt/ds-react';
import { meldekortHeading } from '../../../utils/date';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
} from '../../../types/meldekort/MeldekortBehandling';
import { MeldekortBehandling } from './meldekort-behandling/behandling/MeldekortBehandling';
import { MeldekortBehandlingOppsummering } from './meldekort-behandling/MeldekortBehandlingOppsummering';
import { BrukersMeldekortVisning } from './BrukersMeldekort';
import { kanSaksbehandleForMeldekort } from '../../../utils/tilganger';
import { useSaksbehandler } from '../../../context/saksbehandler/SaksbehandlerContext';
import { useMeldeperiodeKjede } from '../context/MeldeperiodeKjedeContext';

import styles from './Meldekort.module.css';

export const Meldekortside = () => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { meldeperiodeKjede, valgtMeldeperiode } = useMeldeperiodeKjede();
    const { brukersMeldekort, meldekortBehandlinger } = valgtMeldeperiode;

    const sisteMeldekortBehandling = meldekortBehandlinger.at(-1);

    return (
        <VStack gap={'5'} className={styles.wrapper}>
            <HStack gap={'5'}>
                {brukersMeldekort && (
                    <BrukersMeldekortVisning
                        meldeperiode={valgtMeldeperiode}
                        brukersMeldekort={brukersMeldekort}
                    />
                )}
                {sisteMeldekortBehandling && (
                    <VStack gap={'5'}>
                        <Heading level={'2'} size={'medium'}>
                            {meldekortHeading(meldeperiodeKjede.periode)}
                        </Heading>
                        {kanUtfylles(sisteMeldekortBehandling) &&
                        kanSaksbehandleForMeldekort(
                            sisteMeldekortBehandling,
                            innloggetSaksbehandler,
                        ) ? (
                            <MeldekortBehandling
                                meldeperiode={valgtMeldeperiode}
                                meldekortBehandling={sisteMeldekortBehandling}
                            />
                        ) : (
                            <MeldekortBehandlingOppsummering
                                meldeperiode={valgtMeldeperiode}
                                meldekortBehandling={sisteMeldekortBehandling}
                            />
                        )}
                    </VStack>
                )}
            </HStack>
        </VStack>
    );
};

const kanUtfylles = (
    meldekortBehandling?: MeldekortBehandlingProps,
): meldekortBehandling is MeldekortBehandlingProps =>
    meldekortBehandling?.status === MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING;
