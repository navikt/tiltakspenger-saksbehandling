import { BodyShort, HStack } from '@navikt/ds-react';
import { formatterBeløp } from '~/utils/beløp';
import { classNames } from '~/utils/classNames';

import fellesStyle from '../UtbetalingFelles.module.css';
import style from './UtbetalingBeløp.module.css';

type Props = {
    tekst: string;
    beløp: number;
    beløpForrige?: number;
};

export const UtbetalingBeløp = ({ tekst, beløp, beløpForrige }: Props) => {
    const diff = beløpForrige === undefined ? undefined : beløp - beløpForrige;

    return (
        <HStack gap={'5'} className={fellesStyle.rad}>
            <BodyShort>{tekst}</BodyShort>
            <div className={style.beløp}>
                <BodyShort weight={'semibold'}>{formatterBeløp(beløp)}</BodyShort>
                {!!diff && (
                    <BodyShort
                        className={classNames(diff < 0 && style.negativ)}
                    >{`(${formatterBeløp(diff, { signDisplay: 'always' })})`}</BodyShort>
                )}
            </div>
        </HStack>
    );
};
