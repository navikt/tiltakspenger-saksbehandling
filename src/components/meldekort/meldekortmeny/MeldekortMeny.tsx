import { BodyShort, Link, Loader, VStack } from '@navikt/ds-react';
import NextLink from 'next/link';
import React, { useContext } from 'react';
import styles from './MeldekortMeny.module.css';
import {
  periodeTilFormatertDatotekst,
  ukenummerHeading,
} from '../../../utils/date';
import router from 'next/router';
import { BehandlingContext } from '../../layout/SaksbehandlingLayout';
import { useHentMeldekortListe } from '../../../hooks/meldekort/useHentMeldekortListe';

export const MeldekortMeny = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const aktivMeldekortId = router.query.meldekortId as string;
  const { meldekortliste, isLoading, error } = useHentMeldekortListe(
    true,
    behandlingId,
  );

  if (isLoading || !meldekortliste) return <Loader />;
  else if (error) return null;

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
                <b>{ukenummerHeading(meldekort.fom, meldekort.tom)}</b>
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
