import { Button, ButtonProps } from '@navikt/ds-react';
import NextLink from 'next/link';
import { ComponentPropsWithoutRef } from 'react';

type Props = Omit<ButtonProps, 'as'> &
    Omit<ComponentPropsWithoutRef<typeof NextLink>, keyof ButtonProps>;

export const InternLenkeKnapp = ({ variant, size, children, ...rest }: Props) => {
    return (
        <Button as={NextLink} variant={variant ?? 'secondary'} size={size ?? 'small'} {...rest}>
            {children}
        </Button>
    );
};
