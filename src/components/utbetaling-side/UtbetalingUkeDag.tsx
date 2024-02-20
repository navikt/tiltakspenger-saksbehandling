import { HGrid, Select } from '@navikt/ds-react';
import {
  MeldekortStatus,
  MeldekortStatusTekster,
} from '../../types/MeldekortTypes';
import { formatDate, getDayOfWeek } from '../../utils/date';
import { velgMeldekortdagStatus } from '../../utils/meldekort';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { velgIkon } from './UtbetalingUkeVisning';
import { useState } from 'react';
import styles from './Utbetaling.module.css';
import { useHentMeldekort } from '../../hooks/useHentMeldekort';
import {UtbetalingsDagDTO} from "../../types/Utbetaling";

interface UtbetalingUkeDagProps {
  utbetalingDag: UtbetalingsDagDTO;
  utbetalingId: string;
}

export const UtbetalingUkeDag = ({
  utbetalingId,
  utbetalingDag,
}: UtbetalingUkeDagProps) => {
return(
    <div></div>
);
};
