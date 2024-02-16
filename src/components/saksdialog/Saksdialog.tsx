import styles from './Saksdialog.module.css';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import React from 'react';
import { Heading } from '@navikt/ds-react';
import { Endring } from '../../types/Behandling';
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
