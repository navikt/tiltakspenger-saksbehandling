import { VStack } from '@navikt/ds-react';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { SimuleringDetaljer } from '~/components/simulering/detaljer/SimuleringDetaljer';
import { Separator } from '~/components/separator/Separator';
import { SimuleringOppsummering } from '~/components/simulering/simulering-oppsummering/SimuleringOppsummering';
import { BeregningOppsummering } from '~/components/simulering/beregning-oppsummering/BeregningOppsummering';
import { BehandlingBeregningHeader } from '~/components/behandling/felles/beregning-og-simulering/header/BehandlingBeregningHeader';

import style from './BehandlingBeregningOgSimulering.module.css';

export const BehandlingBeregningOgSimulering = () => {
    const { behandling } = useBehandling();

    const { utbetaling } = behandling;

    if (!utbetaling) {
        return null;
    }

    const { simulertBeregning } = utbetaling;
    const { beregning, simulerteBeløp } = simulertBeregning;

    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <VStack gap={'5'}>
                        <BehandlingBeregningHeader
                            utbetaling={utbetaling}
                            behandlingStatus={behandling.status}
                        />

                        <BeregningOppsummering beregninger={beregning} />
                        <SimuleringOppsummering simulerteBeløp={simulerteBeløp} />
                    </VStack>
                </VedtakSeksjon.Venstre>

                <VedtakSeksjon.FullBredde className={style.detaljer}>
                    <SimuleringDetaljer simulertBeregning={simulertBeregning} />
                </VedtakSeksjon.FullBredde>
            </VedtakSeksjon>
            <Separator />
        </>
    );
};
