import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { InlineMessage } from '@navikt/ds-react';

export const Sladdebanner = () => {
    const { sladdes } = useSaksbehandler();

    if (!sladdes) {
        return null;
    }

    return (
        <InlineMessage status={'warning'} size={'small'}>
            {Sladdebanner.Tekst}
        </InlineMessage>
    );
};

Sladdebanner.Tekst =
    'Personopplysninger og fritekster er sladdet for rollen din. Saker kan ellers leses som vanlig.';
