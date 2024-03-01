import React from 'react';
import { useRouter } from 'next/router';
import { useHentUtbetalingVedtak } from '../../hooks/useHentUtbetalingVedtak';
import { Skuff } from '../skuff/Skuff';
import DetaljeListeelement from '../detalje-listeelement/DetaljeListeelement';

export const UtbetalingDetaljer = () => {
  const router = useRouter();
  const utbetalingVedtakId = router.query.utbetalingId as string;
  const { utbetalingVedtak } = useHentUtbetalingVedtak(utbetalingVedtakId);

  return (
    <Skuff venstreOrientert={false} headerTekst="Detaljer">
      <DetaljeListeelement label="Tiltakspenger sats" description="285" />
      <DetaljeListeelement label="Barnetillegg sats" description="55" />
      <DetaljeListeelement
        label="Redusert tiltakspenger sats"
        description="214"
      />
      <DetaljeListeelement
        label="Redusert barnetillegg sats"
        description="42"
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
