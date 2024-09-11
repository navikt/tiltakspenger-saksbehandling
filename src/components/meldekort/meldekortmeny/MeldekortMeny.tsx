import { BodyShort, Link, Loader, VStack } from '@navikt/ds-react';
import NextLink from 'next/link';
import React, { useContext } from 'react';
import styles from './MeldekortMeny.module.css';
import {
  periodeTilFormatertDatotekst,
  meldekortHeading,
} from '../../../utils/date';
import router from 'next/router';
import { BehandlingContext } from '../../layout/SaksbehandlingLayout';
import { useHentMeldekortListe } from '../../../hooks/meldekort/useHentMeldekortListe';

export const MeldekortMeny = () => {
  const { behandlingId, sakId } = useContext(BehandlingContext);
  const aktivMeldekortId = router.query.meldekortId as string;
  const { meldekortliste, isLoading, error } = useHentMeldekortListe(
    true,
    sakId,
  );

  if (isLoading || !meldekortliste) return <Loader />;
  else if (error) return null;

  return (
    <VStack className={styles.meldekortliste}>
      {meldekortliste.map((meldekort) => {
        return (
          <Link
            key={meldekort.meldekortId}
            as={NextLink}
            variant="neutral"
            underline={false}
            className={`${styles.listeelement} ${meldekort.meldekortId === aktivMeldekortId && styles.aktivtMeldekort}`}
            onClick={() =>
              router.push(
                `/behandling/${behandlingId}/meldekort/${meldekort.meldekortId}`,
              )
            }
            href={`/behandling/${behandlingId}/meldekort/${meldekort.meldekortId}`}
          >
            <VStack justify="center">
              <BodyShort>
                <b>{meldekortHeading(meldekort.periode)}</b>
              </BodyShort>
              <BodyShort>
                {' '}
                {periodeTilFormatertDatotekst({
                  fraOgMed: meldekort.periode.fraOgMed,
                  tilOgMed: meldekort.periode.tilOgMed,
                })}
              </BodyShort>
            </VStack>
          </Link>
        );
      })}
    </VStack>
  );
};
