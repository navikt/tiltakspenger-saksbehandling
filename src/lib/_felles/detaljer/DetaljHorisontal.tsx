import { ComponentProps, PropsWithChildren } from 'react';
import { BodyShort, HStack } from '@navikt/ds-react';

type Props = PropsWithChildren<
    {
        navn: string;
    } & Omit<ComponentProps<typeof BodyShort>, 'as'>
>;

export const DetaljHorisontal = ({ navn, children, ...rest }: Props) => {
    return (
        <BodyShort as={HStack} gap={'space-6'} {...rest}>
            <strong>{navn}</strong>
            {children}
        </BodyShort>
    );
};
