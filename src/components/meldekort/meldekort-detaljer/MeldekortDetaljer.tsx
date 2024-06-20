import {
  BagdeIcon,
  InformationIcon,
  PersonCircleIcon,
} from '@navikt/aksel-icons';
import React from 'react';
import DetaljeListeelement from '../../detalje-listeelement/DetaljeListeelement';
import { Skuff } from '../../skuff/Skuff';

export const MeldekortDetaljer = () => (
  <Skuff venstreOrientert={false} headerTekst="Detaljer">
    <DetaljeListeelement
      iconRenderer={() => <BagdeIcon />}
      label="Meldekort type"
      description="Elektronisk"
    />
    <DetaljeListeelement
      iconRenderer={() => <InformationIcon />}
      label="Status"
      description="Må gåes opp"
    />
    <DetaljeListeelement
      iconRenderer={() => <PersonCircleIcon />}
      label="Signatur"
      description="Z8834556612"
    />
  </Skuff>
);
