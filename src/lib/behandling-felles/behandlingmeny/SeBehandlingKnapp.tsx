import { Button } from '@navikt/ds-react';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
    href: string;
}>;

export const SeBehandlingKnapp = ({ href, children }: Props) => {
    return (
        <Button as={Link} href={href} variant={'secondary'} size={'small'}>
            {children}
        </Button>
    );
};
