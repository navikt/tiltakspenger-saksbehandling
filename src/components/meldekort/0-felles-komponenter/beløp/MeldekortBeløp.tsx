import { VStack } from '@navikt/ds-react';
import { Simulering } from '~/types/Simulering';
import { BeløpProps } from '~/types/Beregning';
import {
    UtbetalingStatus,
    UtbetalingStatusProps,
} from '~/components/utbetaling/status/UtbetalingStatus';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';

import { Simuleringsknapp } from '~/components/behandling/felles/utbetaling/Simulering';

type Props = {
    beløp: BeløpProps;
    forrigeBeløp?: BeløpProps;
    totalBeløp?: BeløpProps;
    simulering?: Simulering;
    utbetalingStatusProps?: UtbetalingStatusProps;
};

export const MeldekortBeløp = ({
    beløp,
    forrigeBeløp,
    totalBeløp,
    simulering,
    utbetalingStatusProps,
}: Props) => {
    const harDiffPåTotalBeløp = totalBeløp && totalBeløp.totalt != beløp.totalt;

    return (
        <>
            <VStack gap={'1'}>
                <UtbetalingBeløp
                    tekst={'Ordinært beløp for perioden:'}
                    beløp={beløp.ordinært}
                    beløpForrige={forrigeBeløp?.ordinært}
                />
                <UtbetalingBeløp
                    tekst={'Barnetillegg beløp for perioden:'}
                    beløp={beløp.barnetillegg}
                    beløpForrige={forrigeBeløp?.barnetillegg}
                />
                <UtbetalingBeløp
                    tekst={'Totalt beløp for perioden:'}
                    beløp={beløp.totalt}
                    beløpForrige={forrigeBeløp?.totalt}
                />
                {harDiffPåTotalBeløp && (
                    <UtbetalingBeløp
                        tekst={'Totalt beløp beregnet for meldekortet:'}
                        beløp={totalBeløp.totalt}
                    />
                )}
            </VStack>
            {simulering && <Simuleringsknapp simulering={simulering} />}
            {utbetalingStatusProps && <UtbetalingStatus {...utbetalingStatusProps} />}
        </>
    );
};
