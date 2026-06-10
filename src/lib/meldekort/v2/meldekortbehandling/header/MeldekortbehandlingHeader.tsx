import { Heading, HStack, VStack } from '@navikt/ds-react';
import { useSak } from '~/lib/sak/SakContext';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { formaterDatotekst } from '~/utils/date';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';
import { MeldekortbehandlingStatusTags } from '~/lib/meldekort/v2/meldekortbehandling/header/status/MeldekortbehandlingStatusTags';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';
import { MeldekortbehandlingLagre } from '~/lib/meldekort/v2/meldekortbehandling/lagre/MeldekortbehandlingLagre';
import { MeldekortbehandlingHandlingerMeny } from '~/lib/meldekort/v2/meldekortbehandling/handlinger-meny/MeldekortbehandlingHandlingerMeny';

import style from './MeldekortbehandlingHeader.module.css';

export const MeldekortbehandlingHeader = () => {
    const { førsteDagSomGirRett, sisteDagSomGirRett, kanSendeInnHelgForMeldekort } = useSak().sak;

    const { erReadonly } = useMeldekortbehandlingSkjema();

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

            <MeldekortbehandlingSeksjon.Høyre>
                <HStack gap={'space-16'} justify={'space-between'}>
                    <VStack gap={'space-8'}>
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
                    </VStack>
                    <VStack justify={'end'} gap={'space-8'} className={style.handlinger}>
                        <MeldekortbehandlingHandlingerMeny />
                        {!erReadonly && <MeldekortbehandlingLagre />}
                    </VStack>
                </HStack>
            </MeldekortbehandlingSeksjon.Høyre>
        </MeldekortbehandlingSeksjon>
    );
};
