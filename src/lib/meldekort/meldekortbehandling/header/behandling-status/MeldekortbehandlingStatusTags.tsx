import React from 'react';
import { HStack, Tag } from '@navikt/ds-react';
import {
    CheckmarkIcon,
    CircleSlashIcon,
    HourglassTopFilledIcon,
    NotePencilDashIcon,
    NotePencilIcon,
    RobotSmileIcon,
} from '@navikt/aksel-icons';
import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { erMeldekortbehandlingSattPaVent } from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { meldekortbehandlingStatusTekst } from '~/lib/meldekort/utils/tekster';
import { meldekortbehandlingStatusFarge } from '~/lib/meldekort/utils/statusProps';

import style from './MeldekortbehandlingStatusTags.module.css';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
    /** Mindre tags uten ikoner, til bruk i tabeller og lignende */
    kompakt?: boolean;
};

export const MeldekortbehandlingStatusTags = ({ meldekortbehandling, kompakt }: Props) => {
    const { status } = meldekortbehandling;

    const erSattPåVent = erMeldekortbehandlingSattPaVent(meldekortbehandling);

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
            <Tag
                {...tagProps}
                data-color={meldekortbehandlingStatusFarge[status]}
                icon={kompakt ? undefined : meldekortStatusIkon[status]}
            >
                {meldekortbehandlingStatusTekst[status]}
            </Tag>
        </HStack>
    );
};

const meldekortStatusIkon: Record<MeldekortbehandlingStatus, React.ReactNode> = {
    IKKE_RETT_TIL_TILTAKSPENGER: <CircleSlashIcon />,
    KLAR_TIL_BEHANDLING: <NotePencilDashIcon />,
    UNDER_BEHANDLING: <NotePencilIcon />,
    KLAR_TIL_BESLUTNING: <HourglassTopFilledIcon />,
    UNDER_BESLUTNING: <NotePencilIcon />,
    GODKJENT: <CheckmarkIcon />,
    AUTOMATISK_BEHANDLET: <RobotSmileIcon />,
    AVBRUTT: <CircleSlashIcon />,
} as const;
