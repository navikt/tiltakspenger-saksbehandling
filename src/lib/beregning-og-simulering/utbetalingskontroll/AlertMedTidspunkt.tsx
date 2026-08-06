import { BodyShort, InlineMessage } from '@navikt/ds-react';
import { formaterTidspunkt } from '~/utils/date';

type Props = {
    tekst: string;
    tidspunkt: string;
};

export const AlertMedTidspunkt = ({ tekst, tidspunkt }: Props) => {
    return (
        <InlineMessage status={'info'}>
            <BodyShort>{tekst}</BodyShort>
            <BodyShort weight={'semibold'}>{formaterTidspunkt(tidspunkt)}</BodyShort>
        </InlineMessage>
    );
};
