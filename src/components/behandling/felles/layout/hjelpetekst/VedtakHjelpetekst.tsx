import { PropsWithChildren } from 'react';
import { Alert, AlertProps, Heading } from '@navikt/ds-react';
import { classNames } from '~/utils/classNames';

import style from './VedtakHjelpetekst.module.css';

type Props = PropsWithChildren<{
    header?: string;
    variant?: AlertProps['variant'];
    className?: string;
}>;

export const VedtakHjelpetekst = ({ header, variant, className, children }: Props) => {
    return (
        <Alert
            className={classNames(style.wrapper, className)}
            variant={variant ?? 'info'}
            size={'small'}
        >
            {header && (
                <Heading level={'3'} size={'small'} className={style.header}>
                    {header}
                </Heading>
            )}
            <div className={style.innhold}>{children}</div>
        </Alert>
    );
};
