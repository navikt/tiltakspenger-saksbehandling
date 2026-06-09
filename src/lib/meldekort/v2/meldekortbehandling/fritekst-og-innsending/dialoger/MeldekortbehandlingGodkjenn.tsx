import { Button, Dialog } from '@navikt/ds-react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { personoversiktUrl } from '~/utils/urls';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';

export const MeldekortbehandlingGodkjenn = () => {
    const { sak } = useSak();
    const { id } = useMeldekortbehandling();
    const { navigateWithNotification } = useNotification();

    const { trigger, error, isMutating } = useFetchJsonFraApi<MeldeperiodeKjedeProps>(
        `/sak/${sak.sakId}/meldekort/${id}/iverksett`,
        'POST',
    );

    const godkjenn = () => {
        trigger().then((response) => {
            if (response) {
                navigateWithNotification(
                    personoversiktUrl(sak.saksnummer, PersonoversiktTab.Meldekort),
                    'Meldekortet er godkjent',
                );
            }
        });
    };

    return (
        <Dialog>
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
                    <Dialog.CloseTrigger>
                        <Button
                            variant={'primary'}
                            icon={<CheckmarkIcon />}
                            loading={isMutating}
                            onClick={godkjenn}
                        >
                            {'Godkjenn meldekort'}
                        </Button>
                    </Dialog.CloseTrigger>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Avbryt'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
