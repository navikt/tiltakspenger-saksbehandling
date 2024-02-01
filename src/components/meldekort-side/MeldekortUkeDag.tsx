import { HGrid, Select } from '@navikt/ds-react';
import {
  MeldekortDag,
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
  håndterOppdaterMeldekortdag: () => void;
}

export const MeldekortUkeDag = ({ meldekortDag }: MeldekortUkeDagProps) => {
  const [status, setStatus] = useState<string>(meldekortDag.status.toString());

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
        onChange={(e) => setStatus(e.target.value)}
      >
        {MeldekortStatusTekster.map((meldekortStatus) => (
          <option
            key={meldekortStatus}
            value={velgMeldekortdagStatus(meldekortStatus).toString()}
          >
            {meldekortStatus}
          </option>
        ))}
      </Select>
    </HGrid>
  );
};
