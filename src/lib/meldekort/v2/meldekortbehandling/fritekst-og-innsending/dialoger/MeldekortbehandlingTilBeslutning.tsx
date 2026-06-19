import { Button, Dialog, InlineMessage, VStack } from '@navikt/ds-react';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { personoversiktUrl } from '~/utils/urls';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import { useMeldekortbehandlingSkjemaLagring } from '~/lib/meldekort/v2/meldekortbehandling/lagre/MeldekortbehandlingLagringProvider';

export const MeldekortbehandlingTilBeslutning = () => {
    const { sak } = useSak();
    const { id } = useMeldekortbehandling();
    const { navigateWithNotification } = useNotification();

    const { isDirty } = useMeldekortbehandlingSkjemaLagring();

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
        <VStack gap={'space-8'} align={'end'}>
            <Dialog>
                <Dialog.Trigger>
                    <Button variant={'primary'} icon={<ArrowRightIcon />} disabled={isDirty}>
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
                            <Infokort
                                variant={'feil'}
                                header={'Feil ved send til beslutning'}
                            >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
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

            {isDirty && (
                <InlineMessage status={'info'}>
                    {'Endringer må lagres før behandlingen kan sendes til beslutning'}
                </InlineMessage>
            )}
        </VStack>
    );
};
