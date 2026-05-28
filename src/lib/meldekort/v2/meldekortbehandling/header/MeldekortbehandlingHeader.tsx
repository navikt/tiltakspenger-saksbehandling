import { Heading, HStack, VStack } from '@navikt/ds-react';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { formaterDatotekst } from '~/utils/date';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';
import React from 'react';
import { MeldekortbehandlingStatusTags } from '~/lib/meldekort/v2/meldekortbehandling/header/status/MeldekortbehandlingStatusTags';

import style from './MeldekortbehandlingHeader.module.css';

export const MeldekortbehandlingHeader = () => {
    const { førsteDagSomGirRett, sisteDagSomGirRett, kanSendeInnHelgForMeldekort } = useSak().sak;

    const meldekortbehandling = useMeldekortbehandling();
    const { saksbehandler, beslutter } = meldekortbehandling;

    return (
        <VStack gap={'space-16'} className={style.outer}>
            <HStack justify={'space-between'}>
                <Heading size={'medium'} level={'1'}>
                    {'Meldekortbehandling'}
                </Heading>
                <MeldekortbehandlingStatusTags meldekortbehandling={meldekortbehandling} />
            </HStack>

            <VStack gap={'space-8'} className={style.summary}>
                <HStack gap={'space-16'}>
                    <DetaljHorisontal navn={'Første dag som gir rett:'}>
                        {førsteDagSomGirRett ? formaterDatotekst(førsteDagSomGirRett) : '-'}
                    </DetaljHorisontal>
                    <DetaljHorisontal navn={'Siste dag som gir rett:'}>
                        {sisteDagSomGirRett ? formaterDatotekst(sisteDagSomGirRett) : '-'}
                    </DetaljHorisontal>
                    <DetaljHorisontal navn={'Kan melde helg:'}>
                        {kanSendeInnHelgForMeldekort ? 'Ja' : 'Nei'}
                    </DetaljHorisontal>
                </HStack>
                <HStack gap={'space-16'}>
                    <DetaljHorisontal navn={'Saksbehandler:'}>
                        {saksbehandler ?? 'Ikke tildelt'}
                    </DetaljHorisontal>
                    <DetaljHorisontal navn={'Beslutter:'}>
                        {beslutter ?? 'Ikke tildelt'}
                    </DetaljHorisontal>
                </HStack>
            </VStack>
        </VStack>
    );
};
