import { Button } from '@navikt/ds-react';
import { useOppdaterMeldekortbehandlingV2 } from '~/lib/meldekort/v2/meldekortbehandling/handlinger/lagre/useOppdaterMeldekortbehandlingV2';
import { useSak } from '~/lib/sak/SakContext';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';

export const MeldekortbehandlingLagre = () => {
    const { sak, setSak } = useSak();
    const { id } = useMeldekortbehandling();

    const { tilDTO } = useMeldekortbehandlingSkjema();

    const { trigger, isMutating } = useOppdaterMeldekortbehandlingV2({
        sakId: sak.sakId,
        meldekortbehandlingId: id,
    });

    return (
        <Button
            loading={isMutating}
            onClick={() => {
                trigger(tilDTO()).then((sak) => {
                    if (sak) {
                        setSak(sak);
                    }
                });
            }}
        >
            {'Lagre og beregn'}
        </Button>
    );
};
