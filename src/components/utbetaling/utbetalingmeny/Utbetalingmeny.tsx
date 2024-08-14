import { BodyShort, Link, VStack } from '@navikt/ds-react';
import React, { useContext } from 'react';
import styles from './Utbetalingmeny.module.css';
import {
  periodeTilFormatertDatotekst,
  ukenummerHeading,
} from '../../../utils/date';
import NextLink from 'next/link';
import router from 'next/router';
import { BehandlingContext } from '../../layout/SaksbehandlingLayout';
import { useHentUtbetalingListe } from '../../../hooks/utbetaling/useHentUtbetalingListe';

export const Utbetalingmeny = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { utbetalingliste } = useHentUtbetalingListe(true, behandlingId);
  const aktivUtbetalingId = router.query.utbetalingId as string;

  return (
    <VStack className={styles.utbetalingliste}>
      {utbetalingliste.map((utbetaling) => {
        return (
          <Link
            key={utbetaling.id}
            as={NextLink}
            variant="neutral"
            underline={false}
            className={`${styles.listeelement} ${utbetaling.id === aktivUtbetalingId && styles.aktivUtbetaling}`}
            onClick={() =>
              router.push(
                `/behandling/${behandlingId}/utbetaling/${utbetaling.id}`,
              )
            }
            href={`/behandling/${behandlingId}/utbetaling/${utbetaling.id}`}
          >
            <VStack justify="center">
              <BodyShort>
                <b>{ukenummerHeading(utbetaling.fom, utbetaling.tom)}</b>
              </BodyShort>
              <BodyShort>
                {periodeTilFormatertDatotekst({
                  fraOgMed: utbetaling.fom,
                  tilOgMed: utbetaling.tom,
                })}
              </BodyShort>
            </VStack>
          </Link>
        );
      })}
    </VStack>
  );
};
