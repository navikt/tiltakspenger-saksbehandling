import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useBehandling } from '../../../context/BehandlingContext';

import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import { useSendBehandlingTilBeslutning } from '~/components/behandling/felles/send-og-godkjenn/send-til-beslutning/useSendBehandlingTilBeslutning';
import { useNotification } from '~/context/NotificationContext';
import { Behandling } from '~/types/Behandling';

type Props = {
    behandling: Behandling;
    valider: () => boolean;
    disabled: boolean;
};

export const BehandlingSendTilBeslutning = ({ behandling, valider, disabled }: Props) => {
    const { sendTilBeslutning, sendTilBeslutningLaster, sendTilBeslutningError } =
        useSendBehandlingTilBeslutning(behandling);
    const { navigateWithNotification } = useNotification();
    const { setBehandling } = useBehandling();

    const [visSendTilBeslutningModal, setVisSendTilBeslutningModal] = useState(false);

    return (
        <>
            <Button
                onClick={() => {
                    if (valider()) {
                        setVisSendTilBeslutningModal(true);
                    }
                }}
                disabled={disabled}
            >
                {'Send til beslutter'}
            </Button>
            <BekreftelsesModal
                åpen={visSendTilBeslutningModal}
                tittel={'Send vedtaket til beslutning?'}
                feil={sendTilBeslutningError}
                lukkModal={() => setVisSendTilBeslutningModal(false)}
                bekreftKnapp={
                    <Button
                        variant={'primary'}
                        loading={sendTilBeslutningLaster}
                        onClick={() => {
                            sendTilBeslutning().then((oppdatertBehandling) => {
                                if (oppdatertBehandling) {
                                    setBehandling(oppdatertBehandling);
                                    navigateWithNotification(
                                        '/',
                                        'Vedtaket er sendt til beslutning!',
                                    );
                                    setVisSendTilBeslutningModal(false);
                                }
                            });
                        }}
                    >
                        {'Send til beslutning'}
                    </Button>
                }
            />
        </>
    );
};
