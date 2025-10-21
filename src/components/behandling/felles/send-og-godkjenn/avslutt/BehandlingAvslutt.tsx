import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import AvsluttBehandlingModal from '~/components/modaler/AvsluttBehandlingModal';

import router from 'next/router';
import { Behandling } from '~/types/Behandling';

type Props = {
    behandling: Behandling;
};

export const BehandlingAvslutt = ({ behandling }: Props) => {
    const [vilAvslutteBehandling, setVilAvslutteBehandling] = useState(false);

    const { saksnummer, id } = behandling;

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
                    saksnummer={saksnummer}
                    behandlingId={id}
                    onSuccess={() => router.push(`/sak/${behandling.saksnummer}`)}
                />
            )}
        </>
    );
};
