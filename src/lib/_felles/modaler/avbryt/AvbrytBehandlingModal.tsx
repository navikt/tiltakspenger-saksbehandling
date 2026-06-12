import { TrashIcon } from '@navikt/aksel-icons';
import {
    Modal,
    HStack,
    Heading,
    VStack,
    BodyLong,
    Alert,
    LocalAlert,
    Button,
} from '@navikt/ds-react';
import { Nullable } from '~/types/UtilTypes';
import styles from './AvbrytBehandlingModal.module.css';

const AvbrytBehandlingModal = (props: {
    bodyInnhold: React.ReactNode;
    åpen: boolean;
    onClose: () => void;
    tittel?: string;
    tekst?: string;
    textareaLabel?: string;
    footer?: {
        primaryButtonText?: string;
        secondaryButtonText?: string;
        isMutating: boolean;
        error: Nullable<string>;
    };
    onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}) => {
    return (
        <Modal
            className={styles.modal}
            width={700}
            aria-label="Avslutt behandling"
            open={props.åpen}
            onClose={props.onClose}
            size="small"
            portal
        >
            <form onSubmit={props.onSubmit}>
                <Modal.Header className={styles.modalHeader}>
                    <HStack>
                        <TrashIcon title="Søppelbøtte ikon" fontSize="1.5rem" />
                        <Heading level="4" size="small">
                            {props.tittel ?? 'Avslutt behandling'}
                        </Heading>
                    </HStack>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <VStack gap="space-16">
                        <BodyLong className={styles.text}>
                            {props.tekst ??
                                'Hvis du avslutter behandlingen kan den ikke lenger behandles.'}
                        </BodyLong>

                        {props.bodyInnhold}

                        <Alert variant={'info'} size="small">
                            Bruker får ikke innsyn eller informasjon når behandlingen avsluttes i
                            tiltakspenger-saksbehandling. Du må vurdere å informere bruker i Modia
                            om hvorfor behandlingen er avsluttet, og hva det vil bety for bruker.
                        </Alert>
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    {props.footer?.error && (
                        <LocalAlert status="error" size="small">
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Feil ved avbrytelse av behandling
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>{props.footer?.error}</LocalAlert.Content>
                        </LocalAlert>
                    )}
                    <HStack gap="space-16">
                        <Button
                            variant="secondary"
                            type="button"
                            size="small"
                            onClick={props.onClose}
                        >
                            {props.footer?.secondaryButtonText ?? 'Ikke avslutt behandling'}
                        </Button>
                        <Button
                            data-color="danger"
                            variant="primary"
                            size="small"
                            loading={props.footer?.isMutating}
                        >
                            {props.footer?.primaryButtonText ?? 'Avslutt behandling'}
                        </Button>
                    </HStack>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default AvbrytBehandlingModal;
