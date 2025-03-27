import { Alert, Heading, HStack, VStack } from '@navikt/ds-react';
import { meldekortHeading } from '../../../../utils/date';
import { kanBeslutteForMeldekort, kanSaksbehandleForMeldekort } from '../../../../utils/tilganger';
import { MeldekortUtfylling } from './utfylling/MeldekortUtfylling';
import { MeldekortOppsummering } from './oppsummering/MeldekortOppsummering';
import { MeldekortBeslutning } from './beslutning/MeldekortBeslutning';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingType,
} from '../../../../types/meldekort/MeldekortBehandling';
import { useMeldeperiodeKjede } from '../../context/MeldeperiodeKjedeContext';
import { useSaksbehandler } from '../../../../context/saksbehandler/SaksbehandlerContext';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortBehandling = ({ meldekortBehandling }: Props) => {
    const { meldeperiodeKjede, sisteMeldeperiode } = useMeldeperiodeKjede();
    const { innloggetSaksbehandler } = useSaksbehandler();

    return (
        <VStack gap={'5'}>
            <HStack align={'center'} justify={'space-between'} gap={'5'}>
                <Heading level={'2'} size={'medium'}>
                    {meldekortHeading(meldeperiodeKjede.periode)}
                </Heading>
                {meldekortBehandling.type === MeldekortBehandlingType.KORRIGERING && (
                    <Alert variant={'info'} inline={true}>
                        {'Korrigering'}
                    </Alert>
                )}
            </HStack>
            {kanSaksbehandleForMeldekort(meldekortBehandling, innloggetSaksbehandler) ? (
                <MeldekortUtfylling
                    meldeperiode={sisteMeldeperiode}
                    meldekortBehandling={meldekortBehandling}
                />
            ) : (
                <>
                    <MeldekortOppsummering meldekortBehandling={meldekortBehandling} />
                    {kanBeslutteForMeldekort(meldekortBehandling, innloggetSaksbehandler) && (
                        <MeldekortBeslutning meldekortBehandling={meldekortBehandling} />
                    )}
                </>
            )}
        </VStack>
    );
};
