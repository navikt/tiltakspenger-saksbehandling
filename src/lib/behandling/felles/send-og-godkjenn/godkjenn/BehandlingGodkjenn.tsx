import { Button, HStack } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useBehandling } from '../../../context/BehandlingContext';
import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import { Underkjenn } from '../../../../underkjenn/Underkjenn';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useGodkjennBehandling } from '~/lib/behandling/felles/send-og-godkjenn/godkjenn/useGodkjennBehandling';
import { useNotification } from '~/context/NotificationContext';
import { Rammebehandling } from '~/types/Rammebehandling';
import { FetcherError } from '~/utils/fetch/fetch';

type Props = {
    behandling: Rammebehandling;
};

export const BehandlingGodkjenn = ({ behandling }: Props) => {
    const { navigateWithNotification } = useNotification();
    const { setBehandling } = useBehandling();
    const [visGodkjennVedtakModal, setVisGodkjennVedtakModal] = useState(false);

    const { godkjennBehandling, godkjennBehandlingLaster, godkjennBehandlingError } =
        useGodkjennBehandling(behandling);

    const underkjennApi = useFetchJsonFraApi<Rammebehandling, { begrunnelse: string }>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/underkjenn`,
        'POST',
        {
            onSuccess: (oppdatertBehandling) => {
                if (oppdatertBehandling) {
                    setBehandling(oppdatertBehandling);
                    navigateWithNotification('/', 'Vedtaket har blitt underkjent!');
                }
            },
        },
    );

    return (
        <>
            <HStack gap="space-8">
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
                            godkjennBehandling()
                                .then((oppdatertBehandling) => {
                                    setBehandling(oppdatertBehandling);
                                    setVisGodkjennVedtakModal(false);
                                    navigateWithNotification('/', 'Vedtaket er godkjent!');
                                })
                                .catch((error: FetcherError<Rammebehandling>) => {
                                    if (error.data) {
                                        setBehandling(error.data);
                                    } else {
                                        console.error(
                                            'Forventet oppdatert behandling ved feil fra backend',
                                        );
                                    }
                                });
                        }}
                    >
                        {'Godkjenn vedtaket'}
                    </Button>
                }
            />
        </>
    );
};
