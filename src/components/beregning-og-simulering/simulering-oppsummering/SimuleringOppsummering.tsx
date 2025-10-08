import { Alert, BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';
import { SimulerteBeløp } from '~/types/SimulertBeregningTypes';
import {
    OppdaterSimuleringKnapp,
    OppdaterSimuleringProps,
} from '~/components/beregning-og-simulering/oppdater-simulering/OppdaterSimuleringKnapp';
import { Nullable } from '~/types/UtilTypes';
import { BehandlingIdFelles } from '~/types/BehandlingFelles';

import style from './SimuleringOppsummering.module.css';

type Props<BehId extends BehandlingIdFelles> = {
    simulerteBeløp?: Nullable<SimulerteBeløp>;
    visOppdaterKnapp: boolean;
} & OppdaterSimuleringProps<BehId>;

export const SimuleringOppsummering = <BehId extends BehandlingIdFelles>({
    simulerteBeløp,
    visOppdaterKnapp,
    ...oppdaterSimuleringProps
}: Props<BehId>) => {
    if (!simulerteBeløp) {
        return (
            <Alert variant={'warning'}>
                <div className={style.varsel}>
                    <BodyShort>{'Simulering er ikke tilgjengelig'}</BodyShort>
                    <OppdaterSimuleringKnapp {...oppdaterSimuleringProps} />
                </div>
            </Alert>
        );
    }

    const {
        tidligereUtbetaling,
        nyUtbetaling,
        etterbetaling,
        feilutbetaling,
        totalJustering,
        totalTrekk,
    } = simulerteBeløp;

    return (
        <VStack gap={'1'}>
            <HStack gap={'5'} justify={'space-between'}>
                <Heading size={'xsmall'} level={'4'} spacing={true}>
                    {'Simulering oppsummert'}
                </Heading>
                {visOppdaterKnapp && <OppdaterSimuleringKnapp {...oppdaterSimuleringProps} />}
            </HStack>
            <UtbetalingBeløp
                tekst={'Ny utbetaling'}
                beløp={nyUtbetaling}
                beløpForrige={tidligereUtbetaling}
            />
            <UtbetalingBeløp tekst={'Tidligere utbetaling'} beløp={tidligereUtbetaling} />
            {feilutbetaling !== 0 && (
                <UtbetalingBeløp tekst={'Feilutbetaling'} beløp={feilutbetaling} />
            )}
            {etterbetaling !== 0 && (
                <UtbetalingBeløp tekst={'Etterbetaling'} beløp={etterbetaling} />
            )}
            {totalJustering !== 0 && <UtbetalingBeløp tekst={'Justering'} beløp={totalJustering} />}
            {totalTrekk !== 0 && <UtbetalingBeløp tekst={'Trekk'} beløp={totalTrekk} />}
        </VStack>
    );
};
