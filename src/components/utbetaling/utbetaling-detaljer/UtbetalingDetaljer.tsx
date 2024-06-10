import React from 'react';
import { useRouter } from 'next/router';
import { useHentUtbetalingVedtak } from '../../../hooks/useHentUtbetalingVedtak';
import { Skuff } from '../../skuff/Skuff';
import DetaljeListeelement from '../../detalje-listeelement/DetaljeListeelement';

export const UtbetalingDetaljer = () => {
  const router = useRouter();
  const utbetalingVedtakId = router.query.utbetalingId as string;
  const { utbetalingVedtak } = useHentUtbetalingVedtak(utbetalingVedtakId);

  return (
    <Skuff venstreOrientert={false} headerTekst="Detaljer">
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
    </Skuff>
  );
};
