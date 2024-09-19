import styles from './Meldekort.module.css';
import { Heading, Loader, VStack } from '@navikt/ds-react';
import router from 'next/router';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import { meldekortHeading } from '../../../utils/date';
import {
  MeldekortdagStatus,
  Meldekortstatus,
} from '../../../types/MeldekortTypes';
import { useContext } from 'react';
import { SakContext } from '../../layout/SakLayout';
import {
  CircleSlashIcon,
  CheckmarkCircleFillIcon,
  XMarkOctagonFillIcon,
  ExclamationmarkTriangleFillIcon,
} from '@navikt/aksel-icons';
import Meldekort from './Meldekort';
import Meldekortoppsummering from './Meldekortoppsummering';

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

export const MeldekortSide = () => {
  const { sakId } = useContext(SakContext);
  const meldekortId = router.query.meldekortId as string;
  const { meldekort, isLoading } = useHentMeldekort(meldekortId, sakId);

  if (isLoading || !meldekort) return <Loader />;

  return (
    <VStack gap="5" className={styles.wrapper}>
      <Heading level="2" size="medium">
        {meldekortHeading(meldekort.periode)}
      </Heading>
      {meldekort.status != Meldekortstatus.KLAR_TIL_UTFYLLING ? (
        <Meldekortoppsummering />
      ) : (
        <Meldekort />
      )}
    </VStack>
  );
};
