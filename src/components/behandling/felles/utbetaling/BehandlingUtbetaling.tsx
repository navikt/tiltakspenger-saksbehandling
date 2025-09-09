import { UtbetalingStatus } from '~/components/utbetaling/status/UtbetalingStatus';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Separator } from '~/components/separator/Separator';
import { Alert, Heading, HStack, VStack } from '@navikt/ds-react';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';
import { Simuleringsknapp } from './Simulering';
import { useBehandling } from '~/components/behandling/BehandlingContext';
import { BehandlingStatus } from '~/types/BehandlingTypes';

import style from './BehandlingUtbetaling.module.css';
import { OppdaterSimuleringKnapp } from './OppdaterSimuleringKnapp';

export const BehandlingUtbetaling = () => {
    const { utbetaling, status: behandlingStatus, sakId, id } = useBehandling().behandling;

    if (!utbetaling) {
        return null;
    }

    const { navkontor, navkontorNavn, status, beregningerSummert, beregninger, simulering } =
        utbetaling;

    const { totalt, ordinært, barnetillegg } = beregningerSummert;

    const totalDiff = totalt.nå - totalt.før;

    if (totalDiff === 0) {
        return (
            <Alert variant={'warning'}>{'Beregningen har totalbeløp 0 (dette er en bug!)'}</Alert>
        );
    }

    const antallPerioder = beregninger.length;
    const erEtterbetaling = totalDiff > 0;

    return (
        <>
            <VedtakSeksjon>
                <Heading size={'small'} level={'3'} className={style.header}>
                    {'Beregning'}
                </Heading>
                <VedtakSeksjon.Venstre className={style.underseksjon}>
                    <VStack gap={'1'}>
                        <UtbetalingBeløp
                            tekst={'Beløp'}
                            beløp={Math.abs(totalDiff)}
                            className={
                                erEtterbetaling
                                    ? style.etterbetalingBeløp
                                    : style.tilbakekrevingBeløp
                            }
                        />
                    </VStack>
                    <VStack gap={'1'}>
                        <Alert variant={'info'} size={'small'} inline={true}>
                            {`Vedtaket endrer beregningen av ${antallPerioder} tidligere ${antallPerioder > 1 ? 'utbetalte meldeperioder' : 'utbetalt meldeperiode'}.`}
                        </Alert>
                        <UtbetalingBeløp
                            tekst={'Nytt ordinært beløp (alle perioder)'}
                            beløp={ordinært.nå}
                            beløpForrige={ordinært.før}
                        />
                        <UtbetalingBeløp
                            tekst={'Nytt barnetillegg beløp (alle perioder)'}
                            beløp={barnetillegg.nå}
                            beløpForrige={barnetillegg.før}
                        />
                        <UtbetalingBeløp
                            tekst={'Nytt totalt beløp (alle perioder)'}
                            beløp={totalt.nå}
                            beløpForrige={totalt.før}
                        />
                    </VStack>
                    <UtbetalingStatus
                        navkontor={navkontor}
                        navkontorNavn={navkontorNavn}
                        utbetalingsstatus={
                            behandlingStatus === BehandlingStatus.VEDTATT ? status : undefined
                        }
                    />
                    <HStack>
                        <Simuleringsknapp simulering={simulering} />
                        {behandlingStatus === BehandlingStatus.UNDER_BESLUTNING && (
                            <OppdaterSimuleringKnapp sakId={sakId} behandlingId={id} />
                        )}
                    </HStack>
                </VedtakSeksjon.Venstre>
            </VedtakSeksjon>
            <Separator />
        </>
    );
};
