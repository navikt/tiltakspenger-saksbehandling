import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import styles from './DetaljeListeelement.module.css';

interface DetaljeListeelementProps {
  iconRenderer: () => React.ReactNode;
  label: string;
  discription: string;
}

export const DetaljeListeelement = ({
  iconRenderer,
  label,
  discription,
}: DetaljeListeelementProps) => {
  return (
    <div className={styles.detaljeListeelement}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        {iconRenderer()}
        <Label size="small" style={{ paddingLeft: '0.5rem' }}>
          {label}
        </Label>
      </span>
      <BodyShort size="small" style={{ marginLeft: '1.6rem' }}>
        {discription}
      </BodyShort>
    </div>
  );
};

export default DetaljeListeelement;
