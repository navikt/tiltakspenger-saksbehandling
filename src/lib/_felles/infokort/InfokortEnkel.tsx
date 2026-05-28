import { InfoCard } from '@navikt/ds-react';
import { ComponentProps, PropsWithChildren } from 'react';

type InfocardMessageProps = ComponentProps<typeof InfoCard.Message>;

type Props = PropsWithChildren<
    Omit<InfocardMessageProps, 'icon'> & Partial<Pick<InfocardMessageProps, 'icon'>>
>;

export const InfokortEnkel = ({ children, icon = null, className, ...rest }: Props) => {
    return (
        <InfoCard className={className}>
            <InfoCard.Message {...rest} icon={icon}>
                {children}
            </InfoCard.Message>
        </InfoCard>
    );
};
