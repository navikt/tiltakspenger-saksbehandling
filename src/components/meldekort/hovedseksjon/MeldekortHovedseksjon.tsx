import { Heading, HStack, VStack } from '@navikt/ds-react';
import { meldekortHeading } from '../../../utils/date';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
} from '../../../types/meldekort/MeldekortBehandling';
import { MeldekortBehandling } from './meldekort-behandling/behandling/MeldekortBehandling';
import { MeldekortBehandlingOppsummering } from './meldekort-behandling/MeldekortBehandlingOppsummering';
import { BrukersMeldekortVisning } from './brukers-meldekort/BrukersMeldekort';
import { kanSaksbehandleForMeldekort } from '../../../utils/tilganger';
import { useSaksbehandler } from '../../../context/saksbehandler/SaksbehandlerContext';
import { useMeldeperiodeKjede } from '../context/MeldeperiodeKjedeContext';
import { Saksbehandler } from '../../../types/Saksbehandler';

import styles from './MeldekortHovedseksjon.module.css';

export const MeldekortHovedseksjon = () => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { meldeperiodeKjede, sisteMeldeperiode, sisteMeldekortBehandling } =
        useMeldeperiodeKjede();

    const { brukersMeldekort } = meldeperiodeKjede;

    return (
        <VStack gap={'5'} className={styles.wrapper}>
            <HStack gap={'5'}>
                {brukersMeldekort && (
                    <BrukersMeldekortVisning
                        meldeperiode={sisteMeldeperiode}
                        brukersMeldekort={brukersMeldekort}
                    />
                )}
                {sisteMeldekortBehandling && (
                    <VStack gap={'5'}>
                        <Heading level={'2'} size={'medium'}>
                            {meldekortHeading(meldeperiodeKjede.periode)}
                        </Heading>
                        {kanBehandles(sisteMeldekortBehandling, innloggetSaksbehandler) ? (
                            <MeldekortBehandling
                                meldeperiode={sisteMeldeperiode}
                                meldekortBehandling={sisteMeldekortBehandling}
                            />
                        ) : (
                            <MeldekortBehandlingOppsummering
                                meldeperiode={sisteMeldeperiode}
                                meldekortBehandling={sisteMeldekortBehandling}
                            />
                        )}
                    </VStack>
                )}
            </HStack>
        </VStack>
    );
};

const kanBehandles = (
    meldekortBehandling: MeldekortBehandlingProps,
    saksbehandler: Saksbehandler,
) =>
    meldekortBehandling.status === MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING &&
    kanSaksbehandleForMeldekort(meldekortBehandling, saksbehandler);
