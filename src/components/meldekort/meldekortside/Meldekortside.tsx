import { Heading, HStack, VStack } from '@navikt/ds-react';
import { meldekortHeading } from '../../../utils/date';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
} from '../../../types/meldekort/MeldekortBehandling';
import { MeldekortBehandling } from './meldekort-behandling/behandling/MeldekortBehandling';
import { MeldekortBehandlingOppsummering } from './meldekort-behandling/MeldekortBehandlingOppsummering';
import { BrukersMeldekortVisning } from './BrukersMeldekort';
import { useMeldeperioder } from '../../../hooks/meldekort/useMeldeperioder';
import { kanSaksbehandleForMeldekort } from '../../../utils/tilganger';
import { useSaksbehandler } from '../../../context/saksbehandler/useSaksbehandler';

import styles from './Meldekort.module.css';

import {
    MeldeperiodeMedBehandlingProps,
    MeldeperiodeProps,
} from '../../../types/meldekort/Meldeperiode';

export const Meldekortside = () => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { meldeperiodeKjede, valgtMeldeperiode } = useMeldeperioder();
    const { brukersMeldekort, meldekortBehandling } = valgtMeldeperiode;

    return (
        <VStack gap={'5'} className={styles.wrapper}>
            <HStack gap={'5'}>
                {brukersMeldekort && (
                    <BrukersMeldekortVisning
                        meldeperiode={valgtMeldeperiode}
                        brukersMeldekort={brukersMeldekort}
                    />
                )}
                {harBehandling(valgtMeldeperiode) && (
                    <VStack gap={'5'}>
                        <Heading level={'2'} size={'medium'}>
                            {meldekortHeading(meldeperiodeKjede.periode)}
                        </Heading>
                        {kanUtfylles(meldekortBehandling) &&
                        kanSaksbehandleForMeldekort(meldekortBehandling, innloggetSaksbehandler) ? (
                            <MeldekortBehandling meldeperiode={valgtMeldeperiode} />
                        ) : (
                            <MeldekortBehandlingOppsummering meldeperiode={valgtMeldeperiode} />
                        )}
                    </VStack>
                )}
            </HStack>
        </VStack>
    );
};

const harBehandling = (
    meldeperiode: MeldeperiodeProps,
): meldeperiode is MeldeperiodeMedBehandlingProps => !!meldeperiode.meldekortBehandling;

const kanUtfylles = (
    meldekortBehandling?: MeldekortBehandlingProps,
): meldekortBehandling is MeldekortBehandlingProps =>
    meldekortBehandling?.status === MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING;
