import { PropsWithChildren } from 'react';
import { Infokort, InfokortVariant } from '~/lib/_felles/infokort/Infokort';

type Props = PropsWithChildren<{
    header?: string;
    variant?: InfokortVariant;
    className?: string;
}>;

export const VedtakHjelpetekst = ({ header, variant, className, children }: Props) => {
    return (
        <Infokort header={header} variant={variant ?? 'info'} className={className} size={'small'}>
            {children}
        </Infokort>
    );
};
