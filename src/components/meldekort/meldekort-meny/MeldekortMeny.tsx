import { BodyShort, Link, VStack } from '@navikt/ds-react';
import NextLink from 'next/link';
import React, { useContext } from 'react';
import styles from './MeldekortMeny.module.css';
import { useHentMeldekortListe } from '../../../hooks/useHentMeldekortListe';
import {
  periodeTilFormatertDatotekst,
  meldekortUkeNummer,
} from '../../../utils/date';
import router from 'next/router';
import { BehandlingContext } from '../../layout/SaksbehandlingLayout';

export const MeldekortMeny = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const aktivMeldekortId = router.query.meldekortId as string;
  const { meldekortliste } = useHentMeldekortListe(true, behandlingId);

  return (
    <VStack className={styles.meldekortliste}>
      {meldekortliste.map((meldekort) => {
        return (
          <Link
            key={meldekort.id}
            as={NextLink}
            variant="neutral"
            underline={false}
            className={`${styles.listeelement} ${meldekort.id === aktivMeldekortId && styles.aktivtMeldekort}`}
            onClick={() =>
              router.push(
                `/behandling/${behandlingId}/meldekort/${meldekort.id}`,
              )
            }
            href={`/behandling/${behandlingId}/meldekort/${meldekort.id}`}
          >
            <VStack justify="center">
              <BodyShort>
                <b>{meldekortUkeNummer(meldekort.fom, meldekort.tom)}</b>
              </BodyShort>
              <BodyShort>
                {' '}
                {periodeTilFormatertDatotekst({
                  fraOgMed: meldekort.fom,
                  tilOgMed: meldekort.tom,
                })}
              </BodyShort>
            </VStack>
          </Link>
        );
      })}
    </VStack>
  );
};
