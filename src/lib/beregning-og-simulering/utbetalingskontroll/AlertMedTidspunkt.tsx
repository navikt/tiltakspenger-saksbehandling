import { BodyShort, InlineMessage } from '@navikt/ds-react';
import { formaterTidspunkt } from '~/utils/date';
import { Tidspunkt } from '~/types/DatoTid';

type Props = {
    tekst: string;
    tidspunkt: Tidspunkt;
};

export const AlertMedTidspunkt = ({ tekst, tidspunkt }: Props) => {
    return (
        <InlineMessage status={'info'}>
            <BodyShort>{tekst}</BodyShort>
            <BodyShort weight={'semibold'}>{formaterTidspunkt(tidspunkt)}</BodyShort>
        </InlineMessage>
    );
};
