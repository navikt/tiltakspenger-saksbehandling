import { Alert } from '@navikt/ds-react';
import { useState } from 'react';
import { classNames } from '../../utils/classNames';

import styles from './Varsel.module.css';

interface VarselProps {
    variant: 'error' | 'warning' | 'info' | 'success';
    melding: string;
    marginX?: boolean;
    className?: string;
}

const Varsel = ({ variant, melding, marginX = false, className }: VarselProps) => {
    const [vis, settVis] = useState<boolean>(true);
    return vis ? (
        <div className={classNames(styles.varsel, marginX && styles.marginX, className)}>
            <Alert closeButton role="status" variant={variant} onClick={() => settVis(false)}>
                {melding}
            </Alert>
        </div>
    ) : null;
};

export default Varsel;
