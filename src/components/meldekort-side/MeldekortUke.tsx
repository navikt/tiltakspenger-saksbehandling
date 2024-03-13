import { Heading, VStack } from '@navikt/ds-react';
import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  XMarkOctagonFillIcon,
  CircleSlashIcon,
} from '@navikt/aksel-icons';
import { MeldekortDag, MeldekortStatus } from '../../types/MeldekortTypes';
import React from 'react';
import styles from './Meldekort.module.css';
import { MeldekortUkeDag } from './MeldekortUkeDag';

interface MeldekortUkeProps {
  meldekortUke: MeldekortDag[];
  ukesnummer: number;
  meldekortId: string;
}

export const velgIkon = (deltattEllerFravær: MeldekortStatus) => {
  switch (deltattEllerFravær) {
    case MeldekortStatus.Sperret:
      return <CircleSlashIcon color='black' />;
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

export const MeldekortUke = ({
  meldekortUke,
  ukesnummer,
  meldekortId,
}: MeldekortUkeProps) => {
  return (
    <VStack className={styles.meldekortUke}>
      <Heading
        size="small"
        className={styles.heading}
      >
        Uke {ukesnummer}
      </Heading>
      {meldekortUke.map((ukedag) => (
        <MeldekortUkeDag
          key={ukedag.dato.toString()}
          meldekortDag={ukedag}
          meldekortId={meldekortId}
        />
      ))}
    </VStack>
  );
};
