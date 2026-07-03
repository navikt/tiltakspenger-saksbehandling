import {
    MeldekortbehandlingDagStatus,
    MeldeperiodebehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    CheckmarkCircleFillIcon,
    CircleSlashIcon,
    FirstAidKitFillIcon,
    MinusCircleFillIcon,
    NotePencilIcon,
    TasklistIcon,
    TasklistStartIcon,
} from '@navikt/aksel-icons';
import { ReactNode } from 'react';

const MeldekortbehandlingDagStatusIkoner = {
    circleSlash: <CircleSlashIcon title="Sperret" color="black" width="1.2em" height="1.2em" />,
    checkmarkCircleFill: (
        <CheckmarkCircleFillIcon
            width="1.2em"
            height="1.2em"
            title="Full utbetaling"
            color="green"
        />
    ),
    minusCircleFill: (
        <MinusCircleFillIcon
            width="1.2em"
            height="1.2em"
            title="Ingen utbetaling"
            color="midnightblue"
        />
    ),
    firstAidKitFill: (
        <FirstAidKitFillIcon title="Redusert utbetaling" color="chocolate" fontSize="1.5rem" />
    ),
    notePencil: <NotePencilIcon width="1.2em" height="1.2em" title="Ikke utfylt" color="black" />,
} as const;

export const ikonForMeldekortbehandlingDagStatusV2: Record<
    MeldekortbehandlingDagStatus,
    React.JSX.Element
> = {
    [MeldekortbehandlingDagStatus.DeltattMedLønnITiltaket]:
        MeldekortbehandlingDagStatusIkoner.minusCircleFill,
    [MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket]:
        MeldekortbehandlingDagStatusIkoner.checkmarkCircleFill,
    [MeldekortbehandlingDagStatus.FraværSyk]: MeldekortbehandlingDagStatusIkoner.firstAidKitFill,
    [MeldekortbehandlingDagStatus.FraværSyktBarn]:
        MeldekortbehandlingDagStatusIkoner.firstAidKitFill,
    [MeldekortbehandlingDagStatus.FraværSterkeVelferdsgrunnerEllerJobbintervju]:
        MeldekortbehandlingDagStatusIkoner.checkmarkCircleFill,
    [MeldekortbehandlingDagStatus.FraværGodkjentAvNav]:
        MeldekortbehandlingDagStatusIkoner.checkmarkCircleFill,
    [MeldekortbehandlingDagStatus.FraværAnnet]: MeldekortbehandlingDagStatusIkoner.minusCircleFill,
    [MeldekortbehandlingDagStatus.IkkeTiltaksdag]:
        MeldekortbehandlingDagStatusIkoner.minusCircleFill,
    [MeldekortbehandlingDagStatus.IkkeBesvart]: MeldekortbehandlingDagStatusIkoner.notePencil,
    [MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger]:
        MeldekortbehandlingDagStatusIkoner.circleSlash,
} as const;

export const meldeperiodebehandlingTypeIkoner: Record<MeldeperiodebehandlingType, ReactNode> = {
    [MeldeperiodebehandlingType.FØRSTE_BEHANDLING]: <TasklistIcon />,
    [MeldeperiodebehandlingType.KORRIGERING]: <TasklistStartIcon />,
};
