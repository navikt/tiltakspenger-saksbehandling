import { Detail, Label } from '@navikt/ds-react';
import React, { useContext } from 'react';
import styles from './MeldekortMeny.module.css';
import { useHentMeldekortListe } from '../../../hooks/useHentMeldekortListe';
import {
  ukenummerFraDate,
  periodeTilFormatertDatotekst,
} from '../../../utils/date';
import { MeldekortUtenDager } from '../../../types/MeldekortTypes';
import { useRouter } from 'next/router';
import { Skuff } from '../../skuff/Skuff';
import { BehandlingContext } from '../../layout/SaksbehandlingLayout';

const meldekortUkeNummer = (fom: string, tom: string): string => {
  return `Uke ${ukenummerFraDate(new Date(fom))} / ${ukenummerFraDate(new Date(tom))}`;
};

export const MeldekortMeny = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { meldekortliste } = useHentMeldekortListe(true, behandlingId);
  const router = useRouter();

  return (
    <Skuff venstreOrientert headerTekst="Meldekort">
      <div className={styles.meldekortliste}>
        {meldekortliste?.map((meldekort: MeldekortUtenDager) => {
          return (
            <div
              key={meldekort.id}
              className={styles.listeelement}
              onClick={() =>
                router.push(
                  `/behandling/${behandlingId}/meldekort/${meldekort.id}`,
                )
              }
            >
              <Label size="small">
                {meldekortUkeNummer(meldekort.fom, meldekort.tom)}
              </Label>
              <Detail>
                {periodeTilFormatertDatotekst({
                  fraOgMed: meldekort.fom,
                  tilOgMed: meldekort.tom,
                })}
              </Detail>
            </div>
          );
        })}
      </div>
    </Skuff>
  );
};
