import React, { ReactNode } from 'react';
import {
    CircleSlashIcon,
    CheckmarkCircleFillIcon,
    MinusCircleFillIcon,
    FirstAidKitFillIcon,
    NotePencilIcon,
    TasklistIcon,
    TasklistStartIcon,
} from '@navikt/aksel-icons';
import {
    MeldekortbehandlingDagStatus,
    MeldeperiodebehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { BrukersMeldekortDagStatus } from '~/lib/meldekort/typer/BrukersMeldekort';

const MeldekortIkoner = {
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

export const ikonForBrukersMeldekortDagStatus: Record<
    BrukersMeldekortDagStatus,
    React.JSX.Element
> = {
    [BrukersMeldekortDagStatus.DELTATT_UTEN_LØNN_I_TILTAKET]: MeldekortIkoner.checkmarkCircleFill,
    [BrukersMeldekortDagStatus.DELTATT_MED_LØNN_I_TILTAKET]: MeldekortIkoner.minusCircleFill,
    [BrukersMeldekortDagStatus.FRAVÆR_STERKE_VELFERDSGRUNNER_ELLER_JOBBINTERVJU]:
        MeldekortIkoner.minusCircleFill,
    [BrukersMeldekortDagStatus.FRAVÆR_GODKJENT_AV_NAV]: MeldekortIkoner.minusCircleFill,
    [BrukersMeldekortDagStatus.FRAVÆR_SYK]: MeldekortIkoner.firstAidKitFill,
    [BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN]: MeldekortIkoner.firstAidKitFill,
    [BrukersMeldekortDagStatus.IKKE_BESVART]: MeldekortIkoner.notePencil,
    [BrukersMeldekortDagStatus.FRAVÆR_ANNET]: MeldekortIkoner.circleSlash,
    [BrukersMeldekortDagStatus.IKKE_RETT_TIL_TILTAKSPENGER]: MeldekortIkoner.circleSlash,
    [BrukersMeldekortDagStatus.IKKE_TILTAKSDAG]: MeldekortIkoner.circleSlash,
} as const;

export const ikonForMeldekortbehandlingDagStatus: Record<
    MeldekortbehandlingDagStatus,
    React.JSX.Element
> = {
    [MeldekortbehandlingDagStatus.DeltattMedLønnITiltaket]: MeldekortIkoner.minusCircleFill,
    [MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket]: MeldekortIkoner.checkmarkCircleFill,
    [MeldekortbehandlingDagStatus.FraværSyk]: MeldekortIkoner.firstAidKitFill,
    [MeldekortbehandlingDagStatus.FraværSyktBarn]: MeldekortIkoner.firstAidKitFill,
    [MeldekortbehandlingDagStatus.FraværSterkeVelferdsgrunnerEllerJobbintervju]:
        MeldekortIkoner.checkmarkCircleFill,
    [MeldekortbehandlingDagStatus.FraværGodkjentAvNav]: MeldekortIkoner.checkmarkCircleFill,
    [MeldekortbehandlingDagStatus.FraværAnnet]: MeldekortIkoner.minusCircleFill,
    [MeldekortbehandlingDagStatus.IkkeTiltaksdag]: MeldekortIkoner.minusCircleFill,
    [MeldekortbehandlingDagStatus.IkkeBesvart]: MeldekortIkoner.notePencil,
    [MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger]: MeldekortIkoner.circleSlash,
} as const;

export const meldeperiodebehandlingTypeIkoner: Record<MeldeperiodebehandlingType, ReactNode> = {
    [MeldeperiodebehandlingType.FØRSTE_BEHANDLING]: <TasklistIcon />,
    [MeldeperiodebehandlingType.KORRIGERING]: <TasklistStartIcon />,
};
