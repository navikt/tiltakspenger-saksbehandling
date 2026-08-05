import { Button, Dialog, InlineMessage, VStack } from '@navikt/ds-react';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSak } from '~/lib/sak/SakContext';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { personoversiktUrl } from '~/utils/urls';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import { useMeldekortbehandlingSkjemaLagring } from '~/lib/meldekort/meldekortbehandling/lagre/MeldekortbehandlingLagringProvider';
import { validerMeldekortbehandlingSkjema } from '~/lib/meldekort/meldekortbehandling/context/meldekortbehandlingSkjemaValidering';
import { MeldekortbehandlingValideringsfeil } from '~/lib/meldekort/meldekortbehandling/send-inn/validering/MeldekortbehandlingValideringsfeil';
import { SakProps } from '~/lib/sak/SakTyper';
import { FetcherError } from '~/utils/fetch/fetch';
import { useState } from 'react';

export const MeldekortbehandlingTilBeslutning = () => {
    const { sak, setSak } = useSak();
    const meldekortbehandling = useMeldekortbehandling();
    const { id } = meldekortbehandling;

    const { navigateWithNotification } = useNotification();

    const skjema = useMeldekortbehandlingSkjema();
    const { isDirty } = useMeldekortbehandlingSkjemaLagring();

    const [åpen, setÅpen] = useState(false);

    const { trigger, error, isMutating, reset } = useFetchJsonFraApi<
        SakProps,
        undefined,
        FetcherError<SakProps>
    >(`/sak/${sak.sakId}/meldekort/${id}/sendtilbeslutning`, 'POST', {
        throwOnError: true,
    });

    const sendTilBeslutning = () => {
        trigger()
            .then((oppdatertSak) => {
                setSak(oppdatertSak);
                setÅpen(false);
                navigateWithNotification(
                    personoversiktUrl(sak.saksnummer, PersonoversiktTab.Meldekort),
                    'Meldekortet er sendt til beslutter!',
                );
            })
            .catch((error: FetcherError<SakProps>) => {
                if (error.data) {
                    setSak(error.data);
                } else {
                    console.error('Forventet oppdatert sak ved feil fra backend');
                }
            });
    };

    const skjemaValideringsfeil = validerMeldekortbehandlingSkjema(
        skjema,
        meldekortbehandling,
        sak,
    );

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

            <Dialog
                open={åpen}
                onOpenChange={(nyÅpen) => {
                    setÅpen(nyÅpen);
                    reset();
                }}
            >
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
