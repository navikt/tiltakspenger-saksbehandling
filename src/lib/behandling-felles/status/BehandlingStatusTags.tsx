import React from 'react';
import { HStack, Tag } from '@navikt/ds-react';
import {
    ArrowUndoIcon,
    CheckmarkIcon,
    CircleSlashIcon,
    HourglassTopFilledIcon,
    NotePencilDashIcon,
    NotePencilIcon,
    RobotSmileIcon,
} from '@navikt/aksel-icons';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import { MeldekortbehandlingStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    erBehandlingSattPåVent,
    erBehandlingUnderkjent,
} from '~/lib/behandling-felles/utils/behandlingUtils';
import { BehandlingProps, Behandlingsstatus } from '~/lib/behandling-felles/typer/BehandlingFelles';
import {
    behandlingsstatusFarge,
    behandlingsstatusTekst,
    ukjentStatus,
} from '~/lib/behandling-felles/status/behandlingsstatus';

import style from './BehandlingStatusTags.module.css';

type Props = {
    behandling: BehandlingProps;
    /** Mindre tags uten ikoner, til bruk i tabeller og lignende */
    kompakt?: boolean;
    className?: string;
};

export const BehandlingStatusTags = ({ behandling, kompakt, className }: Props) => {
    const { status } = behandling;

    const erSattPåVent = erBehandlingSattPåVent(behandling);
    const erUnderkjent = erBehandlingUnderkjent(behandling);

    const tagProps = kompakt
        ? ({ variant: 'outline' } as const)
        : ({ variant: 'moderate', className: style.tag } as const);

    return (
        <HStack gap={kompakt ? 'space-4' : 'space-8'} className={className}>
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
                data-color={behandlingsstatusFarge(status)}
                icon={kompakt ? undefined : behandlingsstatusIkon(status)}
            >
                {behandlingsstatusTekst(status)}
            </Tag>
        </HStack>
    );
};

const behandlingsstatusIkon = (status: Behandlingsstatus): React.ReactNode => {
    switch (status) {
        case Rammebehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING:
        case MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET:
            return <RobotSmileIcon />;
        case Rammebehandlingsstatus.KLAR_TIL_BEHANDLING:
        case MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING:
            return <NotePencilDashIcon />;
        case Rammebehandlingsstatus.UNDER_BEHANDLING:
        case MeldekortbehandlingStatus.UNDER_BEHANDLING:
        case Rammebehandlingsstatus.UNDER_BESLUTNING:
        case MeldekortbehandlingStatus.UNDER_BESLUTNING:
            return <NotePencilIcon />;
        case Rammebehandlingsstatus.KLAR_TIL_BESLUTNING:
        case MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING:
            return <HourglassTopFilledIcon />;
        case Rammebehandlingsstatus.VEDTATT:
        case MeldekortbehandlingStatus.GODKJENT:
            return <CheckmarkIcon />;
        case Rammebehandlingsstatus.AVBRUTT:
        case MeldekortbehandlingStatus.AVBRUTT:
            return <CircleSlashIcon />;
        default:
            return ukjentStatus(status, undefined);
    }
};
