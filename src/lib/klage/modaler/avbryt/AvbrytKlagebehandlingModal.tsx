import { useForm } from 'react-hook-form';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import router from 'next/router';
import { TrashIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Heading, HStack, LocalAlert, Modal, VStack } from '@navikt/ds-react';
import { personoversiktUrl } from '~/utils/urls';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { SakId } from '~/lib/sak/SakTyper';
import { useAvbrytKlagebehandling } from '../../api/KlageApi';
import { KlageId } from '../../typer/Klage';
import {
    AvbrytKlagebehandlingFormData,
    avbrytKlagebehandlingFormDataToRequest,
    avbrytKlagebehandlingFormValidation,
} from '../../forms/avbryt/AvbrytKlagebehandlingFormUtils';
import AvbrytKlagebehandlingForm from '../../forms/avbryt/AvbrytKlagebehandlingForm';

import styles from './AvbrytKlagebehandlingModal.module.css';

const TITTEL = 'Avslutt klagebehandling';

/**
 * Terminale feil er feil der et nytt forsøk aldri vil lykkes.
 * Behandlingen finnes ikke lenger (404) eller er allerede i en tilstand som ikke kan avbrytes (409).
 * Da er det ikke noe poeng i å la saksbehandleren prøve å sende inn på nytt.
 */
const erTerminalFeil = (status?: number) => status === 404 || status === 409;

const AvbrytKlagebehandlingModal = (props: {
    sakId: SakId;
    klageId: KlageId;
    saksnummer: string;
    åpen: boolean;
    onClose: () => void;
}) => {
    const avbrytKlagebehandling = useAvbrytKlagebehandling({
        sakId: props.sakId,
        klageId: props.klageId,
        onSuccess: () => {
            router.push(personoversiktUrl(props.saksnummer));
        },
    });

    const form = useForm<AvbrytKlagebehandlingFormData>({
        defaultValues: {
            status: '',
            begrunnelse: '',
        },
        resolver: avbrytKlagebehandlingFormValidation,
    });

    const feil = avbrytKlagebehandling.error ?? null;
    const terminal = erTerminalFeil(feil?.status);

    const onSubmit = form.handleSubmit((values) => {
        avbrytKlagebehandling.trigger(avbrytKlagebehandlingFormDataToRequest(values));
    });

    return (
        <Modal
            className={styles.modal}
            width={700}
            aria-label={TITTEL}
            open={props.åpen}
            onClose={props.onClose}
            size="small"
            portal
        >
            <form
                onSubmit={(event) => {
                    if (terminal) {
                        event.preventDefault();
                        return;
                    }
                    onSubmit(event);
                }}
            >
                <Modal.Header className={styles.modalHeader}>
                    <HStack>
                        <TrashIcon title="Søppelbøtte ikon" fontSize="1.5rem" />
                        <Heading level="4" size="small">
                            {TITTEL}
                        </Heading>
                    </HStack>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <VStack gap="space-16">
                        <BodyLong>
                            {'Er du sikker på at du vil avslutte klagebehandlingen?'}
                        </BodyLong>

                        <AvbrytKlagebehandlingForm control={form.control} />

                        <Infokort variant={'info'} size="small">
                            Bruker får ikke innsyn eller informasjon når behandlingen avsluttes i
                            tiltakspenger-saksbehandling. Du må vurdere å informere bruker i Modia
                            om hvorfor behandlingen er avsluttet, og hva det vil bety for bruker.
                        </Infokort>

                        {feil && (
                            <LocalAlert status="error" size="small">
                                <LocalAlert.Header>
                                    <LocalAlert.Title>Det oppstod en feil</LocalAlert.Title>
                                </LocalAlert.Header>
                                <LocalAlert.Content>
                                    <VStack gap="space-8">
                                        <span>{feil.message}</span>
                                        {!terminal && <span>Prøv igjen om litt.</span>}
                                    </VStack>
                                </LocalAlert.Content>
                            </LocalAlert>
                        )}
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    <HStack gap="space-16" align="center">
                        <Button
                            variant="secondary"
                            type="button"
                            size="small"
                            onClick={props.onClose}
                        >
                            {terminal ? 'Lukk' : 'Ikke avslutt behandling'}
                        </Button>
                        {terminal ? (
                            <InternLenke
                                href={personoversiktUrl(props.saksnummer)}
                                onClick={props.onClose}
                            >
                                Gå til personoversikten
                            </InternLenke>
                        ) : (
                            <Button
                                data-color="danger"
                                variant="primary"
                                type="submit"
                                size="small"
                                loading={avbrytKlagebehandling.isMutating}
                            >
                                Avslutt behandling
                            </Button>
                        )}
                    </HStack>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default AvbrytKlagebehandlingModal;
