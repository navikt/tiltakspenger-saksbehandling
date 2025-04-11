import { Alert, Heading, VStack } from '@navikt/ds-react';
import { kanBeslutteForMeldekort, kanSaksbehandleForMeldekort } from '../../../../utils/tilganger';
import { MeldekortUtfylling } from './utfylling/MeldekortUtfylling';
import { MeldekortOppsummering } from './oppsummering/MeldekortOppsummering';
import { MeldekortBeslutning } from './beslutning/MeldekortBeslutning';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
    MeldekortBehandlingType,
} from '../../../../types/meldekort/MeldekortBehandling';
import { useSaksbehandler } from '../../../../context/saksbehandler/SaksbehandlerContext';
import React from 'react';

import style from './MeldekortBehandling.module.css';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortBehandling = ({ meldekortBehandling }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    const { type, status } = meldekortBehandling;

    return (
        <VStack gap={'5'}>
            <div className={style.toppRad}>
                <Heading level={'3'} size={'medium'}>
                    {status === MeldekortBehandlingStatus.GODKJENT
                        ? 'Siste behandling'
                        : 'Pågående behandling'}
                </Heading>
                {type === MeldekortBehandlingType.KORRIGERING && (
                    <Alert variant={'info'} inline={true} size={'small'}>
                        {'Korrigering'}
                    </Alert>
                )}
            </div>
            {kanSaksbehandleForMeldekort(meldekortBehandling, innloggetSaksbehandler) ? (
                <MeldekortUtfylling meldekortBehandling={meldekortBehandling} />
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
