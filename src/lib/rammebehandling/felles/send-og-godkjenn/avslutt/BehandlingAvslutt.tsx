import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import AvbrytRammebehandlingModal from '~/lib/rammebehandling/modaler/AvbrytRammebehandlingModal';

import router from 'next/router';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { useAvsluttBehandling } from '~/lib/behandling-felles/behandlingmeny/useAvsluttBehandling';
import { useSak } from '~/lib/sak/SakContext';
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
            router.push(personoversiktUrl(behandling.saksnummer));
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
                <AvbrytRammebehandlingModal
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
