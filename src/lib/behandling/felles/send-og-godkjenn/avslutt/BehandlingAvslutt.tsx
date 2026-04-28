import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import AvsluttBehandlingModal from '~/lib/modaler/AvsluttBehandlingModal';

import router from 'next/router';
import { Rammebehandling } from '~/types/Rammebehandling';
import { useAvsluttBehandling } from '~/lib/behandlingmeny/useAvsluttBehandling';
import { useSak } from '~/context/sak/SakContext';
import { personoversiktUrl } from '~/utils/urls';

type Props = {
    behandling: Rammebehandling;
};

export const BehandlingAvslutt = ({ behandling }: Props) => {
    const { setSak } = useSak();
    const [vilAvslutteBehandling, setVilAvslutteBehandling] = useState(false);

    const { avsluttBehandling, avsluttBehandlingIsMutating, avsluttBehandlingError } =
        useAvsluttBehandling(behandling.saksnummer, (sak) => {
            setSak(sak!);
            router.push(personoversiktUrl(behandling));
        });

    return (
        <>
            <Button
                variant={'tertiary'}
                type={'button'}
                size={'xsmall'}
                onClick={() => setVilAvslutteBehandling(true)}
            >
                {'Avslutt behandling'}
            </Button>
            {vilAvslutteBehandling && (
                <AvsluttBehandlingModal
                    åpen={vilAvslutteBehandling}
                    onClose={() => setVilAvslutteBehandling(false)}
                    onSubmit={(begrunnelse) => {
                        avsluttBehandling({
                            behandlingId: behandling.id,
                            begrunnelse: begrunnelse,
                        });
                    }}
                    footer={{
                        isMutating: avsluttBehandlingIsMutating,
                        error: avsluttBehandlingError ? avsluttBehandlingError.message : null,
                    }}
                />
            )}
        </>
    );
};
