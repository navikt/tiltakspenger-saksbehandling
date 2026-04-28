import React from 'react';
import {
    CircleSlashIcon,
    CheckmarkCircleFillIcon,
    MinusCircleFillIcon,
    FirstAidKitFillIcon,
    NotePencilIcon,
} from '@navikt/aksel-icons';
import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { BrukersMeldekortDagStatus } from '~/lib/meldekort/typer/BrukersMeldekort';

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
    [BrukersMeldekortDagStatus.FRAVÆR_STERKE_VELFERDSGRUNNER_ELLER_JOBBINTERVJU]:
        Ikoner.minusCircleFill,
    [BrukersMeldekortDagStatus.FRAVÆR_GODKJENT_AV_NAV]: Ikoner.minusCircleFill,
    [BrukersMeldekortDagStatus.FRAVÆR_SYK]: Ikoner.firstAidKitFill,
    [BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN]: Ikoner.firstAidKitFill,
    [BrukersMeldekortDagStatus.IKKE_BESVART]: Ikoner.notePencil,
    [BrukersMeldekortDagStatus.FRAVÆR_ANNET]: Ikoner.circleSlash,
    [BrukersMeldekortDagStatus.IKKE_RETT_TIL_TILTAKSPENGER]: Ikoner.circleSlash,
    [BrukersMeldekortDagStatus.IKKE_TILTAKSDAG]: Ikoner.circleSlash,
} as const;

export const ikonForMeldekortbehandlingDagStatus: Record<
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
