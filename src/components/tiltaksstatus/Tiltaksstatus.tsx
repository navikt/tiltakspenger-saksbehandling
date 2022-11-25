import React from 'react';
import { ErrorColored, InformationColored, SuccessColored, WarningColored } from '@navikt/ds-icons';
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
            return <SuccessColored />;
        case TiltaksstatusType.AKTUELL:
        case TiltaksstatusType.VENTELISTE:
        case TiltaksstatusType.INFORMASJONSMØTE:
        case TiltaksstatusType.DELTAKELSE_AVBRUTT:
        case TiltaksstatusType.GJENNOMFØRING_AVBRUTT:
            return <WarningColored />;
        case TiltaksstatusType.IKKE_MØTT:
        case TiltaksstatusType.IKKE_AKTUELL:
        case TiltaksstatusType.FÅTT_AVSLAG:
        case TiltaksstatusType.GJENNOMFØRING_AVLYST:
        case TiltaksstatusType.TAKKET_NEI_TIL_TILBUD:
            return <ErrorColored />;
        default:
            return <InformationColored />;
    }
};

const Tiltaksstatus = ({ tiltaksstatus }: TiltaksstatusProps) => {
    return <IconWithText iconRenderer={() => iconRenderer(tiltaksstatus)} text={tiltaksstatus} />;
};

export default Tiltaksstatus;
