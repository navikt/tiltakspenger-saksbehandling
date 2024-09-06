import { BodyShort, HGrid, Select } from '@navikt/ds-react';
import {
  MeldekortDag,
  MeldekortdagStatus,
  Meldekortstatus,
  Meldekortstatuser,
} from '../../../types/MeldekortTypes';
import { formaterDatotekst, ukedagFraDatotekst } from '../../../utils/date';
import IkonMedTekst from '../../ikon-med-tekst/IkonMedTekst';
import { velgIkonForMeldekortStatus } from './MeldekortUke';
import { useState } from 'react';
import styles from './Meldekort.module.css';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import { finnMeldekortdagStatusTekst } from '../../../utils/tekstformateringUtils';

interface MeldekortUkeDagProps {
  meldekortDag: MeldekortDag;
  meldekortId: string;
  sakId: string;
}

export const MeldekortUkeDag = ({
  meldekortId,
  meldekortDag,
  sakId,
}: MeldekortUkeDagProps) => {
  const { meldekort, mutate } = useHentMeldekort(meldekortId, sakId);
  const [status, setStatus] = useState<string>(meldekortDag.status);

  const oppdaterMeldekortdag = (dagStatus: string) => {
    if (dagStatus === MeldekortdagStatus.IkkeUtfylt) return;
    setStatus(dagStatus);

    const oppdaterteMeldekortDager =
      meldekort &&
      meldekort.meldekortDager.map((dag) => {
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
      {meldekort.status === Meldekortstatus.KLAR_TIL_UTFYLLING ? (
        status != MeldekortdagStatus.Sperret ? (
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
                {finnMeldekortdagStatusTekst(meldekortStatus)}
              </option>
            ))}
          </Select>
        ) : (
          <BodyShort>Ikke rett på tiltakspenger</BodyShort>
        )
      ) : (
        <BodyShort>
          {finnMeldekortdagStatusTekst(meldekortDag.status)}
        </BodyShort>
      )}
    </HGrid>
  );
};
