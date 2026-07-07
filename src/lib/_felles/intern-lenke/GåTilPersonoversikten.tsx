import { InternLenke } from './InternLenke';
import { personoversiktUrl } from '~/utils/urls';

/**
 * Lenke tilbake til personoversikten for en sak.
 * Brukes i feiltilstander der videre handling i skjemaet ikke lenger gir mening.
 */
export const GåTilPersonoversikten = ({
    saksnummer,
    onClick,
}: {
    saksnummer: string;
    onClick?: () => void;
}) => {
    return (
        <InternLenke href={personoversiktUrl(saksnummer)} onClick={onClick}>
            Gå til personoversikten
        </InternLenke>
    );
};
