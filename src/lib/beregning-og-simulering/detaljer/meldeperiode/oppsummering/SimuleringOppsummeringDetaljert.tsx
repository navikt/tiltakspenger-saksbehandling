import { SimulerteBeløp } from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { Heading } from '@navikt/ds-react';
import { UtbetalingBeløp } from '~/lib/_felles/utbetaling/beløp/UtbetalingBeløp';
import { classNames } from '~/utils/classNames';
import { Nullable } from '~/types/UtilTypes';

import style from './SimuleringOppsummeringDetaljert.module.css';

type Props = {
    headerTekst?: string;
    simulerteBeløp: Nullable<SimulerteBeløp>;
};

export const SimuleringOppsummeringDetaljert = ({ headerTekst, simulerteBeløp }: Props) => {
    if (!simulerteBeløp) {
        return (
            <Infokort variant={'info'} size={'small'}>
                {'Simuleringen viser ingen endringer for denne perioden'}
            </Infokort>
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
        <div className={style.wrapper}>
            {headerTekst && (
                <Heading size={'xsmall'} level={'4'}>
                    {headerTekst}
                </Heading>
            )}
            <div className={style.beløpWrapper}>
                <UtbetalingBeløp
                    tekst={'Ny utbetaling'}
                    beløp={nyUtbetaling}
                    beløpForrige={tidligereUtbetaling}
                />
                <UtbetalingBeløp
                    tekst={'Etterbetaling'}
                    beløp={etterbetaling}
                    className={classNames(etterbetaling === 0 && style.disabled)}
                />
                <UtbetalingBeløp
                    tekst={'Justering'}
                    beløp={totalJustering}
                    className={classNames(totalJustering === 0 && style.disabled)}
                />
                <UtbetalingBeløp tekst={'Tidligere utbetaling'} beløp={tidligereUtbetaling} />
                <UtbetalingBeløp
                    tekst={'Feilutbetaling'}
                    beløp={feilutbetaling}
                    className={classNames(feilutbetaling === 0 && style.disabled)}
                />
                <UtbetalingBeløp
                    tekst={'Trekk'}
                    beløp={totalTrekk}
                    className={classNames(totalTrekk === 0 && style.disabled)}
                />
            </div>
        </div>
    );
};
