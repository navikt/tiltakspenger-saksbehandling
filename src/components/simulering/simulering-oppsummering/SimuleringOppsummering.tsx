import { Heading, VStack } from '@navikt/ds-react';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';
import { SimulerteBeløp } from '~/types/SimulertBeregningTypes';

type Props = {
    simulerteBeløp: SimulerteBeløp;
};

export const SimuleringOppsummering = ({ simulerteBeløp }: Props) => {
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
            <Heading size={'xsmall'} level={'4'} spacing={true}>
                {'Simulering oppsummert'}
            </Heading>
            <UtbetalingBeløp
                tekst={'Ny utbetaling'}
                beløp={nyUtbetaling}
                beløpForrige={tidligereUtbetaling}
            />
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
