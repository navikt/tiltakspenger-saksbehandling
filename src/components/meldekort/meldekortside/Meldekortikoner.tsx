import React from 'react';
import {
    CircleSlashIcon,
    CheckmarkCircleFillIcon,
    MinusCircleFillIcon,
    FirstAidKitFillIcon,
    NotePencilIcon,
} from '@navikt/aksel-icons';
import { MeldekortBehandlingDagStatus } from '../../../types/meldekort/MeldekortBehandling';
import { BrukersMeldekortDagStatus } from '../../../types/meldekort/BrukersMeldekort';

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
};

export const ikonForBrukersMeldekortDagStatus: Record<
    BrukersMeldekortDagStatus,
    React.JSX.Element
> = {
    [BrukersMeldekortDagStatus.DELTATT]: Ikoner.checkmarkCircleFill,
    [BrukersMeldekortDagStatus.FRAVÆR_ANNET]: Ikoner.minusCircleFill,
    [BrukersMeldekortDagStatus.FRAVÆR_SYK]: Ikoner.firstAidKitFill,
    [BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN]: Ikoner.firstAidKitFill,
    [BrukersMeldekortDagStatus.IKKE_REGISTRERT]: Ikoner.notePencil,
    [BrukersMeldekortDagStatus.IKKE_DELTATT]: Ikoner.circleSlash,
};

export const ikonForMeldekortBehandlingDagStatus: Record<
    MeldekortBehandlingDagStatus,
    React.JSX.Element
> = {
    [MeldekortBehandlingDagStatus.DeltattMedLønnITiltaket]: Ikoner.minusCircleFill,
    [MeldekortBehandlingDagStatus.DeltattUtenLønnITiltaket]: Ikoner.checkmarkCircleFill,
    [MeldekortBehandlingDagStatus.FraværSyk]: Ikoner.firstAidKitFill,
    [MeldekortBehandlingDagStatus.FraværSyktBarn]: Ikoner.firstAidKitFill,
    [MeldekortBehandlingDagStatus.FraværVelferdGodkjentAvNav]: Ikoner.checkmarkCircleFill,
    [MeldekortBehandlingDagStatus.FraværVelferdIkkeGodkjentAvNav]: Ikoner.minusCircleFill,
    [MeldekortBehandlingDagStatus.IkkeDeltatt]: Ikoner.minusCircleFill,
    [MeldekortBehandlingDagStatus.IkkeUtfylt]: Ikoner.notePencil,
    [MeldekortBehandlingDagStatus.Sperret]: Ikoner.circleSlash,
};
