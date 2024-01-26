import React from 'react';
import {
  XMarkOctagonFillIcon,
  InformationSquareFillIcon,
  CheckmarkCircleFillIcon,
} from '@navikt/aksel-icons';
import TiltaksstatusType from '../../types/Tiltaksstatus';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';

interface TiltaksstatusProps {
  tiltaksstatus: TiltaksstatusType;
}

const iconRenderer = (tiltaksstatus: TiltaksstatusType) => {
  switch (tiltaksstatus) {
    case TiltaksstatusType.GODKJENT_TILTAKSPLASS:
    case TiltaksstatusType.TAKKET_JA_TIL_TILBUD:
    case TiltaksstatusType.GJENNOMFØRES:
    case TiltaksstatusType.FULLFØRT:
    case TiltaksstatusType.DELTAR:
    case TiltaksstatusType.VENTER_PA_OPPSTART:
    case TiltaksstatusType.PABEGYNT_REGISTRERING:
    case TiltaksstatusType.SOKT_INN:
    case TiltaksstatusType.VURDERES:
      return (
        <CheckmarkCircleFillIcon width="1.5em" height="1.5em" color="#007C2E" />
      );
    case TiltaksstatusType.AKTUELL:
    case TiltaksstatusType.VENTELISTE:
    case TiltaksstatusType.INFORMASJONSMØTE:
    case TiltaksstatusType.DELTAKELSE_AVBRUTT:
    case TiltaksstatusType.GJENNOMFØRING_AVBRUTT:
    case TiltaksstatusType.AVBRUTT:
    case TiltaksstatusType.HAR_SLUTTET:
      return (
        <InformationSquareFillIcon
          width="1.5em"
          height="1.5em"
          color="#236B7D"
        />
      );
    case TiltaksstatusType.IKKE_MØTT:
    case TiltaksstatusType.IKKE_AKTUELL:
    case TiltaksstatusType.FÅTT_AVSLAG:
    case TiltaksstatusType.GJENNOMFØRING_AVLYST:
    case TiltaksstatusType.TAKKET_NEI_TIL_TILBUD:

    case TiltaksstatusType.FEILREGISTRERT:
      return (
        <XMarkOctagonFillIcon width="1.5em" height="1.5em" color="#C30000" />
      );
    default:
      return (
        <InformationSquareFillIcon
          width="1.5em"
          height="1.5em"
          color="#236B7D"
        />
      );
  }
};

const Tiltaksstatus = ({ tiltaksstatus }: TiltaksstatusProps) => {
  return (
    <IkonMedTekst
      iconRenderer={() => iconRenderer(tiltaksstatus)}
      text={
        ` Status:
      ${
        TiltaksstatusType[
          tiltaksstatus as unknown as keyof typeof TiltaksstatusType
        ]
      } ` //TODO: Typescriptproblem
      }
    />
  );
};

export default Tiltaksstatus;
