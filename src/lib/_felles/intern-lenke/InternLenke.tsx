import { Link } from '@navikt/ds-react';
import NextLink from 'next/link';
import { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'as'>;

export const InternLenke = ({ children, ...rest }: Props) => {
    return (
        <Link as={NextLink} {...rest}>
            {children}
        </Link>
    );
};
