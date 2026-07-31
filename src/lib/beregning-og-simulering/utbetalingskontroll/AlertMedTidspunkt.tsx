import { Alert, BodyShort } from '@navikt/ds-react';
import { formaterTidspunkt } from '~/utils/date';

type Props = {
    tekst: string;
    tidspunkt: string;
};

export const AlertMedTidspunkt = ({ tekst, tidspunkt }: Props) => {
    return (
        <Alert variant={'info'} inline={true}>
            <BodyShort>{tekst}</BodyShort>
            <BodyShort weight={'semibold'}>{formaterTidspunkt(tidspunkt)}</BodyShort>
        </Alert>
    );
};
