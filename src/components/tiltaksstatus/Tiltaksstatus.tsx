import React from 'react';
import { XMarkOctagonFillIcon, InformationSquareFillIcon, CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import TiltaksstatusType from '../../types/Tiltaksstatus';
import IconWithText from '../icon-with-text/IconWithText';

interface TiltaksstatusProps {
    tiltaksstatus: TiltaksstatusType;
}

const iconRenderer = (tiltaksstatus: TiltaksstatusType) => {
    switch (tiltaksstatus) {
        case TiltaksstatusType.GODKJENT_TILTAKSPLASS:
        case TiltaksstatusType.TAKKET_JA_TIL_TILBUD:
        case TiltaksstatusType.GJENNOMFØRES:
        case TiltaksstatusType.FULLFØRT:
            return <CheckmarkCircleFillIcon />;
        case TiltaksstatusType.AKTUELL:
        case TiltaksstatusType.VENTELISTE:
        case TiltaksstatusType.INFORMASJONSMØTE:
        case TiltaksstatusType.DELTAKELSE_AVBRUTT:
        case TiltaksstatusType.GJENNOMFØRING_AVBRUTT:
            return <InformationSquareFillIcon />;
        case TiltaksstatusType.IKKE_MØTT:
        case TiltaksstatusType.IKKE_AKTUELL:
        case TiltaksstatusType.FÅTT_AVSLAG:
        case TiltaksstatusType.GJENNOMFØRING_AVLYST:
        case TiltaksstatusType.TAKKET_NEI_TIL_TILBUD:
            return <XMarkOctagonFillIcon />;
        default:
            return <InformationSquareFillIcon />;
    }
};

const Tiltaksstatus = ({ tiltaksstatus }: TiltaksstatusProps) => {
    return <IconWithText iconRenderer={() => iconRenderer(tiltaksstatus)} text={tiltaksstatus} />;
};

export default Tiltaksstatus;
