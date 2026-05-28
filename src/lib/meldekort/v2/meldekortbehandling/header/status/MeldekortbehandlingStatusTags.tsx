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
    MeldekortbehandlingPropsV2,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { erMeldekortbehandlingSattPaVent } from '~/lib/meldekort/utils/MeldekortbehandlingUtils';

import style from './MeldekortbehandlingStatusTags.module.css';

type Props = {
    meldekortbehandling: MeldekortbehandlingPropsV2;
};

export const MeldekortbehandlingStatusTags = ({ meldekortbehandling }: Props) => {
    const { status } = meldekortbehandling;

    const erSattPåVent = erMeldekortbehandlingSattPaVent(meldekortbehandling);

    return (
        <HStack gap={'space-8'}>
            {erSattPåVent && (
                <Tag
                    variant={'warning-moderate'}
                    icon={<HourglassTopFilledIcon />}
                    className={style.tag}
                >
                    {'Satt på vent'}
                </Tag>
            )}
            <Tag
                variant={meldekortStatusTagVariant[status]}
                icon={meldekortStatusIkon[status]}
                className={style.tag}
            >
                {meldekortstatusTekst[status]}
            </Tag>
        </HStack>
    );
};

const meldekortStatusTagVariant: Record<
    MeldekortbehandlingStatus,
    ComponentProps<typeof Tag>['variant']
> = {
    AUTOMATISK_BEHANDLET: 'success-moderate',
    GODKJENT: 'success-moderate',
    IKKE_RETT_TIL_TILTAKSPENGER: 'warning-moderate',
    KLAR_TIL_BEHANDLING: 'info-moderate',
    KLAR_TIL_BESLUTNING: 'alt1-moderate',
    UNDER_BEHANDLING: 'alt3-moderate',
    UNDER_BESLUTNING: 'alt3-moderate',
    AVBRUTT: 'warning-moderate',
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

const meldekortstatusTekst: Record<MeldekortbehandlingStatus, string> = {
    IKKE_RETT_TIL_TILTAKSPENGER: 'Ikke rett til tiltakspenger',
    KLAR_TIL_BEHANDLING: 'Klar til behandling',
    UNDER_BEHANDLING: 'Under behandling',
    KLAR_TIL_BESLUTNING: 'Klar til beslutning',
    UNDER_BESLUTNING: 'Under beslutning',
    GODKJENT: 'Godkjent',
    AUTOMATISK_BEHANDLET: 'Automatisk behandlet',
    AVBRUTT: 'Avsluttet',
} as const;
