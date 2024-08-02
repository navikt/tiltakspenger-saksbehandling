import { Alert } from '@navikt/ds-react';
import { useState } from 'react';
import styles from './Varsel.module.css';

interface VarselProps {
  variant: 'error' | 'warning' | 'info' | 'success';
  melding: string;
}

const Varsel = ({ variant, melding }: VarselProps) => {
  const [vis, settVis] = useState<boolean>(true);
  return vis ? (
    <div className={styles.varsel}>
      <Alert
        closeButton
        role="status"
        variant={variant}
        onClick={() => settVis(false)}
      >
        {melding}
      </Alert>
    </div>
  ) : null;
};

export default Varsel;
