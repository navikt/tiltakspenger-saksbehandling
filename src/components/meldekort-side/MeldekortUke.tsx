import { HGrid, Heading, Select, VStack } from '@navikt/ds-react';
import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import {
  MeldekortDag,
  MeldekortStatus,
  MeldekortStatusTekster,
} from '../../types/MeldekortTypes';
import React from 'react';
import { getDayOfWeek } from '../../utils/date';
import styles from './meldekort.module.css';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { velgMeldekortdagStatus } from '../../utils/meldekort';

interface MeldekortUkeProps {
  meldekortUke: MeldekortDag[];
  ukesnummer: number;
  fom: number;
  tom: number;
  handleOppdaterMeldekort: (
    index: number,
    status: MeldekortStatus,
    ukeNr: number
  ) => void;
  ukeNr: number;
}

export const velgIkon = (deltattEllerFravær: MeldekortStatus) => {
  switch (deltattEllerFravær) {
    case MeldekortStatus.DELTATT:
      return <CheckmarkCircleFillIcon style={{ color: 'green' }} />;

    case MeldekortStatus.IKKE_DELTATT:
    case MeldekortStatus.LØNN_FOR_TID_I_ARBEID:
      return <XMarkOctagonFillIcon style={{ color: 'red' }} />;

    case MeldekortStatus.FRAVÆR_SYK:
    case MeldekortStatus.FRAVÆR_SYKT_BARN:
    case MeldekortStatus.FRAVÆR_VELFERD:
      return <ExclamationmarkTriangleFillIcon style={{ color: 'orange' }} />;
  }
};

export const MeldekortUke = ({
  ukesnummer,
  meldekortUke,
  handleOppdaterMeldekort,
  ukeNr,
}: MeldekortUkeProps) => {
  function oppdaterMeldekort(index: number, status: string) {
    const meldekortStatus = velgMeldekortdagStatus(status);
    handleOppdaterMeldekort(index, meldekortStatus, ukeNr);
  }

  var ukedagListe = meldekortUke.map((ukedag, index) => {
    return (
      <HGrid
        key={ukedag.dato.toString() + index}
        columns={2}
        align="center"
        style={{ borderBottom: '1px solid #cfcfcf', paddingBottom: '0.5em' }}
      >
        <IkonMedTekst
          text={`${getDayOfWeek(ukedag.dato)} ${ukedag.dato.getDate()}`}
          iconRenderer={() => velgIkon(ukedag.status)}
        />
        <Select
          label="Deltatt Eller Fravær"
          id="deltattEllerFravær"
          size="small"
          hideLabel
          defaultValue={ukedag.status}
          onChange={(e) => oppdaterMeldekort(index, e.target.value)}
        >
          {MeldekortStatusTekster.map((meldekortStatus) => (
            <option
              key={meldekortStatus.tekst}
              value={velgMeldekortdagStatus(meldekortStatus.tekst)}
            >
              {meldekortStatus.tekst}
            </option>
          ))}
        </Select>
      </HGrid>
    );
  });

  return (
    <VStack gap="2" className={styles.MeldekortUke}>
      <Heading
        size="small"
        style={{ borderBottom: '1px solid #cfcfcf', paddingBottom: '0.5em' }}
      >
        Uke {ukesnummer} - Jan 2024
      </Heading>
      {ukedagListe}
    </VStack>
  );
};
