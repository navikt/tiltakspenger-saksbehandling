import { Alert, Heading, VStack } from '@navikt/ds-react';
import { kanBeslutteForMeldekort, kanSaksbehandleForMeldekort } from '~/utils/tilganger';
import { MeldekortUtfylling } from './utfylling/MeldekortUtfylling';
import { MeldekortOppsummering } from '../../0-felles-komponenter/meldekort-oppsummering/MeldekortOppsummering';
import { MeldekortTaBeslutning } from './beslutning/MeldekortTaBeslutning';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
    MeldekortBehandlingType,
} from '~/types/meldekort/MeldekortBehandling';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';

import style from './MeldekortBehandling.module.css';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
    kanMeldeInnForHelg: boolean;
};

export const MeldekortBehandling = ({ meldekortBehandling, kanMeldeInnForHelg }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    const { type, status, erAvsluttet } = meldekortBehandling;

    return (
        <VStack gap={'5'}>
            <div className={style.toppRad}>
                <Heading level={'3'} size={'medium'}>
                    {erAvsluttet ? 'Siste behandling' : 'Pågående behandling'}
                </Heading>
                {type === MeldekortBehandlingType.KORRIGERING && (
                    <Alert variant={'info'} inline={true} size={'small'}>
                        {'Korrigering'}
                    </Alert>
                )}
                {status === MeldekortBehandlingStatus.AUTOMATISK_BEHANDLET && (
                    <Alert variant={'info'} inline={true} size={'small'}>
                        {'Automatisk behandlet'}
                    </Alert>
                )}
            </div>
            {kanSaksbehandleForMeldekort(meldekortBehandling, innloggetSaksbehandler) ? (
                <MeldekortUtfylling
                    meldekortBehandling={meldekortBehandling}
                    kanMeldeInnForHelg={kanMeldeInnForHelg}
                />
            ) : (
                <>
                    <MeldekortOppsummering
                        meldekortBehandling={meldekortBehandling}
                        kanSendeInnHelgForMeldekort={kanMeldeInnForHelg}
                    />
                    {kanBeslutteForMeldekort(meldekortBehandling, innloggetSaksbehandler) && (
                        <MeldekortTaBeslutning meldekortBehandling={meldekortBehandling} />
                    )}
                </>
            )}
        </VStack>
    );
};
