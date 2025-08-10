import { Button, HStack } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useBehandling } from '../../../BehandlingContext';
import { BehandlingData } from '~/types/BehandlingTypes';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import {
    useRolleForBehandling,
    useSaksbehandler,
} from '~/context/saksbehandler/SaksbehandlerContext';
import { useSendBehandlingTilBeslutning } from '~/components/behandling/felles/send-og-godkjenn/send-til-beslutning/useSendBehandlingTilBeslutning';
import { BehandlingVedtakDTO } from '~/types/VedtakTyper';
import { GjenopptaButton } from '~/components/behandling/felles/send-og-godkjenn/gjenoppta/GjenopptaButton';
import { skalKunneGjenopptaBehandling } from '~/utils/tilganger';
import { Nullable } from '~/types/UtilTypes';
import { useNotification } from '~/context/NotificationContext';
import SettBehandlingPåVentModal from '~/components/modaler/SettBehandlingPåVentModal';

import style from '../BehandlingSendOgGodkjenn.module.css';

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
    const { innloggetSaksbehandler } = useSaksbehandler();
    const rolle = useRolleForBehandling(behandling);

    const [visSettBehandlingPåVentModal, setVisSettBehandlingPåVentModal] = useState(false);
    const [visSendTilBeslutningModal, setVisSendTilBeslutningModal] = useState(false);

    return (
        <div className={style.wrapper}>
            {rolle === SaksbehandlerRolle.SAKSBEHANDLER && (
                <HStack gap="2">
                    {skalKunneGjenopptaBehandling(behandling, innloggetSaksbehandler) ? (
                        <GjenopptaButton behandling={behandling} />
                    ) : (
                        <>
                            <Button
                                variant={'secondary'}
                                onClick={() => setVisSettBehandlingPåVentModal(true)}
                            >
                                {'Sett på vent'}
                            </Button>
                            <Button
                                onClick={() => {
                                    // midlertidig løsning for å kjøre valideringsfunksjonen når saksbehandler klikker på send til beslutter
                                    // TODO: må uansett skrive om denne komponenten litt når backend er oppdatert til ikke å lagre nye data ved send til beslutter
                                    const vedtakDto = hentVedtakDto();
                                    if (vedtakDto) {
                                        setVisSendTilBeslutningModal(true);
                                    }
                                }}
                                disabled={disabled}
                            >
                                {'Send til beslutter'}
                            </Button>
                        </>
                    )}
                </HStack>
            )}
            {visSettBehandlingPåVentModal && (
                <SettBehandlingPåVentModal
                    sakId={behandling.sakId}
                    behandlingId={behandling.id}
                    saksnummer={behandling.saksnummer}
                    åpen={visSettBehandlingPåVentModal}
                    onClose={() => setVisSettBehandlingPåVentModal(false)}
                />
            )}
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

                            sendTilBeslutning(vedtakDto).then((oppdatertBehandling) => {
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
        </div>
    );
};
