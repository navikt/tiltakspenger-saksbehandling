import { PropsWithChildren } from 'react';
import { Infokort, InfokortVariant } from '~/lib/_felles/infokort/Infokort';
import { Heading } from '@navikt/ds-react';

import style from './VedtakHjelpetekst.module.css';

type Props = PropsWithChildren<{
    header?: string;
    variant?: InfokortVariant;
    className?: string;
}>;

export const VedtakHjelpetekst = ({ header, variant, className, children }: Props) => {
    return (
        <Infokort variant={variant ?? 'info'} className={className} size={'small'}>
            {header && (
                <Heading level={'3'} size={'small'} className={style.header}>
                    {header}
                </Heading>
            )}
            <div>{children}</div>
        </Infokort>
    );
};
