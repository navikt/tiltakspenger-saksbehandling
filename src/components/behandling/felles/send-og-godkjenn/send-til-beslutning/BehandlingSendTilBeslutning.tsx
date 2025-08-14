import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useBehandling } from '../../../BehandlingContext';
import { BehandlingData } from '~/types/BehandlingTypes';
import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import { useSendBehandlingTilBeslutning } from '~/components/behandling/felles/send-og-godkjenn/send-til-beslutning/useSendBehandlingTilBeslutning';
import { BehandlingVedtakDTO } from '~/types/VedtakTyper';
import { Nullable } from '~/types/UtilTypes';
import { useNotification } from '~/context/NotificationContext';

type Props = {
    behandling: BehandlingData;
    hentVedtakDto: () => Nullable<BehandlingVedtakDTO>;
    disabled: boolean;
};

export const BehandlingSendTilBeslutning = ({ behandling, hentVedtakDto, disabled }: Props) => {
    const { sendTilBeslutning, sendTilBeslutningLaster, sendTilBeslutningError } =
        useSendBehandlingTilBeslutning(behandling);
    const { navigateWithNotification } = useNotification();
    const { setBehandling } = useBehandling();

    const [visSendTilBeslutningModal, setVisSendTilBeslutningModal] = useState(false);

    return (
        <>
            <Button
                onClick={() => {
                    // midlertidig løsning for å kjøre valideringsfunksjonen når saksbehandler klikker på send til beslutter
                    const vedtakDto = hentVedtakDto();
                    if (vedtakDto) {
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
                            const vedtakDto = hentVedtakDto();

                            if (!vedtakDto) {
                                return;
                            }

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
