import { Heading, HStack, VStack } from '@navikt/ds-react';
import { meldekortHeading } from '../../../utils/date';
import {
    BrukersMeldekortProps,
    BrukersMeldekortDagStatus,
    MeldekortBehandlingStatus,
    MeldeperiodeProps,
    MeldeperiodeKjedeProps,
    MeldeperiodeStatus,
} from '../../../types/MeldekortTypes';
import { MeldekortBehandlingUtfylling } from './meldekort-behandling/MeldekortBehandlingUtfylling';
import { MeldekortBehandlingOppsummering } from './meldekort-behandling/MeldekortBehandlingOppsummering';
import { BrukersMeldekortVisning } from './BrukersMeldekort';

import styles from './Meldekort.module.css';
import { MeldekortBehandlingOpprett } from './meldekort-behandling/MeldekortBehandlingOpprett';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
};

export const Meldekortside = ({ meldeperiodeKjede }: Props) => {
    // TODO: skal kunne velge element i kjeden
    const meldeperiode = meldeperiodeKjede.meldeperioder[0];

    const brukersMeldekort = meldeperiode.brukersMeldekort; // || brukersMeldekortDummy(meldeperiode);

    return (
        <VStack gap="5" className={styles.wrapper}>
            <HStack gap={'5'}>
                {brukersMeldekort && (
                    <BrukersMeldekortVisning
                        meldeperiode={meldeperiode}
                        brukersMeldekort={brukersMeldekort}
                    />
                )}
                <VStack gap="5">
                    <Heading level="2" size="medium">
                        {meldekortHeading(meldeperiodeKjede.periode)}
                    </Heading>
                    {erBehandlet(meldeperiode) ? (
                        <MeldekortBehandlingOppsummering meldeperiode={meldeperiode} />
                    ) : kanBehandles(meldeperiode) ? (
                        <MeldekortBehandlingUtfylling
                            meldeperiodeKjede={meldeperiodeKjede}
                            meldekortBehandling={meldeperiode.meldekortBehandling}
                        />
                    ) : (
                        <MeldekortBehandlingOpprett meldeperiode={meldeperiode} />
                    )}
                </VStack>
            </HStack>
        </VStack>
    );
};

const kanBehandles = (meldeperiode: MeldeperiodeProps) =>
    meldeperiode.status === MeldeperiodeStatus.KLAR_TIL_BEHANDLING ||
    meldeperiode.status === MeldeperiodeStatus.VENTER_PÅ_UTFYLLING;

const erBehandlet = (meldeperiode: MeldeperiodeProps) =>
    meldeperiode.status === MeldeperiodeStatus.GODKJENT ||
    meldeperiode.status === MeldeperiodeStatus.KLAR_TIL_BESLUTNING;

const brukersMeldekortDummy = (meldeperiode: MeldeperiodeProps): BrukersMeldekortProps => ({
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

const dummyMeldeperiodeIkkebehandlet = (meldeperiode: MeldeperiodeProps): MeldeperiodeProps => ({
    ...meldeperiode,
    status: MeldeperiodeStatus.VENTER_PÅ_UTFYLLING,
    meldekortBehandling: undefined,
    brukersMeldekort: brukersMeldekortDummy(meldeperiode),
});

const dummyMeldeperiodeMedUtfylling = (meldeperiode: MeldeperiodeProps): MeldeperiodeProps => ({
    ...meldeperiode,
    status: MeldeperiodeStatus.KLAR_TIL_BEHANDLING,
    meldekortBehandling: {
        ...meldeperiode.meldekortBehandling,
        status: MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING,
    },
    brukersMeldekort: brukersMeldekortDummy(meldeperiode),
});
