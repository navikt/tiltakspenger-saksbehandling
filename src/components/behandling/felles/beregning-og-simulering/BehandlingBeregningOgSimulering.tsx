import { VStack } from '@navikt/ds-react';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { SimuleringDetaljer } from '~/components/beregning-og-simulering/detaljer/SimuleringDetaljer';
import { Separator } from '~/components/separator/Separator';
import { SimuleringOppsummering } from '~/components/beregning-og-simulering/simulering-oppsummering/SimuleringOppsummering';
import { BeregningOppsummering } from '~/components/beregning-og-simulering/beregning-oppsummering/BeregningOppsummering';
import { BeregningOgSimuleringHeader } from '~/components/beregning-og-simulering/header/BeregningOgSimuleringHeader';

import { kanSaksbehandleForBehandling } from '~/utils/tilganger';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';

import style from './BehandlingBeregningOgSimulering.module.css';
import { Rammebehandling, Behandlingsstatus } from '~/types/Behandling';

export const BehandlingBeregningOgSimulering = () => {
    const { behandling, setBehandling } = useBehandling();
    const { innloggetSaksbehandler } = useSaksbehandler();

    const { utbetaling, status } = behandling;

    if (!utbetaling) {
        return null;
    }

    const { simulertBeregning, status: utbetalingsstatus, navkontor, navkontorNavn } = utbetaling;
    const { beregning, simulerteBeløp } = simulertBeregning;

    kanSaksbehandleForBehandling(behandling, innloggetSaksbehandler);

    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <VStack gap={'5'}>
                        <BeregningOgSimuleringHeader
                            simulertBeregning={simulertBeregning}
                            navkontor={navkontor}
                            navkontorNavn={navkontorNavn}
                            utbetalingsstatus={
                                status === Behandlingsstatus.VEDTATT ? utbetalingsstatus : undefined
                            }
                            erOmberegning={true}
                        />

                        <BeregningOppsummering beregninger={beregning} />
                        <SimuleringOppsummering
                            simulerteBeløp={simulerteBeløp}
                            behandlingId={behandling.id}
                            oppdaterBehandlingEllerKjede={(behandling) =>
                                setBehandling(behandling as Rammebehandling)
                            }
                            visOppdaterKnapp={kanSaksbehandleForBehandling(
                                behandling,
                                innloggetSaksbehandler,
                            )}
                        />
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
