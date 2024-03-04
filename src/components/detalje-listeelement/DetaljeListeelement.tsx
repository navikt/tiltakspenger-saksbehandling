import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import styles from './DetaljeListeelement.module.css';

interface DetaljeListeelementProps {
  iconRenderer?: () => React.ReactNode;
  label: string;
  description: string;
}

export const DetaljeListeelement = ({
  iconRenderer,
  label,
  description,
}: DetaljeListeelementProps) => {
  return (
    <div className={styles.detaljeListeelement}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        {iconRenderer && iconRenderer()}
        <Label size="small" style={{ paddingLeft: '0.5rem' }}>
          {label}
        </Label>
      </span>
      <BodyShort size="small" style={{ marginLeft: '1.6rem' }}>
        {description}
      </BodyShort>
    </div>
  );
};

export default DetaljeListeelement;
