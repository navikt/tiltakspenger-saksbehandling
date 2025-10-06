import { VStack } from '@navikt/ds-react';
import { BeløpProps } from '~/types/Beregning';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';

type Props = {
    beløp: BeløpProps;
    forrigeBeløp?: BeløpProps;
    totalBeløp?: BeløpProps;
};

export const MeldekortBeløp = ({ beløp, forrigeBeløp, totalBeløp }: Props) => {
    const harDiffPåTotalBeløp = totalBeløp && totalBeløp.totalt != beløp.totalt;

    return (
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
    );
};
