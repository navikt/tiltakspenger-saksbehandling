import { Heading, VStack } from '@navikt/ds-react';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { SimuleringDetaljer } from '~/components/simulering/detaljer/SimuleringDetaljer';
import { Separator } from '~/components/separator/Separator';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';

export const BehandlingBeregningOgSimulering = () => {
    const { nyBeregningVisningToggle } = useFeatureToggles();

    const { behandling } = useBehandling();

    if (!nyBeregningVisningToggle) {
        return null;
    }

    const { utbetaling } = behandling;

    const simulertBeregning = utbetaling?.simulertBeregning;

    if (!simulertBeregning) {
        return null;
    }

    const { beregning } = simulertBeregning;

    const { totalt, ordinært, barnetillegg } = beregning;

    return (
        <>
            <VedtakSeksjon>
                <Heading size={'small'} level={'3'}>
                    {'Beregning og simulering (ny versjon under arbeid, vises ikke i prod)'}
                </Heading>

                <VedtakSeksjon.Venstre>
                    <VStack gap={'1'}>
                        <UtbetalingBeløp tekst={'Totalt'} beløp={totalt.nå} />
                        <UtbetalingBeløp tekst={'Ordinær'} beløp={ordinært.nå} />
                        <UtbetalingBeløp tekst={'Barnetillegg'} beløp={barnetillegg.nå} />
                    </VStack>

                    {/*<VStack gap={'1'}>*/}
                    {/*    <Heading size={'small'} level={'3'}>*/}
                    {/*        {'Simulering'}*/}
                    {/*    </Heading>*/}
                    {/*    {simuleringTidligereUtbetalt !== null ? (*/}
                    {/*        <UtbetalingBeløp*/}
                    {/*            tekst={'Tidligere utbetaling'}*/}
                    {/*            beløp={simuleringTidligereUtbetalt}*/}
                    {/*        />*/}
                    {/*    ) : (*/}
                    {/*        'Ingen tidligere utbetaling'*/}
                    {/*    )}*/}
                    {/*    {simuleringFeilutbetaling !== null ? (*/}
                    {/*        <UtbetalingBeløp*/}
                    {/*            tekst={'Feilutbetaling'}*/}
                    {/*            beløp={simuleringFeilutbetaling}*/}
                    {/*        />*/}
                    {/*    ) : null}*/}
                    {/*    {simuleringEtterbetaling !== null ? (*/}
                    {/*        <UtbetalingBeløp tekst={'Etterbetaling'} beløp={simuleringEtterbetaling} />*/}
                    {/*    ) : null}*/}
                    {/*</VStack>*/}
                </VedtakSeksjon.Venstre>
                <VedtakSeksjon.FullBredde>
                    <SimuleringDetaljer simulertBeregning={simulertBeregning} />
                </VedtakSeksjon.FullBredde>
            </VedtakSeksjon>
            <Separator />
        </>
    );
};
