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
    const { navkontor, navkontorNavn, totalBeløp, beregninger } = utbetaling;

    const { totalt, ordinært, barnetillegg } = totalBeløp;

    if (totalt === 0) {
        return (
            <Alert variant={'warning'}>{'Beregningen har totalbeløp 0 (dette er en bug!)'}</Alert>
        );
    }

    const antallPerioder = beregninger.length;

    return (
        <>
            <VedtakSeksjon>
                <Heading size={'xsmall'} level={'3'} className={style.header}>
                    {'Beregning av utbetaling'}
                </Heading>
                <VedtakSeksjon.Venstre>
                    <VStack gap={'1'} className={style.beløp}>
                        <Alert variant={'info'} size={'small'} inline={true}>
                            {`Vedtaket vil føre til en endring i beregningen av ${antallPerioder} tidligere utbetalte meldeperioder.`}
                        </Alert>
                        <UtbetalingBeløp
                            tekst={'Nytt ordinært beløp (alle perioder)'}
                            beløp={ordinært}
                        />
                        <UtbetalingBeløp
                            tekst={'Nytt barnetillegg beløp (alle perioder)'}
                            beløp={barnetillegg}
                        />
                        <UtbetalingBeløp
                            tekst={'Nytt totalt beløp (alle perioder)'}
                            beløp={totalt}
                        />
                    </VStack>
                    <UtbetalingStatus navkontor={navkontor} navkontorNavn={navkontorNavn} />
                </VedtakSeksjon.Venstre>
                <VedtakSeksjon.Høyre>
                    {totalt > 0 ? (
                        <Alert variant={'info'}>{'Vedtaket vil føre til en etterbetaling'}</Alert>
                    ) : (
                        <Alert variant={'error'}>
                            {'Vedtaket vil føre til en tilbakekreving. Dette støtter vi ikke ennå.'}
                        </Alert>
                    )}
                </VedtakSeksjon.Høyre>
            </VedtakSeksjon>
            <Separator />
        </>
    );
};
