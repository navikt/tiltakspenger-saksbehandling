import { PropsWithChildren } from 'react';
import { Alert, Heading } from '@navikt/ds-react';
import { classNames } from '../../../../utils/classNames';

import style from './VedtakHjelpetekst.module.css';

type Props = PropsWithChildren<{
    header: string;
    className?: string;
}>;

export const VedtakHjelpetekst = ({ header, className, children }: Props) => {
    return (
        <Alert className={classNames(style.wrapper, className)} variant={'info'} size={'small'}>
            <Heading level={'3'} size={'small'} className={style.header}>
                {header}
            </Heading>
            <div className={style.innhold}>{children}</div>
        </Alert>
    );
};
