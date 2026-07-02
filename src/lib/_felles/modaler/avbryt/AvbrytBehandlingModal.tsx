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
import { FetcherError } from '~/utils/fetch/fetch';
import { GåTilPersonoversikten } from '~/lib/_felles/intern-lenke/GåTilPersonoversikten';
import styles from './AvbrytBehandlingModal.module.css';

/**
 * Terminale feil er feil der et nytt forsøk aldri vil lykkes.
 * Behandlingen finnes ikke lenger (404) eller er allerede i en tilstand som ikke kan avbrytes (409).
 * Da er det ikke noe poeng i å la saksbehandleren prøve å sende inn på nytt.
 */
const erTerminalFeil = (error: Nullable<FetcherError>): boolean => {
    return error?.status === 404 || error?.status === 409;
};

const AvbrytBehandlingModal = (props: {
    bodyInnhold: React.ReactNode;
    åpen: boolean;
    onClose: () => void;
    tittel?: string;
    tekst?: string;
    footer?: {
        isMutating: boolean;
        error: Nullable<FetcherError>;
        saksnummer?: string;
    };
    onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}) => {
    const feil = props.footer?.error ?? null;
    const terminal = erTerminalFeil(feil);

    const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        if (terminal) {
            e.preventDefault();
            return;
        }
        props.onSubmit(e);
    };

    return (
        <Modal
            className={styles.modal}
            width={700}
            aria-label={props.tittel ?? 'Avslutt behandling'}
            open={props.åpen}
            onClose={props.onClose}
            size="small"
            portal
        >
            <form onSubmit={onSubmit}>
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
                            props.footer?.saksnummer && (
                                <GåTilPersonoversikten
                                    saksnummer={props.footer.saksnummer}
                                    onClick={props.onClose}
                                />
                            )
                        ) : (
                            <Button
                                data-color="danger"
                                variant="primary"
                                type="submit"
                                size="small"
                                loading={props.footer?.isMutating}
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

export default AvbrytBehandlingModal;
