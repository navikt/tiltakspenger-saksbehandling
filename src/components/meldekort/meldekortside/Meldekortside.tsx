import { Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { meldekortHeading } from '../../../utils/date';
import {
    BrukersMeldekort,
    BrukersMeldekortDagStatus,
    MeldekortBehandlingStatus,
    Meldeperiode,
    MeldeperiodeKjede,
    Meldeperiodestatus,
} from '../../../types/MeldekortTypes';
import Meldekort from './Meldekort';
import Meldekortoppsummering from './Meldekortoppsummering';
import { BrukersMeldekortVisning } from './BrukersMeldekort';
import { useState } from 'react';

import styles from './Meldekort.module.css';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjede;
};

export const Meldekortside = ({ meldeperiodeKjede }: Props) => {
    const [startetBehandling, setStartetBehandling] = useState(false);

    // TODO: skal kunne velge element i kjeden
    // const meldeperiode = meldeperiodeKjede.meldeperioder[0];
    const meldeperiode = startetBehandling
        ? dummyMeldeperiodeMedUtfylling(meldeperiodeKjede.meldeperioder[0])
        : dummyMeldeperiodeIkkebehandlet(meldeperiodeKjede.meldeperioder[0]);

    const brukersMeldekort = meldeperiode.brukersMeldekort || brukersMeldekortDummy(meldeperiode);

    return (
        <VStack gap="5" className={styles.wrapper}>
            <HStack gap={'5'}>
                <VStack gap="5">
                    <Heading level="2" size="medium">
                        {meldekortHeading(meldeperiodeKjede.periode)}
                    </Heading>
                    {erBehandlet(meldeperiode) ? (
                        <Meldekortoppsummering meldeperiode={meldeperiode} />
                    ) : kanBehandles(meldeperiode) ? (
                        <Meldekort
                            meldeperiodeKjede={meldeperiodeKjede}
                            meldekortBehandling={meldeperiode.meldekortBehandling}
                        />
                    ) : (
                        <Button onClick={() => setStartetBehandling(true)}>
                            {'Opprett behandling'}
                        </Button>
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

const kanBehandles = (meldeperiode: Meldeperiode) =>
    meldeperiode.status === Meldeperiodestatus.KLAR_TIL_BEHANDLING;

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

const dummyMeldeperiodeIkkebehandlet = (meldeperiode: Meldeperiode): Meldeperiode => ({
    ...meldeperiode,
    status: Meldeperiodestatus.VENTER_PÅ_UTFYLLING,
    meldekortBehandling: undefined,
    brukersMeldekort: brukersMeldekortDummy(meldeperiode),
});

const dummyMeldeperiodeMedUtfylling = (meldeperiode: Meldeperiode): Meldeperiode => ({
    ...meldeperiode,
    status: Meldeperiodestatus.KLAR_TIL_BEHANDLING,
    meldekortBehandling: {
        ...meldeperiode.meldekortBehandling,
        status: MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING,
    },
    brukersMeldekort: brukersMeldekortDummy(meldeperiode),
});
