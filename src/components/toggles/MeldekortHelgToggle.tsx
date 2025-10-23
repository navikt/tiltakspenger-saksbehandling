import { Alert, HStack, Switch } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useSak } from '~/context/sak/SakContext';
import { SakProps } from '~/types/Sak';

import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

const MeldekortHelgToggle = () => {
    const sakContext = useSak();
    const [closed, setIsClosed] = useState(false);

    const toggleBrukerSendInnHelgMeldekort = useFetchJsonFraApi<
        SakProps,
        { kanSendeHelg: boolean }
    >(`/sak/${sakContext.sak.sakId}/toggle-helg-meldekort`, 'POST', {
        onSuccess: (sak) => {
            sakContext.setSak(sak!);
        },
    });

    return (
        <HStack gap="2">
            {toggleBrukerSendInnHelgMeldekort.error && !closed && (
                <Alert variant="error" size="small" closeButton onClose={() => setIsClosed(true)}>
                    {toggleBrukerSendInnHelgMeldekort?.error?.message}
                </Alert>
            )}
            <Switch
                checked={sakContext.sak.kanSendeInnHelgForMeldekort}
                onChange={(e) =>
                    toggleBrukerSendInnHelgMeldekort.trigger({ kanSendeHelg: e.target.checked })
                }
                loading={toggleBrukerSendInnHelgMeldekort.isMutating}
            >
                Skru {sakContext.sak.kanSendeInnHelgForMeldekort ? 'av' : 'på'} meldekort helg
            </Switch>
        </HStack>
    );
};

export default MeldekortHelgToggle;
