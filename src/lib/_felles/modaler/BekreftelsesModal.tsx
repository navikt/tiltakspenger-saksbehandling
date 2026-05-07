import React, { ReactNode, RefObject } from 'react';
import styles from './BekreftelsesModal.module.css';
import { Alert, Button, HStack, Modal } from '@navikt/ds-react';
import { FetcherError } from '~/utils/fetch/fetch';

type Props = {
    modalRef?: RefObject<HTMLDialogElement | null>;
    children?: ReactNode;
    tittel: string;
    feil?: FetcherError;
    lukkModal: () => void;
    bekreftKnapp: ReactNode;
    åpen?: boolean;
};

export const BekreftelsesModal = ({
    modalRef,
    children,
    tittel,
    feil,
    lukkModal,
    bekreftKnapp,
    åpen,
}: Props) => {
    return (
        <Modal
            ref={modalRef ?? undefined}
            width={'medium'}
            className={styles.modal}
            onClose={() => {
                lukkModal();
            }}
            header={{ heading: tittel }}
            open={åpen}
        >
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                <HStack gap="space-16">
                    {feil && (
                        <Alert variant={'error'} size={'small'}>
                            {feil.message}
                        </Alert>
                    )}
                    <div className={styles.knapper}>
                        {bekreftKnapp}
                        <Button variant={'secondary'} type={'button'} onClick={() => lukkModal()}>
                            {'Avbryt'}
                        </Button>
                    </div>
                </HStack>
            </Modal.Footer>
        </Modal>
    );
};
