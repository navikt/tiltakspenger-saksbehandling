import {
  BagdeIcon,
  InformationIcon,
  PersonCircleIcon,
} from '@navikt/aksel-icons';
import React from 'react';
import DetaljeListeelement from './detalje-listeelement/DetaljeListeelement';
import { Skuff } from '../skuff/Skuff';

export const MeldekortDetaljer = () => (
  <Skuff venstreOrientert={false} headerTekst="Detaljer">
    <DetaljeListeelement
      iconRenderer={() => <BagdeIcon />}
      label="Meldekort type"
      discription="Elektronisk"
    />
    <DetaljeListeelement
      iconRenderer={() => <InformationIcon />}
      label="Status"
      discription="Må gåes opp"
    />
    <DetaljeListeelement
      iconRenderer={() => <PersonCircleIcon />}
      label="Signatur"
      discription="Z8834556612"
    />
  </Skuff>
);
