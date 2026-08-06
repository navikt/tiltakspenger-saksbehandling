import {
    Utbetalingskontroll,
    UtbetalingskontrollStatus,
} from '~/lib/_felles/utbetaling/utbetalingTyper';
import { AlertMedTidspunkt } from './AlertMedTidspunkt';

type Props = {
    utbetalingskontroll: Utbetalingskontroll;
};

export const KontrollsimuleringUtførtAlert = ({ utbetalingskontroll }: Props) => {
    return (
        <AlertMedTidspunkt
            tekst={`Kontroll-simulering sist utført (${utbetalingskontrollStatusTekst[utbetalingskontroll.status]})`}
            tidspunkt={utbetalingskontroll.tidspunkt}
        />
    );
};

const utbetalingskontrollStatusTekst: Record<UtbetalingskontrollStatus, string> = {
    [UtbetalingskontrollStatus.ENDRET]: 'med endringer',
    [UtbetalingskontrollStatus.UENDRET]: 'uten endringer',
    [UtbetalingskontrollStatus.UTDATERT]: 'utdatert',
} as const;
