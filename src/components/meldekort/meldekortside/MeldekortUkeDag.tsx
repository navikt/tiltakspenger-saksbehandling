import { HGrid, Select } from '@navikt/ds-react';
import { MeldekortDag } from '../../../types/MeldekortTypes';
import { formaterDatotekst, ukedagFraDatotekst } from '../../../utils/date';
import IkonMedTekst from '../../ikon-med-tekst/IkonMedTekst';
import { velgIkonForMeldekortStatus } from './MeldekortUke';
import { useContext, useState } from 'react';
import styles from './Meldekort.module.css';
import {
  MeldekortStatus,
  tekstTilMeldekortStatus,
} from '../../../utils/meldekortStatus';
import { BehandlingContext } from '../../layout/SaksbehandlingLayout';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';

interface MeldekortUkeDagProps {
  meldekortDag: MeldekortDag;
  meldekortId: string;
}

export const MeldekortUkeDag = ({
  meldekortId,
  meldekortDag,
}: MeldekortUkeDagProps) => {
  const { sakId } = useContext(BehandlingContext);
  const { meldekort, mutate } = useHentMeldekort(meldekortId, sakId);

  const [status, setStatus] = useState<MeldekortStatus>(meldekortDag.status);

  const oppdaterMeldekortdag = (dagStatus: string) => {
    if (dagStatus === '') return;
    setStatus(dagStatus as MeldekortStatus);

    const oppdaterteMeldekortDager = meldekort.meldekortDager.map(dag => {
      if (dag.dato === meldekortDag.dato) {
        return {
          ...dag,
          status: dagStatus as MeldekortStatus
        }
      } else {
        return dag
      }
    })

    mutate({
      ...meldekort,
      meldekortDager: oppdaterteMeldekortDager
    })
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
          onChange={(e) => {
            oppdaterMeldekortdag(e.target.value);
          }}
        >
          {/* Denne er kanskje ikke så frontendete.. BENNY! HALP!! */}
          {Object.entries(tekstTilMeldekortStatus)
            .filter(([_, value]) => value !== MeldekortStatus.Sperret)
            .map(([key, value]) => (
              <option key={key} value={value}>
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
