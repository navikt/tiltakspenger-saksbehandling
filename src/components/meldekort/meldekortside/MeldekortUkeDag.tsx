import { HGrid, Select } from '@navikt/ds-react';
import { MeldekortDag } from '../../../types/MeldekortTypes';
import { formaterDatotekst, ukedagFraDatotekst } from '../../../utils/date';
import IkonMedTekst from '../../ikon-med-tekst/IkonMedTekst';
import { velgIkonForMeldekortStatus } from './MeldekortUke';
import { useContext, useState } from 'react';
import styles from './Meldekort.module.css';
import {
  MeldekortStatus,
  MeldekortStatusTekster,
} from '../../../utils/meldekortStatus';
import { BehandlingContext } from '../../layout/SaksbehandlingLayout';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import { finnMeldekortStatus } from '../../../utils/tekstformateringUtils';

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
  const [status, setStatus] = useState<string>(meldekortDag.status);

  const oppdaterMeldekortdag = (dagStatus: string) => {
    if (dagStatus === MeldekortStatus.IkkeUtfylt) return;
    setStatus(dagStatus);

    const oppdaterteMeldekortDager = meldekort.meldekortDager.map((dag) => {
      if (dag.dato === meldekortDag.dato) {
        return {
          ...dag,
          status: finnMeldekortStatus(dagStatus),
        };
      } else {
        return dag;
      }
    });

    mutate(
      {
        ...meldekort,
        meldekortDager: oppdaterteMeldekortDager,
      },
      { populateCache: true, revalidate: false },
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
        text={`${ukedagFraDatotekst(meldekortDag.dato)} ${formaterDatotekst(meldekortDag.dato.toString())}`}
        iconRenderer={() =>
          velgIkonForMeldekortStatus(finnMeldekortStatus(status))
        }
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
          <option value={MeldekortStatus.IkkeUtfylt}>Ikke utfylt</option>
          {MeldekortStatusTekster.map((meldekortStatus) => (
            <option key={meldekortStatus} value={meldekortStatus}>
              {meldekortStatus}
            </option>
          ))}
        </Select>
      ) : (
        'Ikke rett på tiltakspenger'
      )}
    </HGrid>
  );
};
