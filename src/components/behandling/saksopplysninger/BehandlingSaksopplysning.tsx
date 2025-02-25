import { BodyShort } from '@navikt/ds-react';
import { classNames } from '../../../utils/classNames';

import style from './BehandlingSaksopplysning.module.css';

type Props = { navn: string; verdi: string; spacing?: boolean };

export const BehandlingSaksopplysning = ({ navn, verdi, spacing }: Props) => {
    return (
        <BodyShort
            size={'small'}
            className={classNames(style.opplysning, spacing && style.spacing)}
        >
            {`${navn}: `}
            <strong>{verdi}</strong>
        </BodyShort>
    );
};
