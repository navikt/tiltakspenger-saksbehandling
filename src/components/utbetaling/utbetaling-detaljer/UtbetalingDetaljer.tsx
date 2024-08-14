import React from 'react';
import router from 'next/router';
import DetaljeListeelement from '../../detalje-listeelement/DetaljeListeelement';
import { VStack } from '@navikt/ds-react';
import { useHentUtbetalingVedtak } from '../../../hooks/utbetaling/useHentUtbetalingVedtak';

export const UtbetalingDetaljer = () => {
  const utbetalingVedtakId = router.query.utbetalingId as string;
  const { utbetalingVedtak } = useHentUtbetalingVedtak(utbetalingVedtakId);

  return (
    <VStack>
      <DetaljeListeelement
        label="Tiltakspenger sats"
        description={utbetalingVedtak?.sats.toString() ?? 'Fant ikke sats'}
      />
      <DetaljeListeelement
        label="Barnetillegg sats"
        description={
          utbetalingVedtak?.satsBarnetillegg.toString() ?? 'Fant ikke sats'
        }
      />
      <DetaljeListeelement
        label="Redusert tiltakspenger sats"
        description={
          utbetalingVedtak?.satsDelvis.toString() ?? 'Fant ikke sats'
        }
      />
      <DetaljeListeelement
        label="Redusert barnetillegg sats"
        description={
          utbetalingVedtak?.satsBarnetilleggDelvis.toString() ??
          'Fant ikke sats'
        }
      />
      {utbetalingVedtak && (
        <DetaljeListeelement
          label="Antall barn"
          description={utbetalingVedtak?.antallBarn.toString()}
        />
      )}
    </VStack>
  );
};
