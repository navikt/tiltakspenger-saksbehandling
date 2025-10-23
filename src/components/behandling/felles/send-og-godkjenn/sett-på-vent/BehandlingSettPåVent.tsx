import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import SettBehandlingPåVentModal from '~/components/modaler/SettBehandlingPåVentModal';
import { Rammebehandling } from '~/types/Behandling';

type Props = {
    behandling: Rammebehandling;
    disabled?: boolean;
};

export const BehandlingSettPåVent = ({ behandling, disabled }: Props) => {
    const [modalÅpen, setModalÅpen] = useState(false);

    return (
        <>
            <Button
                variant={'tertiary'}
                size={'xsmall'}
                disabled={disabled}
                onClick={() => setModalÅpen(true)}
            >
                {'Sett på vent'}
            </Button>
            <SettBehandlingPåVentModal
                sakId={behandling.sakId}
                behandlingId={behandling.id}
                saksnummer={behandling.saksnummer}
                åpen={modalÅpen}
                onClose={() => setModalÅpen(false)}
            />
        </>
    );
};
