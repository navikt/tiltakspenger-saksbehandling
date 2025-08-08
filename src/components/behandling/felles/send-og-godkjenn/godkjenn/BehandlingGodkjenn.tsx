import { Button, HStack } from '@navikt/ds-react';
import React, { useState } from 'react';
import { BehandlingData } from '~/types/BehandlingTypes';
import { useBehandling } from '../../../BehandlingContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import Underkjenn from '../../../../underkjenn/Underkjenn';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import router from 'next/router';
import { useGodkjennBehandling } from '~/components/behandling/felles/send-og-godkjenn/godkjenn/useGodkjennBehandling';
import {
    useRolleForBehandling,
    useSaksbehandler,
} from '~/context/saksbehandler/SaksbehandlerContext';
import { useNotification } from '~/context/NotificationContext';
import { GjenopptaButton } from '~/components/behandling/felles/send-og-godkjenn/gjenoppta/GjenopptaButton';

import style from '../BehandlingSendOgGodkjenn.module.css';
import { skalKunneGjenopptaBehandling } from '~/utils/tilganger';
import SettBehandlingPåVentModal from '~/components/modaler/SettBehandlingPåVentModal';

type Props = {
    behandling: BehandlingData;
};

export const BehandlingGodkjenn = ({ behandling }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { navigateWithNotification } = useNotification();
    const { setBehandling } = useBehandling();
    const [visSettBehandlingPåVentModal, setVisSettBehandlingPåVentModal] = useState(false);
    const [visGodkjennVedtakModal, setVisGodkjennVedtakModal] = useState(false);

    const { godkjennBehandling, godkjennBehandlingLaster, godkjennBehandlingError } =
        useGodkjennBehandling(behandling);

    const underkjennApi = useFetchJsonFraApi<BehandlingData, { begrunnelse: string }>(
        `/behandling/sendtilbake/${behandling.id}`,
        'POST',
        {
            onSuccess: (oppdatertBehandling) => {
                setBehandling(oppdatertBehandling!);
                router.push(`/sak/${oppdatertBehandling!.saksnummer}`);
            },
        },
    );

    const rolle = useRolleForBehandling(behandling);

    return (
        <div className={style.wrapper}>
            {rolle === SaksbehandlerRolle.BESLUTTER && (
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
                            <Underkjenn
                                onUnderkjenn={{
                                    click: (begrunnelse) => underkjennApi.trigger({ begrunnelse }),
                                    pending: underkjennApi.isMutating,
                                    error: underkjennApi.error,
                                }}
                            />
                            <Button onClick={() => setVisGodkjennVedtakModal(true)}>
                                {'Godkjenn vedtaket'}
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
                tittel={'Godkjenn vedtaket?'}
                åpen={visGodkjennVedtakModal}
                feil={godkjennBehandlingError}
                lukkModal={() => setVisGodkjennVedtakModal(false)}
                bekreftKnapp={
                    <Button
                        variant={'primary'}
                        loading={godkjennBehandlingLaster}
                        onClick={() => {
                            godkjennBehandling().then((oppdatertBehandling) => {
                                if (oppdatertBehandling) {
                                    setBehandling(oppdatertBehandling);
                                    setVisGodkjennVedtakModal(false);
                                    navigateWithNotification('/', 'Vedtaket er godkjent!');
                                }
                            });
                        }}
                    >
                        Godkjenn vedtaket
                    </Button>
                }
            />
        </div>
    );
};
