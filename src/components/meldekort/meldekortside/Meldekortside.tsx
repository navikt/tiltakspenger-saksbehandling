import { Heading, VStack } from '@navikt/ds-react';
import { meldekortHeading } from '../../../utils/date';
import { MeldeperiodeKjede, Meldeperiodestatus } from '../../../types/MeldekortTypes';
import Meldekort from './Meldekort';
import Meldekortoppsummering from './Meldekortoppsummering';

import styles from './Meldekort.module.css';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjede;
};

export const Meldekortside = ({ meldeperiodeKjede }: Props) => {
    // TODO: kan velge element i kjeden
    const meldeperiode = meldeperiodeKjede.meldeperioder[0];

    return (
        <VStack gap="5" className={styles.wrapper}>
            <Heading level="2" size="medium">
                {meldekortHeading(meldeperiodeKjede.periode)}
            </Heading>
            {meldeperiode.status != Meldeperiodestatus.GODKJENT ? (
                <Meldekortoppsummering meldeperiode={meldeperiode} />
            ) : (
                <Meldekort
                    meldeperiodeKjede={meldeperiodeKjede}
                    meldekortBehandling={meldeperiode.meldekortBehandling}
                />
            )}
        </VStack>
    );
};
