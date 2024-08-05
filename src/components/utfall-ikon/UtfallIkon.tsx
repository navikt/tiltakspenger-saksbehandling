import React from 'react';
import {
  XMarkOctagonFillIcon,
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
} from '@navikt/aksel-icons';
import { SamletUtfall } from '../../types/BehandlingTypes';

interface UtfallIkonProps {
  utfall: SamletUtfall;
}

export const UtfallIkon = ({ utfall }: UtfallIkonProps) => {
  switch (utfall) {
    case SamletUtfall.OPPFYLT || SamletUtfall.DELVIS_OPPFYLT:
      return (
        <CheckmarkCircleFillIcon
          width="1.5em"
          height="1.5em"
          color="var(--a-icon-success)"
        />
      );
    case SamletUtfall.IKKE_OPPFYLT:
      return (
        <XMarkOctagonFillIcon
          width="1.5em"
          height="1.5em"
          color="var(--a-icon-danger)"
        />
      );
    case SamletUtfall.UAVKLART:
      return (
        <ExclamationmarkTriangleFillIcon
          width="1.5em"
          height="1.5em"
          color="var(--a-icon-warning)"
        />
      );
    default:
      return (
        <ExclamationmarkTriangleFillIcon
          width="1.5em"
          height="1.5em"
          color="var(--a-icon-warning)"
        />
      );
  }
};
