import { InfoCard } from '@navikt/ds-react';
import {
    CheckmarkCircleIcon,
    ExclamationmarkTriangleIcon,
    InformationSquareIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';
import { ComponentProps, PropsWithChildren, ReactNode } from 'react';

type InfocardMessageProps = ComponentProps<typeof InfoCard.Message>;

export type InfokortVariant = 'feil' | 'advarsel' | 'info' | 'suksess';

type Props = PropsWithChildren<
    Omit<InfocardMessageProps, 'icon'> & Partial<Pick<InfocardMessageProps, 'icon'>>
> & { header?: string; variant?: InfokortVariant };

export const InfokortEnkel = ({
    header,
    variant,
    children,
    icon,
    className,
    'data-color': dataColor,
    ...rest
}: Props) => {
    const resolvedIcon = icon ?? (variant ? Ikoner[variant] : null);
    const resolvedDataColor = dataColor ?? (variant ? DataColors[variant] : undefined);

    return header ? (
        <InfoCard className={className} data-color={resolvedDataColor} {...rest}>
            <InfoCard.Header icon={resolvedIcon}>
                <InfoCard.Title>{header}</InfoCard.Title>
            </InfoCard.Header>
            <InfoCard.Content>{children}</InfoCard.Content>
        </InfoCard>
    ) : (
        <InfoCard className={className}>
            <InfoCard.Message {...rest} data-color={resolvedDataColor} icon={resolvedIcon}>
                {children}
            </InfoCard.Message>
        </InfoCard>
    );
};

const Ikoner: Record<InfokortVariant, ReactNode> = {
    feil: <XMarkOctagonIcon aria-hidden />,
    advarsel: <ExclamationmarkTriangleIcon aria-hidden />,
    info: <InformationSquareIcon aria-hidden />,
    suksess: <CheckmarkCircleIcon aria-hidden />,
};

const DataColors: Record<InfokortVariant, InfocardMessageProps['data-color']> = {
    feil: 'danger',
    advarsel: 'warning',
    info: 'info',
    suksess: 'success',
};
