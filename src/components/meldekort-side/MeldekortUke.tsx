import { Heading, VStack } from '@navikt/ds-react';
import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { MeldekortDag, MeldekortStatus } from '../../types/MeldekortTypes';
import React from 'react';
import styles from './Meldekort.module.css';

import { MeldekortUkeDag } from './MeldekortUkeDag';

interface MeldekortUkeProps {
  meldekortUke: MeldekortDag[];
  ukesnummer: number;
  handleOppdaterMeldekort: (
    index: number,
    status: MeldekortStatus,
    ukeNr: number
  ) => void;
}

export const velgIkon = (deltattEllerFravær: MeldekortStatus) => {
  switch (deltattEllerFravær) {
    case MeldekortStatus.Deltatt:
      return <CheckmarkCircleFillIcon style={{ color: 'green' }} />;

    case MeldekortStatus.IkkeDeltatt:
    case MeldekortStatus.Lønn:
      return <XMarkOctagonFillIcon style={{ color: 'red' }} />;

    case MeldekortStatus.FraværSyk:
    case MeldekortStatus.FraværSyktBarn:
    case MeldekortStatus.FraværVelferd:
      return <ExclamationmarkTriangleFillIcon style={{ color: 'orange' }} />;
  }
};

export const MeldekortUke = ({
  meldekortUke,
  ukesnummer,
  handleOppdaterMeldekort,
}: MeldekortUkeProps) => {
  return (
    <VStack gap="2" className={styles.MeldekortUke}>
      <Heading
        size="small"
        style={{ borderBottom: '1px solid #cfcfcf', paddingBottom: '0.5em' }}
      >
        Uke
      </Heading>
      {meldekortUke.map((ukedag) => (
        <MeldekortUkeDag
          key={ukedag.dato.toString()}
          meldekortDag={ukedag}
          håndterOppdaterMeldekortdag={() => handleOppdaterMeldekort}
        />
      ))}
    </VStack>
  );
};
