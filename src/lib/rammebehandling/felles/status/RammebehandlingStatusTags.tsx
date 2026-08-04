import React from 'react';
import { HStack, Tag } from '@navikt/ds-react';
import { AkselColor } from '@navikt/ds-react/types/theme';
import {
    ArrowUndoIcon,
    CheckmarkIcon,
    CircleSlashIcon,
    HourglassTopFilledIcon,
    NotePencilDashIcon,
    NotePencilIcon,
    RobotSmileIcon,
} from '@navikt/aksel-icons';
import {
    Rammebehandling,
    Rammebehandlingsstatus,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    erBehandlingSattPåVent,
    erBehandlingUnderkjent,
} from '~/lib/behandling-felles/utils/behandlingUtils';

import style from './RammebehandlingStatusTags.module.css';

type Props = {
    behandling: Rammebehandling;
    /** Mindre tags uten ikoner, til bruk i tabeller og lignende */
    kompakt?: boolean;
};

export const RammebehandlingStatusTags = ({ behandling, kompakt }: Props) => {
    const { status } = behandling;

    const erSattPåVent = erBehandlingSattPåVent(behandling);
    const erUnderkjent = erBehandlingUnderkjent(behandling);

    const tagProps = kompakt
        ? ({ variant: 'outline' } as const)
        : ({ variant: 'moderate', className: style.tag } as const);

    return (
        <HStack gap={kompakt ? 'space-4' : 'space-8'}>
            {erSattPåVent && (
                <Tag
                    {...tagProps}
                    data-color={'warning'}
                    icon={kompakt ? undefined : <HourglassTopFilledIcon />}
                >
                    {'Satt på vent'}
                </Tag>
            )}
            {erUnderkjent && (
                <Tag
                    {...tagProps}
                    data-color={'warning'}
                    icon={kompakt ? undefined : <ArrowUndoIcon />}
                >
                    {'Underkjent'}
                </Tag>
            )}
            <Tag
                {...tagProps}
                data-color={rammebehandlingStatusFarge[status]}
                icon={kompakt ? undefined : rammebehandlingStatusIkon[status]}
            >
                {rammebehandlingStatusTekst[status]}
            </Tag>
        </HStack>
    );
};

const rammebehandlingStatusTekst: Record<Rammebehandlingsstatus, string> = {
    [Rammebehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING]: 'Under automatisk behandling',
    [Rammebehandlingsstatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [Rammebehandlingsstatus.UNDER_BEHANDLING]: 'Under behandling',
    [Rammebehandlingsstatus.KLAR_TIL_BESLUTNING]: 'Klar til beslutning',
    [Rammebehandlingsstatus.UNDER_BESLUTNING]: 'Under beslutning',
    [Rammebehandlingsstatus.VEDTATT]: 'Vedtatt',
    [Rammebehandlingsstatus.AVBRUTT]: 'Avsluttet',
} as const;

const rammebehandlingStatusFarge: Record<Rammebehandlingsstatus, AkselColor> = {
    [Rammebehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING]: 'neutral',
    [Rammebehandlingsstatus.KLAR_TIL_BEHANDLING]: 'info',
    [Rammebehandlingsstatus.UNDER_BEHANDLING]: 'info',
    [Rammebehandlingsstatus.KLAR_TIL_BESLUTNING]: 'info',
    [Rammebehandlingsstatus.UNDER_BESLUTNING]: 'info',
    [Rammebehandlingsstatus.VEDTATT]: 'success',
    [Rammebehandlingsstatus.AVBRUTT]: 'neutral',
} as const;

const rammebehandlingStatusIkon: Record<Rammebehandlingsstatus, React.ReactNode> = {
    [Rammebehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING]: <RobotSmileIcon />,
    [Rammebehandlingsstatus.KLAR_TIL_BEHANDLING]: <NotePencilDashIcon />,
    [Rammebehandlingsstatus.UNDER_BEHANDLING]: <NotePencilIcon />,
    [Rammebehandlingsstatus.KLAR_TIL_BESLUTNING]: <HourglassTopFilledIcon />,
    [Rammebehandlingsstatus.UNDER_BESLUTNING]: <NotePencilIcon />,
    [Rammebehandlingsstatus.VEDTATT]: <CheckmarkIcon />,
    [Rammebehandlingsstatus.AVBRUTT]: <CircleSlashIcon />,
} as const;
