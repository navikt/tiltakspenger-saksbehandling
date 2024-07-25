import React from 'react';
import {
  XMarkOctagonFillIcon,
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
} from '@navikt/aksel-icons';

interface UtfallIkonProps {
  utfall: string;
}

export const UtfallIkon = ({ utfall }: UtfallIkonProps) => {
  if (utfall === 'OPPFYLT')
    return (
      <CheckmarkCircleFillIcon
        width="1.5em"
        height="1.5em"
        color="var(--a-icon-success)"
      />
    );
  if (utfall === 'IKKE_OPPFYLT')
    return (
      <XMarkOctagonFillIcon
        width="1.5em"
        height="1.5em"
        color="var(--a-icon-danger)"
      />
    );
  if (utfall === 'KREVER_MANUELL_VURDERING')
    return (
      <ExclamationmarkTriangleFillIcon
        width="1.5em"
        height="1.5em"
        color="var(--a-icon-warning)"
      />
    );
  return (
    <ExclamationmarkTriangleFillIcon
      width="1.5em"
      height="1.5em"
      color="var(--a-icon-warning)"
    />
  );
};
