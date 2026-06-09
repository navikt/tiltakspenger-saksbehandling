import { MeldeperiodebehandlingType } from '~/lib/meldekort/typer/Meldekortbehandling';
import { TasklistIcon, TasklistStartIcon } from '@navikt/aksel-icons';
import { ReactNode } from 'react';

export const meldeperiodebehandlingTypeIkoner: Record<MeldeperiodebehandlingType, ReactNode> = {
    [MeldeperiodebehandlingType.FØRSTE_BEHANDLING]: <TasklistIcon />,
    [MeldeperiodebehandlingType.KORRIGERING]: <TasklistStartIcon />,
};
