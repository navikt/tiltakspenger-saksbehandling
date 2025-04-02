import { BodyShort, Label } from '@navikt/ds-react';

import styles from './OppsummeringsPar.module.css';
import { classNames } from '../../../utils/classNames';

interface Props {
    label: string;
    verdi: string | number | undefined | null;
    retning?: 'horisontal' | 'vertikal';
    textSomSmall?: boolean;
    className?: string;
}

/**
 * default retning er horisontal
 */
export const OppsummeringsPar = ({
    label,
    verdi,
    className = '',
    textSomSmall,
    retning = 'horisontal',
}: Props) => {
    if (retning === 'vertikal') {
        return (
            <div className={classNames(styles.vertikalt, className)}>
                <Label size={textSomSmall ? 'small' : undefined}>{label}</Label>
                <BodyShort className={styles.verdi} size={textSomSmall ? 'small' : undefined}>
                    {verdi ?? ''}
                </BodyShort>
            </div>
        );
    }

    return (
        <div className={classNames(styles.horisontalt, className)}>
            <BodyShort size={textSomSmall ? 'small' : undefined}>{label}</BodyShort>
            <Label className={styles.verdi} size={textSomSmall ? 'small' : undefined}>
                {verdi ?? ''}
            </Label>
        </div>
    );
};
