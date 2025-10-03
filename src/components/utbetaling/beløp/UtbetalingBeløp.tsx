import { BodyShort, HStack } from '@navikt/ds-react';
import { formatterBeløp } from '~/utils/beløp';
import { classNames } from '~/utils/classNames';
import { beløpStyle } from '~/components/utbetaling/beløp/beløpStyle';

import fellesStyle from '../UtbetalingFelles.module.css';
import style from './UtbetalingBeløp.module.css';

type Props = {
    tekst: string;
    beløp: number;
    beløpForrige?: number | null;
    className?: string;
};

export const UtbetalingBeløp = ({ tekst, beløp, beløpForrige, className }: Props) => {
    const diff = typeof beløpForrige !== 'number' ? undefined : beløp - beløpForrige;

    return (
        <HStack gap={'5'} className={classNames(fellesStyle.rad, className)}>
            <BodyShort>{tekst}</BodyShort>
            <div className={style.beløp}>
                <BodyShort weight={'semibold'}>{formatterBeløp(beløp)}</BodyShort>
                {!!diff && (
                    <BodyShort
                        className={beløpStyle(diff)}
                    >{`(${formatterBeløp(diff, { signDisplay: 'always' })})`}</BodyShort>
                )}
            </div>
        </HStack>
    );
};
