import { Heading, HStack, InlineMessage } from '@navikt/ds-react';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { formaterDatotekst } from '~/utils/date';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';
import React from 'react';
import { MeldekortbehandlingStatusTags } from '~/lib/meldekort/v2/meldekortbehandling/header/status/MeldekortbehandlingStatusTags';
import { meldekortbehandlingTypeTekst } from '~/lib/meldekort/v2/tekster';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';
import { Separator } from '~/lib/_felles/separator/Separator';

import style from './MeldekortbehandlingHeader.module.css';

export const MeldekortbehandlingHeader = () => {
    const { førsteDagSomGirRett, sisteDagSomGirRett, kanSendeInnHelgForMeldekort } = useSak().sak;

    const meldekortbehandling = useMeldekortbehandling();

    const { saksbehandler, beslutter, type } = meldekortbehandling;

    return (
        <MeldekortbehandlingSeksjon className={style.outer}>
            <MeldekortbehandlingSeksjon.Venstre gap={'space-8'}>
                <Heading size={'medium'} level={'1'}>
                    {'Meldekortbehandling'}
                </Heading>

                <InlineMessage status={'info'}>{meldekortbehandlingTypeTekst[type]}</InlineMessage>
            </MeldekortbehandlingSeksjon.Venstre>

            <MeldekortbehandlingSeksjon.Høyre gap={'space-8'}>
                <HStack gap={'space-16'} align={'center'}>
                    <MeldekortbehandlingStatusTags meldekortbehandling={meldekortbehandling} />
                    <DetaljHorisontal navn={'Saksbehandler:'}>
                        {saksbehandler ?? 'Ikke tildelt'}
                    </DetaljHorisontal>
                    <DetaljHorisontal navn={'Beslutter:'}>
                        {beslutter ?? 'Ikke tildelt'}
                    </DetaljHorisontal>
                </HStack>

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
            </MeldekortbehandlingSeksjon.Høyre>

            <MeldekortbehandlingSeksjon.FullBredde>
                <Separator />
            </MeldekortbehandlingSeksjon.FullBredde>
        </MeldekortbehandlingSeksjon>
    );
};
