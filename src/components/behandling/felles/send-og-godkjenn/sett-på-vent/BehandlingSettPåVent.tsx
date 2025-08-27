import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import SettBehandlingPåVentModal from '~/components/modaler/SettBehandlingPåVentModal';
import { BehandlingData } from '~/types/BehandlingTypes';

type Props = {
    behandling: BehandlingData;
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
