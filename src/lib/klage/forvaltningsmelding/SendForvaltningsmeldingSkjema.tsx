import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { Button, HStack, LocalAlert, VStack } from '@navikt/ds-react';
import { SakId } from '~/lib/sak/SakTyper';
import { Klagebehandling, KlageId } from '~/lib/klage/typer/Klage';
import {
    useForhåndsvisForvaltningsmelding,
    useSendForvaltningsmelding,
} from '~/lib/klage/api/KlageApi';
import BrevForm from '~/lib/klage/forms/brev/BrevForm';
import { BrevFormData } from '~/lib/klage/forms/brev/BrevFormUtils';
import {
    forvaltningsmeldingFormDataTilForhåndsvisRequest,
    forvaltningsmeldingFormDataTilSendRequest,
    forvaltningsmeldingFormValidation,
    standardtekstForvaltningsmelding,
} from '~/lib/klage/forms/forvaltningsmelding/ForvaltningsmeldingFormUtils';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { FetcherError } from '~/utils/fetch/fetch';
import styles from './SendForvaltningsmeldingSkjema.module.css';

const erTerminalFeil = (feil?: FetcherError) =>
    feil?.status === 404 ||
    feil?.status === 409 ||
    feil?.kode === 'forvaltningsmelding_allerede_sendt';

const SendForvaltningsmeldingSkjema = (props: {
    sakId: SakId;
    klageId: KlageId;
    innsendingsdato: string;
    onSendt: (klage: Klagebehandling) => void;
}) => {
    const [skalBekrefte, setSkalBekrefte] = useState(false);

    const form = useForm<BrevFormData>({
        defaultValues: standardtekstForvaltningsmelding(),
        resolver: forvaltningsmeldingFormValidation,
    });

    const forhåndsvis = useForhåndsvisForvaltningsmelding({
        sakId: props.sakId,
        klageId: props.klageId,
        onSuccess: (blob) => {
            window.open(URL.createObjectURL(blob));
        },
    });

    const send = useSendForvaltningsmelding({
        sakId: props.sakId,
        klageId: props.klageId,
        onSuccess: (klage) => {
            props.onSendt(klage);
        },
    });

    const terminal = erTerminalFeil(send.error);

    const onSubmit = form.handleSubmit((values) => {
        if (terminal) {
            return;
        }
        if (!skalBekrefte) {
            forhåndsvis.reset();
            setSkalBekrefte(true);
            return;
        }
        send.trigger(forvaltningsmeldingFormDataTilSendRequest(values));
    });

    return (
        <form onSubmit={onSubmit} aria-label="Send forvaltningsmelding">
            <BrevForm
                control={form.control}
                className={styles.brevformContainer}
                readOnly={skalBekrefte || send.isMutating}
            />

            <VStack gap="space-16" align="start">
                {skalBekrefte && (
                    <Infokort variant={'advarsel'} size="small" className={styles.bekreftelse}>
                        Forvaltningsmeldingen sendes til bruker. Det kan bare sendes én
                        forvaltningsmelding per klagebehandling, og den kan ikke endres etter at den
                        er sendt. Er du sikker på at du vil sende den?
                    </Infokort>
                )}

                {forhåndsvis.error && (
                    <LocalAlert status="error" size="small">
                        <LocalAlert.Header>
                            <LocalAlert.Title>
                                Feil ved forhåndsvisning av forvaltningsmelding
                            </LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>{forhåndsvis.error.message}</LocalAlert.Content>
                    </LocalAlert>
                )}

                {send.error && (
                    <LocalAlert status="error" size="small">
                        <LocalAlert.Header>
                            <LocalAlert.Title>
                                Kunne ikke sende forvaltningsmelding
                            </LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>
                            <VStack gap="space-8">
                                <span>{send.error.message}</span>
                                {terminal ? (
                                    <span>Last inn siden på nytt for å se oppdatert status.</span>
                                ) : (
                                    <span>Prøv igjen om litt.</span>
                                )}
                            </VStack>
                        </LocalAlert.Content>
                    </LocalAlert>
                )}

                <HStack gap="space-16" align="center">
                    {skalBekrefte && !terminal && (
                        <Button
                            variant="secondary"
                            type="button"
                            disabled={send.isMutating}
                            onClick={() => {
                                send.reset();
                                setSkalBekrefte(false);
                            }}
                        >
                            Tilbake til redigering
                        </Button>
                    )}
                    <Button
                        variant="secondary"
                        type="button"
                        loading={forhåndsvis.isMutating}
                        icon={<EnvelopeOpenIcon aria-hidden fontSize="1.5rem" />}
                        iconPosition="left"
                        onClick={() => {
                            forhåndsvis.trigger(
                                forvaltningsmeldingFormDataTilForhåndsvisRequest(form.getValues()),
                            );
                        }}
                    >
                        Forhåndsvis
                    </Button>
                    {!terminal && (
                        <Button variant="primary" type="submit" loading={send.isMutating}>
                            {skalBekrefte
                                ? 'Ja, send forvaltningsmelding til bruker'
                                : 'Send forvaltningsmelding'}
                        </Button>
                    )}
                </HStack>
            </VStack>
        </form>
    );
};

export default SendForvaltningsmeldingSkjema;
