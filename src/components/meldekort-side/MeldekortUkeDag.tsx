import { HGrid, Select } from '@navikt/ds-react';
import {
  MeldekortDag,
  MeldekortStatus,
  MeldekortStatusTekster,
} from '../../types/MeldekortTypes';
import { formatDate, getDayOfWeek } from '../../utils/date';
import { velgMeldekortdagStatus } from '../../utils/meldekort';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { velgIkon } from './MeldekortUke';
import {useState} from 'react';
import styles from './Meldekort.module.css';
import {useHentMeldekortBeregning} from "../../hooks/useHentMeldekortBeregning";

interface MeldekortUkeDagProps {
  meldekortDag: MeldekortDag;
  meldekortId: string;
  handleMeldekortStatusEndret: (v: any) => void;
}

export const MeldekortUkeDag = ({
  meldekortId,
  meldekortDag,
  handleMeldekortStatusEndret,
}: MeldekortUkeDagProps) => {
  const [status, setStatus] = useState<MeldekortStatus>(meldekortDag.status);
  const { mutate } = useHentMeldekortBeregning(meldekortId);

  const oppdaterMeldekortdag = (dagStatus: string) => {
    if (dagStatus === '') return;
    setStatus(dagStatus as MeldekortStatus);
    handleMeldekortStatusEndret(true);
    fetch(`/api/meldekort/oppdaterDag`, {
      method: 'POST',
      body: JSON.stringify({
        meldekortId: meldekortId,
        dato: meldekortDag.dato,
        status: dagStatus as MeldekortStatus,
      }),
    }).then(() => {
          mutate();
        }
    );
  };

  return (
    <HGrid
      key={meldekortDag.dato.toString()}
      columns={2}
      align="center"
      className={styles.meldekortUkeDag}
    >
      <IkonMedTekst
        text={`${getDayOfWeek(meldekortDag.dato)} ${formatDate(meldekortDag.dato.toString(),)}`}
        iconRenderer={() => velgIkon(status)}
      />
      <Select
        label="Deltatt Eller Fravær"
        id="deltattEllerFravær"
        size="small"
        hideLabel
        value={status}
        onChange={(e) => oppdaterMeldekortdag(e.target.value)}
      >
        <option value="">Ikke utfylt</option>
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
