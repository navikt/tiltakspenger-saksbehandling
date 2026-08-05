import { Button, Dialog } from '@navikt/ds-react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { personoversiktUrl } from '~/utils/urls';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import { SakProps } from '~/lib/sak/SakTyper';
import { FetcherError } from '~/utils/fetch/fetch';

export const MeldekortbehandlingGodkjenn = () => {
    const { sak, setSak } = useSak();
    const { id } = useMeldekortbehandling();
    const { navigateWithNotification } = useNotification();

    const [åpen, setÅpen] = useState(false);

    const { trigger, error, isMutating } = useFetchJsonFraApi<
        SakProps,
        undefined,
        FetcherError<SakProps>
    >(`/sak/${sak.sakId}/meldekort/${id}/iverksett`, 'POST', {
        throwOnError: true,
    });

    const godkjenn = () => {
        trigger()
            .then((oppdatertSak) => {
                setSak(oppdatertSak);
                setÅpen(false);
                navigateWithNotification(
                    personoversiktUrl(sak.saksnummer, PersonoversiktTab.Meldekort),
                    'Meldekortet er godkjent',
                );
            })
            .catch((error: FetcherError<SakProps>) => {
                if (error.data) {
                    setSak(error.data);
                }
            });
    };

    return (
        <Dialog open={åpen} onOpenChange={setÅpen}>
            <Dialog.Trigger>
                <Button variant={'primary'} icon={<CheckmarkIcon />}>
                    {'Godkjenn meldekort'}
                </Button>
            </Dialog.Trigger>

            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Godkjenn meldekortet?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {
                        'Er du sikker på at meldekortet er korrekt og ønsker å sende det til utbetaling?'
                    }

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
                        {'Godkjenn meldekort'}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Avbryt'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
