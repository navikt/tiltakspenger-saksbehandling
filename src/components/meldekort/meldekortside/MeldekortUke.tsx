import { Heading, VStack } from '@navikt/ds-react';
import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  XMarkOctagonFillIcon,
  CircleSlashIcon,
} from '@navikt/aksel-icons';
import {
  MeldekortDag,
  MeldekortdagStatus,
} from '../../../types/MeldekortTypes';
import React from 'react';
import styles from './Meldekort.module.css';
import { MeldekortUkeDag } from './MeldekortUkeDag';

interface MeldekortUkeProps {
  meldekortUke: MeldekortDag[];
  meldekortId: string;
  sakId: string;
  heading: string;
}

export const velgIkonForMeldekortStatus = (status: string) => {
  switch (status) {
    case MeldekortdagStatus.Sperret:
      return <CircleSlashIcon color="black" />;

    case MeldekortdagStatus.DeltattUtenLønnITiltaket:
    case MeldekortdagStatus.FraværVelferdGodkjentAvNav:
      return <CheckmarkCircleFillIcon color="green" />;

    case MeldekortdagStatus.IkkeDeltatt:
    case MeldekortdagStatus.DeltattMedLønnITiltaket:
    case MeldekortdagStatus.FraværVelferdIkkeGodkjentAvNav:
      return <XMarkOctagonFillIcon color="red" />;

    case MeldekortdagStatus.IkkeUtfylt:
    case MeldekortdagStatus.FraværSyk:
    case MeldekortdagStatus.FraværSyktBarn:
      return <ExclamationmarkTriangleFillIcon color="orange" />;
  }
};

export const MeldekortUke = ({
  meldekortUke,
  heading,
  meldekortId,
  sakId,
}: MeldekortUkeProps) => {
  return (
    <VStack className={styles.meldekortUke}>
      <Heading size="small" className={styles.heading}>
        {heading}
      </Heading>
      {meldekortUke.map((ukedag) => (
        <MeldekortUkeDag
          key={ukedag.dato.toString()}
          meldekortDag={ukedag}
          meldekortId={meldekortId}
          sakId={sakId}
        />
      ))}
    </VStack>
  );
};
