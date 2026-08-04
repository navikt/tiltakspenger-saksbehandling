import { Button, Dialog } from '@navikt/ds-react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useBehandling } from '../../../context/BehandlingContext';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { FetcherError } from '~/utils/fetch/fetch';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const RammebehandlingGodkjenn = () => {
    const { navigateWithNotification } = useNotification();
    const { behandling, setBehandling } = useBehandling();

    const [åpen, setÅpen] = useState(false);

    const { trigger, isMutating, error } = useFetchJsonFraApi<
        Rammebehandling,
        undefined,
        FetcherError<Rammebehandling>
    >(`/sak/${behandling.sakId}/behandling/${behandling.id}/iverksett`, 'POST', {
        throwOnError: true,
    });

    const godkjenn = () => {
        trigger()
            .then((oppdatertBehandling) => {
                setBehandling(oppdatertBehandling);
                setÅpen(false);
                navigateWithNotification('/', 'Vedtaket er godkjent!');
            })
            .catch((error: FetcherError<Rammebehandling>) => {
                if (error.data) {
                    setBehandling(error.data);
                } else {
                    console.error('Forventet oppdatert behandling ved feil fra backend');
                }
            });
    };

    return (
        <Dialog open={åpen} onOpenChange={setÅpen}>
            <Dialog.Trigger>
                <Button variant={'primary'} icon={<CheckmarkIcon />}>
                    {'Godkjenn vedtaket'}
                </Button>
            </Dialog.Trigger>

            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Godkjenn vedtaket?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {'Er du sikker på at vedtaket er korrekt og ønsker å iverksette det?'}

                    {error && (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved godkjenning'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    <Button
                        variant={'primary'}
                        icon={<CheckmarkIcon />}
                        loading={isMutating}
                        onClick={godkjenn}
                    >
                        {'Godkjenn vedtaket'}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Avbryt'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
