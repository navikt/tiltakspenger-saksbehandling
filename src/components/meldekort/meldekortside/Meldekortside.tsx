import { Heading, HStack, VStack } from '@navikt/ds-react';
import { meldekortHeading } from '../../../utils/date';
import {
    BrukersMeldekort,
    BrukersMeldekortDagStatus,
    Meldeperiode,
    MeldeperiodeKjede,
    Meldeperiodestatus,
} from '../../../types/MeldekortTypes';
import Meldekort from './Meldekort';
import Meldekortoppsummering from './Meldekortoppsummering';
import { BrukersMeldekortVisning } from './BrukersMeldekort';

import styles from './Meldekort.module.css';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjede;
};

export const Meldekortside = ({ meldeperiodeKjede }: Props) => {
    // TODO: skal kunne velge element i kjeden
    const meldeperiode = meldeperiodeKjede.meldeperioder[0];
    const brukersMeldekort = meldeperiode.brukersMeldekort || brukersMeldekortDummy(meldeperiode);

    console.log(brukersMeldekort);

    return (
        <VStack gap="5" className={styles.wrapper}>
            <HStack gap={'5'}>
                <VStack gap="5">
                    <Heading level="2" size="medium">
                        {meldekortHeading(meldeperiodeKjede.periode)}
                    </Heading>
                    {erBehandlet(meldeperiode) ? (
                        <Meldekortoppsummering meldeperiode={meldeperiode} />
                    ) : (
                        <Meldekort
                            meldeperiodeKjede={meldeperiodeKjede}
                            meldekortBehandling={meldeperiode.meldekortBehandling}
                        />
                    )}
                </VStack>
                {brukersMeldekort ? (
                    <BrukersMeldekortVisning
                        meldeperiode={meldeperiode}
                        brukersMeldekort={brukersMeldekort}
                    />
                ) : (
                    <Heading size={'small'}>{'Ingen innmelding mottatt fra bruker'}</Heading>
                )}
            </HStack>
        </VStack>
    );
};

const erBehandlet = (meldeperiode: Meldeperiode) =>
    meldeperiode.status === Meldeperiodestatus.GODKJENT ||
    meldeperiode.status === Meldeperiodestatus.KLAR_TIL_BESLUTNING;

const brukersMeldekortDummy = (meldeperiode: Meldeperiode): BrukersMeldekort => ({
    id: 'asdf',
    mottatt: new Date().toLocaleDateString(),
    dager: [
        { dato: '2025-01-06', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-07', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-08', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-09', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-10', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-11', status: BrukersMeldekortDagStatus.IKKE_REGISTRERT },
        { dato: '2025-01-12', status: BrukersMeldekortDagStatus.IKKE_REGISTRERT },
        { dato: '2025-01-13', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-14', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-15', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-16', status: BrukersMeldekortDagStatus.FRAVÆR_SYK },
        { dato: '2025-01-17', status: BrukersMeldekortDagStatus.FRAVÆR_SYK },
        { dato: '2025-01-18', status: BrukersMeldekortDagStatus.IKKE_REGISTRERT },
        { dato: '2025-01-19', status: BrukersMeldekortDagStatus.IKKE_REGISTRERT },
    ],
});
