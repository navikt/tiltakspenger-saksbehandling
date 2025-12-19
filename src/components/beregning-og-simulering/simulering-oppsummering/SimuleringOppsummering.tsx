import { Alert, BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';
import { SimuleringResultat, SimulertBeregning } from '~/types/SimulertBeregning';
import {
    OppdaterSimuleringKnapp,
    OppdaterSimuleringProps,
} from '~/components/beregning-og-simulering/oppdater-simulering/OppdaterSimuleringKnapp';
import { BehandlingIdFelles } from '~/types/BehandlingFelles';

import style from './SimuleringOppsummering.module.css';

type Props<BehId extends BehandlingIdFelles> = {
    simulertBeregning: SimulertBeregning;
    visOppdaterKnapp: boolean;
} & OppdaterSimuleringProps<BehId>;

export const SimuleringOppsummering = <BehId extends BehandlingIdFelles>({
    simulertBeregning,
    visOppdaterKnapp,
    ...oppdaterSimuleringProps
}: Props<BehId>) => {
    const { simuleringResultat, simulerteBeløp } = simulertBeregning;

    const oppdaterKnapp = visOppdaterKnapp && (
        <OppdaterSimuleringKnapp {...oppdaterSimuleringProps} />
    );

    if (simuleringResultat === SimuleringResultat.IKKE_SIMULERT) {
        return (
            <Alert variant={'warning'} className={style.varsel}>
                <BodyShort>{'Simulering mangler!'}</BodyShort>
                {oppdaterKnapp}
            </Alert>
        );
    }

    if (simuleringResultat === SimuleringResultat.INGEN_ENDRING) {
        return (
            <Alert variant={'info'} className={style.varsel}>
                <BodyShort>{'Simulering viser ingen endring i utbetalingen'}</BodyShort>
                {oppdaterKnapp}
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
                {oppdaterKnapp}
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
