import { Alert, Button, Heading, HStack, Modal, VStack } from '@navikt/ds-react';
import { ModalHeader } from '@navikt/ds-react/Modal';
import { useState } from 'react';
import { useSak } from '~/context/sak/SakContext';
import { SakProps } from '~/types/SakTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

const MeldekortHelgModal = () => {
    const [vilEndreMeldekortHelg, setVilEndreMeldekortHelg] = useState(false);

    return (
        <div>
            <Button
                type="button"
                size="small"
                variant="secondary"
                onClick={() => setVilEndreMeldekortHelg(!vilEndreMeldekortHelg)}
            >
                Meldekort helg
            </Button>
            {vilEndreMeldekortHelg && (
                <MeldekortHelgModalBekreftelse
                    åpen={vilEndreMeldekortHelg}
                    onClose={() => setVilEndreMeldekortHelg(false)}
                />
            )}
        </div>
    );
};

export default MeldekortHelgModal;

const MeldekortHelgModalBekreftelse = (props: { åpen: boolean; onClose: () => void }) => {
    const sakContext = useSak();

    const toggleBrukerSendInnHelgMeldekort = useFetchJsonFraApi<
        SakProps,
        { kanSendeHelg: boolean }
    >(`/sak/${sakContext.sak.sakId}/toggle-helg-meldekort`, 'POST', {
        onSuccess: (sak) => {
            sakContext.setSak(sak!);
            props.onClose();
        },
    });

    return (
        <div>
            <Modal
                width={600}
                open={props.åpen}
                onClose={props.onClose}
                aria-label="Endre meldekort helg"
            >
                <ModalHeader>
                    <Heading size="medium" level="4">
                        {sakContext.sak.kanSendeInnHelgForMeldekort
                            ? 'Ikke tillatt bruker å sende inn helgedager på meldekortet'
                            : 'Tillatt bruker å sende inn helgedager på meldekortet'}
                    </Heading>
                </ModalHeader>

                <Modal.Footer>
                    <VStack gap="2">
                        <HStack gap="2">
                            <Button
                                type="button"
                                loading={toggleBrukerSendInnHelgMeldekort.isMutating}
                                onClick={() =>
                                    toggleBrukerSendInnHelgMeldekort.trigger({
                                        kanSendeHelg: !sakContext.sak.kanSendeInnHelgForMeldekort,
                                    })
                                }
                            >
                                Bekreft
                            </Button>
                            <Button variant="secondary" type="button" onClick={props.onClose}>
                                Avbryt
                            </Button>
                        </HStack>
                        {toggleBrukerSendInnHelgMeldekort.error && (
                            <Alert variant="error">
                                {toggleBrukerSendInnHelgMeldekort.error.message}
                            </Alert>
                        )}
                    </VStack>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
