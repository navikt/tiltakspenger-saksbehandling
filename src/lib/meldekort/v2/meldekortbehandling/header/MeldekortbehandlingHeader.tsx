import { Heading, HStack } from '@navikt/ds-react';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { formaterDatotekst } from '~/utils/date';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';
import { MeldekortbehandlingStatusTags } from '~/lib/meldekort/v2/meldekortbehandling/header/status/MeldekortbehandlingStatusTags';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';

import style from './MeldekortbehandlingHeader.module.css';

export const MeldekortbehandlingHeader = () => {
    const { førsteDagSomGirRett, sisteDagSomGirRett, kanSendeInnHelgForMeldekort } = useSak().sak;

    const meldekortbehandling = useMeldekortbehandling();

    const { saksbehandler, beslutter } = meldekortbehandling;

    return (
        <MeldekortbehandlingSeksjon className={style.outer}>
            <MeldekortbehandlingSeksjon.Venstre gap={'space-16'}>
                <Heading size={'medium'} level={'1'}>
                    {'Meldekortbehandling'}
                </Heading>

                <MeldekortbehandlingStatusTags meldekortbehandling={meldekortbehandling} />
            </MeldekortbehandlingSeksjon.Venstre>

            <MeldekortbehandlingSeksjon.Høyre gap={'space-8'}>
                <HStack gap={'space-16'}>
                    <DetaljHorisontal navn={'Saksbehandler:'}>
                        {saksbehandler ?? 'Ikke tildelt'}
                    </DetaljHorisontal>
                    <DetaljHorisontal navn={'Beslutter:'}>
                        {beslutter ?? 'Ikke tildelt'}
                    </DetaljHorisontal>
                </HStack>

                <HStack gap={'space-16'}>
                    <DetaljHorisontal navn={'Første dag med rett:'}>
                        {førsteDagSomGirRett ? formaterDatotekst(førsteDagSomGirRett) : '-'}
                    </DetaljHorisontal>
                    <DetaljHorisontal navn={'Siste dag med rett:'}>
                        {sisteDagSomGirRett ? formaterDatotekst(sisteDagSomGirRett) : '-'}
                    </DetaljHorisontal>
                </HStack>
                <HStack>
                    <DetaljHorisontal navn={'Kan melde helg:'}>
                        {kanSendeInnHelgForMeldekort ? 'Ja' : 'Nei'}
                    </DetaljHorisontal>
                </HStack>
            </MeldekortbehandlingSeksjon.Høyre>
        </MeldekortbehandlingSeksjon>
    );
};
