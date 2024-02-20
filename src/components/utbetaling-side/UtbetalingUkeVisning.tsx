import {Heading, Table, VStack} from '@navikt/ds-react';
import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { MeldekortStatus } from '../../types/MeldekortTypes';
import React from 'react';
import styles from './Utbetaling.module.css';

import { UtbetalingUkeDag } from './UtbetalingUkeDag';
import {UtbetalingsDagDTO} from "../../types/Utbetaling";

interface UtbetalingUkeProps {
  utbetalingUke: UtbetalingsDagDTO[];
  utbetalingId: string,
}

export const velgIkon = (deltattEllerFravær: MeldekortStatus) => {
  switch (deltattEllerFravær) {
    case MeldekortStatus.Deltatt:
      return <CheckmarkCircleFillIcon color='green' />;

    case MeldekortStatus.IkkeDeltatt:
    case MeldekortStatus.Lønn:
      return <XMarkOctagonFillIcon color='red'/>;

    case MeldekortStatus.FraværSyk:
    case MeldekortStatus.FraværSyktBarn:
    case MeldekortStatus.FraværVelferd:
    case MeldekortStatus.IkkeUtfylt:
      return <ExclamationmarkTriangleFillIcon color='orange'/>;
  }
};

export const UtbetalingUkeVisning = ({
  utbetalingUke,
  utbetalingId,
}: UtbetalingUkeProps) => {
  return (
      <>
          {utbetalingUke.map((ukedag) => (
              <UtbetalingUkeDag
                  key={ukedag.dato.toString()}
                  utbetalingDag={ukedag}
                  utbetalingId={utbetalingId}
              />
          ))}
      </>
  );
};
