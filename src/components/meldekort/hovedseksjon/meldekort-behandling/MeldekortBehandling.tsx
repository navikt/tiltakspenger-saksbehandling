import { Accordion, Alert, Heading, VStack } from '@navikt/ds-react';
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
import { MeldekortKorrigertFraTidligerePeriode } from './korrigert-fra-tidligere/MeldekortKorrigertFraTidligerePeriode';
import { Fragment, PropsWithChildren } from 'react';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
    visKorrigeringFraTidligerePeriode: boolean;
};

export const MeldekortBehandling = ({
    meldekortBehandling,
    visKorrigeringFraTidligerePeriode,
}: Props) => {
    const { meldeperiodeKjede } = useMeldeperiodeKjede();
    const { innloggetSaksbehandler } = useSaksbehandler();

    const { periode, korrigeringFraTidligerePeriode } = meldeperiodeKjede;

    const skalViseTidligereKorrigering =
        !!korrigeringFraTidligerePeriode && visKorrigeringFraTidligerePeriode;

    const MeldekortBehandlingWrapper = skalViseTidligereKorrigering
        ? AccordionVedTidligereKorrigering
        : Fragment;

    return (
        <VStack gap={'5'}>
            <Heading level={'2'} size={'medium'}>
                {meldekortHeading(periode)}
            </Heading>
            {skalViseTidligereKorrigering && (
                <MeldekortKorrigertFraTidligerePeriode
                    korrigering={korrigeringFraTidligerePeriode}
                />
            )}
            {meldekortBehandling.type === MeldekortBehandlingType.KORRIGERING && (
                <Alert variant={'info'} inline={true} size={'small'}>
                    {'Korrigering'}
                </Alert>
            )}
            {kanSaksbehandleForMeldekort(meldekortBehandling, innloggetSaksbehandler) ? (
                <MeldekortUtfylling meldekortBehandling={meldekortBehandling} />
            ) : (
                <MeldekortBehandlingWrapper>
                    <MeldekortOppsummering meldekortBehandling={meldekortBehandling} />
                    {kanBeslutteForMeldekort(meldekortBehandling, innloggetSaksbehandler) && (
                        <MeldekortBeslutning meldekortBehandling={meldekortBehandling} />
                    )}
                </MeldekortBehandlingWrapper>
            )}
        </VStack>
    );
};

const AccordionVedTidligereKorrigering = ({ children }: PropsWithChildren) => {
    return (
        <Accordion size={'small'} headingSize={'xsmall'} indent={false}>
            <Accordion.Item>
                <Accordion.Header>{'Vis siste behandling på meldekortet'}</Accordion.Header>
                <Accordion.Content>{children}</Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};
