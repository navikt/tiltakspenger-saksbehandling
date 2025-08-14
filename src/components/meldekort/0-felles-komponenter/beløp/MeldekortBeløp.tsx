import { Button, VStack } from '@navikt/ds-react';
import { Simulering } from '~/types/Simulering';
import OppsummeringAvSimulering from '../../../oppsummeringer/simulering/OppsummeringAvSimulering';
import { useState } from 'react';
import { erSimuleringEndring } from '~/utils/simuleringUtils';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { BeløpProps } from '~/types/Beregning';
import {
    UtbetalingStatus,
    UtbetalingStatusProps,
} from '~/components/utbetaling/status/UtbetalingStatus';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';

import style from './MeldekortBeløp.module.css';

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
    const [vilSeSimulering, setVilSeSimulering] = useState(false);
    const harDiffPåTotalBeløp = totalBeløp && totalBeløp.totalt != beløp.totalt;

    const erFeilutbetalingStørreEnn0 =
        simulering && erSimuleringEndring(simulering) && simulering.totalFeilutbetaling > 0;

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
            {simulering && (
                <>
                    <Button
                        onClick={() => setVilSeSimulering(!vilSeSimulering)}
                        variant={'secondary'}
                        size={'small'}
                        type={'button'}
                        icon={
                            erFeilutbetalingStørreEnn0 && (
                                <ExclamationmarkTriangleFillIcon
                                    className={style.advarselIkon}
                                    title="Advarsel ikon"
                                    fontSize="1rem"
                                />
                            )
                        }
                        className={style.seSimuleringKnapp}
                    >
                        {`${vilSeSimulering ? 'Skjul' : 'Vis'} simulering`}
                    </Button>
                    {vilSeSimulering && <OppsummeringAvSimulering simulering={simulering!} />}
                </>
            )}
            {utbetalingStatusProps && <UtbetalingStatus {...utbetalingStatusProps} />}
        </>
    );
};
