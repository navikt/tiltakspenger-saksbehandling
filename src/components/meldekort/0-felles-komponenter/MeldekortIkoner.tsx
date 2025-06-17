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
} as const;

export const ikonForBrukersMeldekortDagStatus: Record<
    BrukersMeldekortDagStatus,
    React.JSX.Element
> = {
    [BrukersMeldekortDagStatus.DELTATT_UTEN_LØNN_I_TILTAKET]: Ikoner.checkmarkCircleFill,
    [BrukersMeldekortDagStatus.DELTATT_MED_LØNN_I_TILTAKET]: Ikoner.minusCircleFill,
    [BrukersMeldekortDagStatus.FRAVÆR_GODKJENT_AV_NAV]: Ikoner.minusCircleFill,
    [BrukersMeldekortDagStatus.FRAVÆR_SYK]: Ikoner.firstAidKitFill,
    [BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN]: Ikoner.firstAidKitFill,
    [BrukersMeldekortDagStatus.IKKE_BESVART]: Ikoner.notePencil,
    [BrukersMeldekortDagStatus.FRAVÆR_ANNET]: Ikoner.circleSlash,
} as const;

export const ikonForMeldekortBehandlingDagStatus: Record<
    MeldekortBehandlingDagStatus,
    React.JSX.Element
> = {
    [MeldekortBehandlingDagStatus.DeltattMedLønnITiltaket]: Ikoner.minusCircleFill,
    [MeldekortBehandlingDagStatus.DeltattUtenLønnITiltaket]: Ikoner.checkmarkCircleFill,
    [MeldekortBehandlingDagStatus.FraværSyk]: Ikoner.firstAidKitFill,
    [MeldekortBehandlingDagStatus.FraværSyktBarn]: Ikoner.firstAidKitFill,
    [MeldekortBehandlingDagStatus.FraværGodkjentAvNav]: Ikoner.checkmarkCircleFill,
    [MeldekortBehandlingDagStatus.FraværAnnet]: Ikoner.minusCircleFill,
    [MeldekortBehandlingDagStatus.IkkeDeltatt]: Ikoner.minusCircleFill,
    [MeldekortBehandlingDagStatus.IkkeBesvart]: Ikoner.notePencil,
    [MeldekortBehandlingDagStatus.Sperret]: Ikoner.circleSlash,
} as const;
