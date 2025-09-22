import { Simuleringsknapp } from '~/components/behandling/felles/utbetaling/Simulering';
import { BehandlingData, BehandlingStatus } from '~/types/BehandlingTypes';
import { OppdaterSimuleringKnapp } from '~/components/behandling/felles/utbetaling/OppdaterSimuleringKnapp';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import style from '~/components/behandling/felles/utbetaling/BehandlingUtbetaling.module.css';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { SimuleringDetaljer } from '~/components/simulering/detaljer/SimuleringDetaljer';

export const BeregningOgSimulering = () => {
    const { behandling } = useBehandling();

    const { utbetaling, status: behandlingStatus, sakId, id } = behandling;

    const simulertBeregning = utbetaling?.simulertBeregning;

    if (!simulertBeregning) {
        return null;
    }

    const {
        beregningEndring,
        simuleringEtterbetaling,
        simuleringFeilutbetaling,
        simuleringTidligereUtbetalt,
    } = simulertBeregning;

    const { totalt, ordinært, barnetillegg } = beregningEndring;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <VStack gap={'1'}>
                    <Heading size={'small'} level={'3'}>
                        {'Beregning'}
                    </Heading>
                    <UtbetalingBeløp tekst={'Differanse'} beløp={totalt} />
                    <UtbetalingBeløp tekst={'Ordinær'} beløp={ordinært} />
                    <UtbetalingBeløp tekst={'Barnetillegg'} beløp={barnetillegg} />
                </VStack>

                <VStack gap={'1'}>
                    <Heading size={'small'} level={'3'}>
                        {'Simulering'}
                    </Heading>
                    {simuleringTidligereUtbetalt !== null ? (
                        <UtbetalingBeløp
                            tekst={'Tidligere utbetaling'}
                            beløp={simuleringTidligereUtbetalt}
                        />
                    ) : (
                        'Ingen tidligere utbetaling'
                    )}
                    {simuleringFeilutbetaling !== null ? (
                        <UtbetalingBeløp
                            tekst={'Feilutbetaling'}
                            beløp={simuleringFeilutbetaling}
                        />
                    ) : null}
                    {simuleringEtterbetaling !== null ? (
                        <UtbetalingBeløp tekst={'Etterbetaling'} beløp={simuleringEtterbetaling} />
                    ) : null}
                </VStack>
                <SimuleringDetaljer simulertBeregning={simulertBeregning} />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
