import { Button, Dialog } from '@navikt/ds-react';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { InfokortEnkel } from '~/lib/_felles/infokort/InfokortEnkel';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { personoversiktUrl } from '~/utils/urls';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';

export const MeldekortbehandlingTilBeslutning = () => {
    const { sak } = useSak();
    const { id } = useMeldekortbehandling();
    const { navigateWithNotification } = useNotification();

    const { trigger, error, isMutating } = useFetchJsonFraApi<MeldeperiodeKjedeProps>(
        `/sak/${sak.sakId}/meldekort/${id}/sendtilbeslutning`,
        'POST',
    );

    const sendTilBeslutning = () => {
        trigger().then((response) => {
            if (response) {
                navigateWithNotification(
                    personoversiktUrl(sak.saksnummer, PersonoversiktTab.Meldekort),
                    'Meldekortet er sendt til beslutter!',
                );
            }
        });
    };

    return (
        <Dialog>
            <Dialog.Trigger>
                <Button variant={'primary'} icon={<ArrowRightIcon />}>
                    {'Send til beslutning'}
                </Button>
            </Dialog.Trigger>

            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Send meldekortbehandlingen til beslutning?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {'Vis evt valideringsfeil her'}

                    {error && (
                        <InfokortEnkel
                            variant={'feil'}
                            header={'Feil ved send til beslutning'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</InfokortEnkel>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button
                            variant={'primary'}
                            icon={<ArrowRightIcon />}
                            loading={isMutating}
                            onClick={sendTilBeslutning}
                        >
                            {'Send til beslutning'}
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
