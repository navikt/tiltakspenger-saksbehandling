import { BehandlingUtbetalingProps } from '~/types/BehandlingTypes';
import { UtbetalingStatus } from '~/components/utbetaling/status/UtbetalingStatus';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Separator } from '~/components/separator/Separator';
import { Alert, Heading, VStack } from '@navikt/ds-react';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';

import style from './BehandlingUtbetaling.module.css';

type Props = {
    utbetaling: BehandlingUtbetalingProps;
};

export const BehandlingUtbetaling = ({ utbetaling }: Props) => {
    const { navkontor, navkontorNavn, status, beregningerSummert, beregninger } = utbetaling;

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
                    {erEtterbetaling ? 'Etterbetaling' : 'Tilbakekreving'}
                </Heading>
                <VedtakSeksjon.Venstre>
                    <VStack gap={'1'} className={style.underseksjon}>
                        <UtbetalingBeløp
                            tekst={
                                erEtterbetaling
                                    ? 'Beløp som etterbetales'
                                    : 'Beløp som tilbakekreves'
                            }
                            beløp={Math.abs(totalDiff)}
                            className={
                                erEtterbetaling
                                    ? style.etterbetalingBeløp
                                    : style.tilbakekrevingBeløp
                            }
                        />
                    </VStack>
                    <VStack gap={'1'} className={style.underseksjon}>
                        <Alert variant={'info'} size={'small'} inline={true}>
                            {`Vedtaket endrer beregningen av ${antallPerioder} tidligere utbetalte meldeperioder.`}
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
                        utbetalingsstatus={status}
                    />
                </VedtakSeksjon.Venstre>
            </VedtakSeksjon>
            <Separator />
        </>
    );
};
