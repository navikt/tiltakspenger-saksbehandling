import { Alert, BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';
import { SimulerteBeløp } from '~/types/SimulertBeregningTypes';
import { OppdaterSimuleringKnapp } from '~/components/simulering/oppdater-simulering/OppdaterSimuleringKnapp';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { Nullable } from '~/types/UtilTypes';

import style from './SimuleringOppsummering.module.css';

type Props = {
    simulerteBeløp?: Nullable<SimulerteBeløp>;
};

export const SimuleringOppsummering = ({ simulerteBeløp }: Props) => {
    const { behandling, setBehandling } = useBehandling();

    if (!simulerteBeløp) {
        return (
            <Alert variant={'warning'}>
                <div className={style.varsel}>
                    <BodyShort>{'Simulering er ikke tilgjengelig'}</BodyShort>
                    <OppdaterSimuleringKnapp
                        behandling={behandling}
                        setBehandling={setBehandling}
                    />
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
                <OppdaterSimuleringKnapp behandling={behandling} setBehandling={setBehandling} />
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
