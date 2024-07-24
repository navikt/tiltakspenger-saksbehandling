import React, { useContext } from 'react';
import { SaksdialogElement } from './SaksdialogElement';
import { Skuff } from '../skuff/Skuff';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';
import { Loader } from '@navikt/ds-react';

export const Saksdialog = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
    <Skuff venstreOrientert={false} headerTekst="Saksdialog">
      {valgtBehandling.endringslogg.map((endring, index) => (
        <SaksdialogElement endring={endring} key={index} />
      ))}
    </Skuff>
  );
};
