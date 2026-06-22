import { Button, Dialog, InlineMessage, VStack } from '@navikt/ds-react';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { useSak } from '~/lib/sak/SakContext';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { personoversiktUrl } from '~/utils/urls';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import { useMeldekortbehandlingSkjemaLagring } from '~/lib/meldekort/v2/meldekortbehandling/lagre/MeldekortbehandlingLagringProvider';
import { validerMeldekortbehandlingSkjema } from '~/lib/meldekort/v2/meldekortbehandling/context/meldekortbehandlingSkjemaValidering';
import { MeldekortbehandlingValideringsfeil } from '~/lib/meldekort/v2/meldekortbehandling/send-inn/validering/MeldekortbehandlingValideringsfeil';

export const MeldekortbehandlingTilBeslutning = () => {
    const { sak } = useSak();
    const { id } = useMeldekortbehandling();

    const { navigateWithNotification } = useNotification();

    const skjema = useMeldekortbehandlingSkjema();
    const { isDirty } = useMeldekortbehandlingSkjemaLagring();

    const { trigger, error, isMutating, reset } = useFetchJsonFraApi<MeldeperiodeKjedeProps>(
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

    const skjemaValideringsfeil = validerMeldekortbehandlingSkjema(skjema, sak);

    return (
        <VStack gap={'space-16'} align={'end'}>
            {skjemaValideringsfeil && (
                <MeldekortbehandlingValideringsfeil feil={skjemaValideringsfeil} />
            )}

            {isDirty && (
                <InlineMessage status={'info'}>
                    {'Endringer må lagres før behandlingen kan sendes til beslutning'}
                </InlineMessage>
            )}

            <Dialog onOpenChange={reset}>
                <Dialog.Trigger>
                    <Button
                        variant={'primary'}
                        icon={<ArrowRightIcon />}
                        disabled={isDirty || !!skjemaValideringsfeil}
                    >
                        {'Send til beslutning'}
                    </Button>
                </Dialog.Trigger>

                <Dialog.Popup>
                    <Dialog.Header>
                        <strong>{'Send meldekortbehandlingen til beslutning?'}</strong>
                    </Dialog.Header>

                    <Dialog.Body>
                        {error && (
                            <Infokort
                                variant={'feil'}
                                header={'Feil ved send til beslutning'}
                            >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                        )}
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Button
                            variant={'primary'}
                            icon={<ArrowRightIcon />}
                            loading={isMutating}
                            onClick={sendTilBeslutning}
                        >
                            {'Send til beslutning'}
                        </Button>

                        <Dialog.CloseTrigger>
                            <Button variant={'secondary'}>{'Avbryt'}</Button>
                        </Dialog.CloseTrigger>
                    </Dialog.Footer>
                </Dialog.Popup>
            </Dialog>
        </VStack>
    );
};
