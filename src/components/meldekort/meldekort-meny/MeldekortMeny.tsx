import { Detail, Label } from '@navikt/ds-react';
import React from 'react';
import styles from './MeldekortMeny.module.css';
import { useHentMeldekortListe } from '../../../hooks/useHentMeldekortListe';
import {
  ukenummerFraDate,
  periodeTilFormatertDatotekst,
} from '../../../utils/date';
import { MeldekortUtenDager } from '../../../types/MeldekortTypes';
import { useRouter } from 'next/router';
import { Skuff } from '../../skuff/Skuff';

interface MeldekortmenyProps {
  behandlingId: string;
}

const meldekortUkeNummer = (fom: string, tom: string): string => {
  return `Uke ${ukenummerFraDate(new Date(fom))} / ${ukenummerFraDate(new Date(tom))}`;
};

export const MeldekortMeny = ({ behandlingId }: MeldekortmenyProps) => {
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
                  fra: meldekort.fom,
                  til: meldekort.tom,
                })}
              </Detail>
            </div>
          );
        })}
      </div>
    </Skuff>
  );
};
