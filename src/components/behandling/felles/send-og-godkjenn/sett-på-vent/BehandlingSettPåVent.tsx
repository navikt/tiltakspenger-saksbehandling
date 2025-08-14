import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import SettBehandlingPåVentModal from '~/components/modaler/SettBehandlingPåVentModal';
import { BehandlingData } from '~/types/BehandlingTypes';

type Props = {
    behandling: BehandlingData;
};

export const BehandlingSettPåVent = ({ behandling }: Props) => {
    const [modalÅpen, setModalÅpen] = useState(false);

    return (
        <>
            <Button variant={'tertiary'} size={'xsmall'} onClick={() => setModalÅpen(true)}>
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
