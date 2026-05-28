import { ComponentProps, PropsWithChildren } from 'react';
import { BodyShort, VStack } from '@navikt/ds-react';

type Props = PropsWithChildren<
    {
        navn: string;
    } & Omit<ComponentProps<typeof BodyShort>, 'as'>
>;

export const DetaljVertikal = ({ navn, children, ...rest }: Props) => {
    return (
        <BodyShort as={VStack} {...rest}>
            <strong>{navn}</strong>
            {children}
        </BodyShort>
    );
};
