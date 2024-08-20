import { HGrid, Select } from '@navikt/ds-react';
import {
  MeldekortDag,
} from '../../../types/MeldekortTypes';
import { formaterDatotekst, ukedagFraDatotekst } from '../../../utils/date';
import IkonMedTekst from '../../ikon-med-tekst/IkonMedTekst';
import { velgIkonForMeldekortStatus } from './MeldekortUke';
import { useState } from 'react';
import styles from './Meldekort.module.css';
import { useOppdaterMeldekortdag } from '../../../hooks/meldekort/useOppdaterMeldekortdag';
import { useHentMeldekortBeregning } from '../../../hooks/meldekort/useHentMeldekortBeregning';
import { MeldekortStatus, meldekortStatusTilTekst, tekstTilMeldekortStatus } from '../../../utils/meldekortStatus';

interface MeldekortUkeDagProps {
  meldekortDag: MeldekortDag;
  meldekortId: string;
}

export const MeldekortUkeDag = ({
  meldekortId,
  meldekortDag,
}: MeldekortUkeDagProps) => {
  const [status, setStatus] = useState<MeldekortStatus>(meldekortDag.status);
  const { mutate } = useHentMeldekortBeregning(meldekortId);
  const { onOppdaterDag } = useOppdaterMeldekortdag();

  const oppdaterMeldekortdag = (dagStatus: string) => {
    if (dagStatus === '') return;
    setStatus(dagStatus as MeldekortStatus);

    onOppdaterDag({
      meldekortId: meldekortId,
      dato: meldekortDag.dato,
      status: dagStatus as MeldekortStatus,
    }),
      mutate();
  };

  return (
    <HGrid
      key={meldekortDag.dato.toString()}
      columns={2}
      align="center"
      className={styles.meldekortUkeDag}
    >
      <IkonMedTekst
        text={`${ukedagFraDatotekst(meldekortDag.dato)} ${formaterDatotekst(meldekortDag.dato.toString())}`}
        iconRenderer={() => velgIkonForMeldekortStatus(status)}
      />
      {status != MeldekortStatus.Sperret ? (
        <Select
          label="Deltatt Eller Fravær"
          id="deltattEllerFravær"
          size="small"
          hideLabel
          value={status}
          onChange={(e) => oppdaterMeldekortdag(e.target.value)}
        >
          {/* Denne er kanskje ikke så frontendete.. BENNY! HALP!! */}
          {Object.entries(tekstTilMeldekortStatus)
            .filter(([_, value]) => value !== MeldekortStatus.Sperret)
            .map(([key, value]) => (
              <option
                key={key}
                value={value}
              >
                {key}
              </option>
            ))}
        </Select>
      ) : (
        'Ikke rett på tiltakspenger'
      )}
    </HGrid>
  );
};
