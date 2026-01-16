import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import AvsluttBehandlingModal from '~/components/modaler/AvsluttBehandlingModal';

import router from 'next/router';
import { Rammebehandling } from '~/types/Rammebehandling';
import { useAvsluttBehandling } from '~/components/behandlingmeny/useAvsluttBehandling';
import { useSak } from '~/context/sak/SakContext';

type Props = {
    behandling: Rammebehandling;
};

export const BehandlingAvslutt = ({ behandling }: Props) => {
    const { setSak } = useSak();
    const [vilAvslutteBehandling, setVilAvslutteBehandling] = useState(false);

    const { avsluttBehandling, avsluttBehandlingIsMutating } = useAvsluttBehandling(
        behandling.saksnummer,
    );

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
                        }).then((sak) => {
                            setSak(sak!);
                            router.push(`/sak/${behandling.saksnummer}`);
                        });
                    }}
                    footer={{
                        isMutating: avsluttBehandlingIsMutating,
                    }}
                />
            )}
        </>
    );
};
