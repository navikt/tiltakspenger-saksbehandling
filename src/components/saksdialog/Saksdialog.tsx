import React from 'react';
import { Endring } from '../../types/BehandlingTypes';
import { SaksdialogElement } from './SaksdialogElement';
import { Skuff } from '../skuff/Skuff';

interface HistorikkProps {
  endringslogg: Endring[];
}

export const Saksdialog = ({ endringslogg }: HistorikkProps) => {
  return (
    <Skuff venstreOrientert={false} headerTekst="Saksdialog">
      {endringslogg.map((endring, index) => (
        <SaksdialogElement endring={endring} key={index} />
      ))}
    </Skuff>
  );
};
