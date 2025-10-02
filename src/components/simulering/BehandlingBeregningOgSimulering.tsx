import { Alert, Heading, VStack } from '@navikt/ds-react';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { SimuleringDetaljer } from '~/components/simulering/detaljer/SimuleringDetaljer';
import { Separator } from '~/components/separator/Separator';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';
import { SimuleringOppsummering } from '~/components/simulering/simulering-oppsummering/SimuleringOppsummering';
import { BeregningOppsummering } from '~/components/simulering/beregning-oppsummering/BeregningOppsummering';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';

import style from './BehandlingBeregningOgSimulering.module.css';

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

    const { beregning, simulerteBeløp } = simulertBeregning;

    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <Heading size={'small'} level={'3'} className={style.header}>
                        {'Utbetaling (ny versjon under arbeid, vises ikke i prod)'}
                    </Heading>

                    <VStack gap={'5'}>
                        <BeregningOppsummering beregninger={beregning} />

                        {simulerteBeløp ? (
                            <SimuleringOppsummering simulerteBeløp={simulerteBeløp} />
                        ) : (
                            <Alert variant={'warning'}>{'Simulering er ikke tilgjengelig'}</Alert>
                        )}
                    </VStack>
                </VedtakSeksjon.Venstre>

                <VedtakSeksjon.Høyre>
                    <VedtakHjelpetekst>
                        {'Her kunne vi kanskje ha en hjelpetekst om utbetaling på en behandling?'}
                    </VedtakHjelpetekst>
                </VedtakSeksjon.Høyre>

                <VedtakSeksjon.FullBredde className={style.detaljer}>
                    <SimuleringDetaljer simulertBeregning={simulertBeregning} />
                </VedtakSeksjon.FullBredde>
            </VedtakSeksjon>
            <Separator />
        </>
    );
};
