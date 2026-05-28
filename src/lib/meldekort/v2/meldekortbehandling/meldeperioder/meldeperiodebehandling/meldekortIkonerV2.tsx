import React from 'react';
import {
    CircleSlashIcon,
    CheckmarkCircleFillIcon,
    MinusCircleFillIcon,
    FirstAidKitFillIcon,
    NotePencilIcon,
} from '@navikt/aksel-icons';
import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';

const Ikoner = {
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
    [MeldekortbehandlingDagStatus.DeltattMedLønnITiltaket]: Ikoner.minusCircleFill,
    [MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket]: Ikoner.checkmarkCircleFill,
    [MeldekortbehandlingDagStatus.FraværSyk]: Ikoner.firstAidKitFill,
    [MeldekortbehandlingDagStatus.FraværSyktBarn]: Ikoner.firstAidKitFill,
    [MeldekortbehandlingDagStatus.FraværSterkeVelferdsgrunnerEllerJobbintervju]:
        Ikoner.checkmarkCircleFill,
    [MeldekortbehandlingDagStatus.FraværGodkjentAvNav]: Ikoner.checkmarkCircleFill,
    [MeldekortbehandlingDagStatus.FraværAnnet]: Ikoner.minusCircleFill,
    [MeldekortbehandlingDagStatus.IkkeTiltaksdag]: Ikoner.minusCircleFill,
    [MeldekortbehandlingDagStatus.IkkeBesvart]: Ikoner.notePencil,
    [MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger]: Ikoner.circleSlash,
} as const;
