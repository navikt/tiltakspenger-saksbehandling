import React from 'react';
import { SaksdialogElement } from './SaksdialogElement';
import { Skuff } from '../skuff/Skuff';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';

export const Saksdialog = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling } = useHentBehandling(behandlingId);

  return (
    <Skuff venstreOrientert={false} headerTekst="Saksdialog">
      {valgtBehandling.endringslogg.map((endring, index) => (
        <SaksdialogElement endring={endring} key={index} />
      ))}
    </Skuff>
  );
};
