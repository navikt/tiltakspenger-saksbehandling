import { BeregningerSummert } from '~/types/BehandlingTypes';
import { Heading, VStack } from '@navikt/ds-react';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';

type Props = {
    beregninger: BeregningerSummert;
};

export const BeregningOppsummering = ({ beregninger }: Props) => {
    const { totalt, ordinært, barnetillegg } = beregninger;

    return (
        <VStack gap={'1'}>
            <Heading size={'xsmall'} level={'4'} spacing={true}>
                {'Beregning oppsummert'}
            </Heading>
            <UtbetalingBeløp
                tekst={'Nytt totalt beløp'}
                beløp={totalt.nå}
                beløpForrige={totalt.før}
            />
            <UtbetalingBeløp
                tekst={'Nytt ordinært beløp'}
                beløp={ordinært.nå}
                beløpForrige={ordinært.før}
            />
            <UtbetalingBeløp
                tekst={'Nytt barnetillegg beløp'}
                beløp={barnetillegg.nå}
                beløpForrige={barnetillegg.før}
            />
        </VStack>
    );
};
