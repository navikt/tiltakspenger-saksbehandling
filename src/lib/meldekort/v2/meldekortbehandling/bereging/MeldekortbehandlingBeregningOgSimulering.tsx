import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';
import {
    MeldekortbehandlingStatus,
    MeldeperiodebehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { BeregningOppsummering } from '~/lib/beregning-og-simulering/beregning-oppsummering/BeregningOppsummering';
import { SimuleringOppsummering } from '~/lib/beregning-og-simulering/simulering-oppsummering/SimuleringOppsummering';
import { SimulertBeregningDetaljerTabell } from '~/lib/beregning-og-simulering/detaljer/SimulertBeregningDetaljer';
import { BeregningOgSimuleringHeader } from '~/lib/beregning-og-simulering/header/BeregningOgSimuleringHeader';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { OppdaterSimuleringKnapp } from '~/lib/beregning-og-simulering/oppdater-simulering/OppdaterSimuleringKnapp';

import style from './MeldekortbehandlingBeregningOgSimulering.module.css';

export const MeldekortbehandlingBeregningOgSimulering = () => {
    const { erReadonly } = useMeldekortbehandlingSkjema();

    const {
        simulertBeregning,
        status,
        id,
        utbetalingsstatus,
        navkontorNavn,
        navkontor,
        kanIkkeIverksetteUtbetaling,
        meldeperioder,
    } = useMeldekortbehandling();

    if (!simulertBeregning) {
        return (
            <Infokort>
                {'Beregning mangler. Behandlingen må lagres med gyldige data for å beregnes.'}
            </Infokort>
        );
    }

    const { beregning } = simulertBeregning;

    const erIverksatt =
        status === MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET ||
        status === MeldekortbehandlingStatus.GODKJENT;

    const harKorrigering = meldeperioder.some(
        (it) => it.type === MeldeperiodebehandlingType.KORRIGERING,
    );

    return (
        <MeldekortbehandlingSeksjon gap={'space-24'}>
            <MeldekortbehandlingSeksjon.FullBredde className={style.heading}>
                <HStack justify={'space-between'}>
                    <Heading level={'2'} size={'medium'}>
                        {'Beregning og simulering'}
                    </Heading>
                    {!erReadonly && <OppdaterSimuleringKnapp behandlingId={id} />}
                </HStack>
            </MeldekortbehandlingSeksjon.FullBredde>

            <MeldekortbehandlingSeksjon.Venstre gap={'space-32'}>
                <BeregningOppsummering beregninger={beregning} />
                <SimuleringOppsummering
                    simulertBeregning={simulertBeregning}
                    behandlingId={id}
                    visOppdaterKnapp={false}
                />
            </MeldekortbehandlingSeksjon.Venstre>

            <MeldekortbehandlingSeksjon.Høyre gap={'space-24'}>
                <BeregningOgSimuleringHeader
                    utbetalingsstatus={erIverksatt ? utbetalingsstatus : undefined}
                    navkontor={navkontor}
                    navkontorNavn={navkontorNavn}
                    simulertBeregning={simulertBeregning}
                    kanIkkeIverksetteUtbetaling={kanIkkeIverksetteUtbetaling}
                    erOmberegning={harKorrigering}
                />

                <VStack>
                    <Heading level={'4'} size={'small'} spacing={true}>
                        {'Detaljer'}
                    </Heading>

                    <SimulertBeregningDetaljerTabell simulertBeregning={simulertBeregning} />
                </VStack>
            </MeldekortbehandlingSeksjon.Høyre>
        </MeldekortbehandlingSeksjon>
    );
};
