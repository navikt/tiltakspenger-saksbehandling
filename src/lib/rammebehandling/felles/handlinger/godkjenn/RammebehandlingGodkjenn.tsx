import { Button, HStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useBehandling } from '../../../context/BehandlingContext';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
import { RammebehandlingUnderkjenn } from '~/lib/rammebehandling/felles/handlinger/underkjenn/RammebehandlingUnderkjenn';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { FetcherError } from '~/utils/fetch/fetch';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const RammebehandlingGodkjenn = () => {
    const { navigateWithNotification } = useNotification();
    const { behandling, setBehandling } = useBehandling();

    const [visGodkjennVedtakModal, setVisGodkjennVedtakModal] = useState(false);

    const { trigger, isMutating, error } = useFetchJsonFraApi<
        Rammebehandling,
        undefined,
        FetcherError<Rammebehandling>
    >(`/sak/${behandling.sakId}/behandling/${behandling.id}/iverksett`, 'POST', {
        throwOnError: true,
    });

    return (
        <>
            <HStack gap="space-8">
                <RammebehandlingUnderkjenn behandling={behandling} />

                <Button onClick={() => setVisGodkjennVedtakModal(true)}>
                    {'Godkjenn vedtaket'}
                </Button>
            </HStack>
            <BekreftelsesModal
                tittel={'Godkjenn vedtaket?'}
                åpen={visGodkjennVedtakModal}
                feil={error}
                lukkModal={() => setVisGodkjennVedtakModal(false)}
                bekreftKnapp={
                    <Button
                        variant={'primary'}
                        loading={isMutating}
                        onClick={() => {
                            trigger()
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
