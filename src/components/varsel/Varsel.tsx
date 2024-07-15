import { Alert } from '@navikt/ds-react';
import styles from './Varsel.module.css';

interface VarselProps {
  variant: 'error' | 'warning' | 'info' | 'success';
  melding: string;
}

const Varsel = ({ variant, melding }: VarselProps) => {
  return (
    <div className={styles.varsel}>
      <Alert size="small" role="status" variant={variant}>
        {melding}
      </Alert>
    </div>
  );
};

export default Varsel;
