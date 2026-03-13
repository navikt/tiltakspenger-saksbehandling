import { BodyShort, Label } from '@navikt/ds-react';
import { classNames } from '~/utils/classNames';
import { Nullable } from '~/types/UtilTypes';

import styles from './OppsummeringsPar.module.css';

type Retning = 'horisontal' | 'vertikal';
type Variant = 'spaceBetween' | 'inlineColon' | 'inline';

interface Props {
    label: string;
    verdi?: Nullable<React.ReactNode>;
    retning?: Retning;
    /**
     * Variant er hvordan vi ønsker å vise teksten gitt en retning
     * Per nå bare i bruk for horisontal retning
     */
    variant?: Variant;
    textSomSmall?: boolean;
    className?: string;
}

/**
 * default retning er horisontal
 */
export const OppsummeringsPar = ({ retning = 'horisontal', ...rest }: Props) => {
    if (retning === 'vertikal') {
        return <Vertikal {...rest} />;
    }
    return <Horisontal {...rest} />;
};

const Vertikal = ({
    label,
    verdi,
    className,
    textSomSmall,
}: Omit<Props, 'retning' | 'variant'>) => {
    const size = textSomSmall ? 'small' : undefined;

    return (
        <div className={classNames(styles.vertikalt, className)}>
            <Label size={size}>{label}</Label>
            <BodyShort className={styles.verdi} size={size}>
                {verdi ?? ''}
            </BodyShort>
        </div>
    );
};

const Horisontal = ({
    label,
    verdi,
    className,
    textSomSmall,
    variant = 'spaceBetween',
}: Omit<Props, 'retning'>) => {
    const size = textSomSmall ? 'small' : undefined;

    if (variant === 'inlineColon' || variant === 'inline') {
        return (
            <div className={classNames(styles.inline, className)}>
                <BodyShort size={size}>
                    {label}
                    {variant === 'inlineColon' ? ':' : ''}
                </BodyShort>
                <Label className={styles.verdi} size={size}>
                    {verdi ?? ''}
                </Label>
            </div>
        );
    }

    return (
        <div className={classNames(styles.spaceBetween, className)}>
            <BodyShort size={size}>{label}</BodyShort>
            <Label className={styles.verdi} size={size}>
                {verdi ?? ''}
            </Label>
        </div>
    );
};
