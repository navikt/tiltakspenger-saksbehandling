import { Alert, Heading, VStack } from '@navikt/ds-react';
import { kanBeslutteForMeldekort, kanSaksbehandleForMeldekort } from '~/utils/tilganger';
import { MeldekortUtfylling } from './utfylling/MeldekortUtfylling';
import { MeldekortOppsummering } from '../../0-felles-komponenter/meldekort-oppsummering/MeldekortOppsummering';
import { MeldekortTaBeslutning } from './beslutning/MeldekortTaBeslutning';
import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
    MeldekortbehandlingType,
} from '~/types/meldekort/Meldekortbehandling';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';

import style from './Meldekortbehandling.module.css';
import Divider from '~/components/divider/Divider';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
};

export const Meldekortbehandling = ({ meldekortbehandling }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    const { type, status, erAvsluttet } = meldekortbehandling;

    return (
        <VStack gap={'space-20'}>
            <div className={style.toppRad}>
                <Heading level={'3'} size={'medium'}>
                    {erAvsluttet ? 'Siste behandling' : 'Pågående behandling'}
                </Heading>
                {type === MeldekortbehandlingType.KORRIGERING && (
                    <Alert variant={'info'} inline={true} size={'small'}>
                        {'Korrigering'}
                    </Alert>
                )}
                {status === MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET && (
                    <Alert variant={'info'} inline={true} size={'small'}>
                        {'Automatisk behandlet'}
                    </Alert>
                )}
            </div>
            {kanSaksbehandleForMeldekort(meldekortbehandling, innloggetSaksbehandler) ? (
                <MeldekortUtfylling meldekortbehandling={meldekortbehandling} />
            ) : (
                <>
                    <MeldekortOppsummering meldekortbehandling={meldekortbehandling} />
                    <Divider orientation="horizontal" />
                    {kanBeslutteForMeldekort(meldekortbehandling, innloggetSaksbehandler) && (
                        <MeldekortTaBeslutning meldekortbehandling={meldekortbehandling} />
                    )}
                </>
            )}
        </VStack>
    );
};
