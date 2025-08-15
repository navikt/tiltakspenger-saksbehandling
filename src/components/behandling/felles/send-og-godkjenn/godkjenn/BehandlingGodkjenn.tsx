import { Button, HStack } from '@navikt/ds-react';
import React, { useState } from 'react';
import { BehandlingData } from '~/types/BehandlingTypes';
import { useBehandling } from '../../../BehandlingContext';
import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import { Underkjenn } from '../../../../underkjenn/Underkjenn';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useGodkjennBehandling } from '~/components/behandling/felles/send-og-godkjenn/godkjenn/useGodkjennBehandling';
import { useNotification } from '~/context/NotificationContext';

type Props = {
    behandling: BehandlingData;
};

export const BehandlingGodkjenn = ({ behandling }: Props) => {
    const { navigateWithNotification } = useNotification();
    const { setBehandling } = useBehandling();
    const [visGodkjennVedtakModal, setVisGodkjennVedtakModal] = useState(false);

    const { godkjennBehandling, godkjennBehandlingLaster, godkjennBehandlingError } =
        useGodkjennBehandling(behandling);

    const underkjennApi = useFetchJsonFraApi<BehandlingData, { begrunnelse: string }>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/underkjenn`,
        'POST',
        {
            onSuccess: (oppdatertBehandling) => {
                setBehandling(oppdatertBehandling!);
                navigateWithNotification('/', 'Vedtaket har blitt underkjent!');
            },
        },
    );

    return (
        <>
            <HStack gap="2">
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
            </HStack>
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
        </>
    );
};
