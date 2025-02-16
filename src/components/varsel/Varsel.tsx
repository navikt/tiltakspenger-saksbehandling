import { Alert } from '@navikt/ds-react';
import React, { useState } from 'react';
import { classNames } from '../../utils/classNames';

import styles from './Varsel.module.css';

type Props = {
    melding: string;
    marginX?: boolean;
    className?: string;
} & Omit<React.ComponentProps<typeof Alert>, 'children'>;

const Varsel = ({ melding, marginX = false, className, ...alertProps }: Props) => {
    const [vis, settVis] = useState<boolean>(true);

    return vis ? (
        <div className={classNames(styles.varsel, marginX && styles.marginX, className)}>
            <Alert {...alertProps} closeButton role="status" onClick={() => settVis(false)}>
                {melding}
            </Alert>
        </div>
    ) : null;
};

export default Varsel;
