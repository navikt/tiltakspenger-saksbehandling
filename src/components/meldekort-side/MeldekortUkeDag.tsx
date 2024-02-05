import { HGrid, Select } from '@navikt/ds-react';
import {
  MeldekortDag,
  MeldekortDagDTO,
  MeldekortStatus,
  MeldekortStatusTekster,
} from '../../types/MeldekortTypes';
import { getDayOfWeek } from '../../utils/date';
import { velgMeldekortdagStatus } from '../../utils/meldekort';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { velgIkon } from './MeldekortUke';
import { useState } from 'react';
import styles from './Meldekort.module.css';

interface MeldekortUkeDagProps {
  meldekortDag: MeldekortDag;
  meldekortId: string;
  oppdaterMeldekortdag: (meldekortDagDTO: MeldekortDagDTO) => void;
}

export const MeldekortUkeDag = ({
  meldekortId,
  meldekortDag,
  oppdaterMeldekortdag,
}: MeldekortUkeDagProps) => {
  const [status, setStatus] = useState<MeldekortStatus>(meldekortDag.status);

  const håndterOppdaterMeldekortdag = (status: string) => {
    setStatus(status as MeldekortStatus);
    oppdaterMeldekortdag({
      meldekortId: meldekortId,
      tiltakId: '80cf0d70-cfa0-49f9-8b6c-1674f51577da',
      dato: meldekortDag.dato,
      status: status as MeldekortStatus,
    });
  };

  return (
    <HGrid
      key={meldekortDag.dato.toString()}
      columns={2}
      align="center"
      className={styles.meldekortUkeDag}
    >
      <IkonMedTekst
        text={`${getDayOfWeek(meldekortDag.dato)} ${meldekortDag.dato}`}
        iconRenderer={() => velgIkon(meldekortDag.status)}
      />
      <Select
        label="Deltatt Eller Fravær"
        id="deltattEllerFravær"
        size="small"
        hideLabel
        value={status}
        onChange={(e) => håndterOppdaterMeldekortdag(e.target.value)}
      >
        {MeldekortStatusTekster.map((meldekortStatus) => (
          <option
            key={meldekortStatus}
            value={velgMeldekortdagStatus(meldekortStatus)}
          >
            {meldekortStatus}
          </option>
        ))}
      </Select>
    </HGrid>
  );
};
