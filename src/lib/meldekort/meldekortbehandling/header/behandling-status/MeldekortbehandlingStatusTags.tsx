import React, { ComponentProps } from 'react';
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

import style from './MeldekortbehandlingStatusTags.module.css';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
};

export const MeldekortbehandlingStatusTags = ({ meldekortbehandling }: Props) => {
    const { status } = meldekortbehandling;

    const erSattPåVent = erMeldekortbehandlingSattPaVent(meldekortbehandling);

    return (
        <HStack gap={'space-8'}>
            {erSattPåVent && (
                <Tag
                    variant={'moderate'}
                    data-color={'warning'}
                    icon={<HourglassTopFilledIcon />}
                    className={style.tag}
                >
                    {'Satt på vent'}
                </Tag>
            )}
            <Tag
                variant={'moderate'}
                data-color={meldekortStatusTagColor[status]}
                icon={meldekortStatusIkon[status]}
                className={style.tag}
            >
                {meldekortbehandlingStatusTekst[status]}
            </Tag>
        </HStack>
    );
};

const meldekortStatusTagColor: Record<
    MeldekortbehandlingStatus,
    ComponentProps<typeof Tag>['data-color']
> = {
    AUTOMATISK_BEHANDLET: 'success',
    GODKJENT: 'success',
    IKKE_RETT_TIL_TILTAKSPENGER: 'warning',
    KLAR_TIL_BEHANDLING: 'info',
    KLAR_TIL_BESLUTNING: 'meta-purple',
    UNDER_BEHANDLING: 'info',
    UNDER_BESLUTNING: 'meta-purple',
    AVBRUTT: 'neutral',
} as const;

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
