import { HGrid, Select } from '@navikt/ds-react';
import {
  MeldekortDag,
  MeldekortdagStatus,
  Meldekortstatuser,
} from '../../../types/MeldekortTypes';
import { formaterDatotekst, ukedagFraDatotekst } from '../../../utils/date';
import IkonMedTekst from '../../ikon-med-tekst/IkonMedTekst';
import { velgIkonForMeldekortStatus } from './MeldekortUke';
import { useContext, useState } from 'react';
import styles from './Meldekort.module.css';
import { BehandlingContext } from '../../layout/SaksbehandlingLayout';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import { finnMeldekortStatusTekst } from '../../../utils/tekstformateringUtils';

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
    if (dagStatus === MeldekortdagStatus.IkkeUtfylt) return;
    setStatus(dagStatus);

    const oppdaterteMeldekortDager = meldekort.meldekortDager.map((dag) => {
      if (dag.dato === meldekortDag.dato) {
        return {
          ...dag,
          status: dagStatus as MeldekortdagStatus,
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
        iconRenderer={() => velgIkonForMeldekortStatus(status)}
      />
      {status != MeldekortdagStatus.Sperret ? (
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
          <option value={MeldekortdagStatus.IkkeUtfylt}>--</option>
          {Meldekortstatuser.map((meldekortStatus) => (
            <option key={meldekortStatus} value={meldekortStatus}>
              {finnMeldekortStatusTekst(meldekortStatus)}
            </option>
          ))}
        </Select>
      ) : (
        'Ikke rett på tiltakspenger'
      )}
    </HGrid>
  );
};
