import React, { ReactNode, RefObject } from 'react';
import styles from './BekreftelsesModal.module.css';
import { Button, HStack, Modal } from '@navikt/ds-react';
import Varsel from '../varsel/Varsel';
import { FetcherError } from '~/utils/fetch/fetch';
import { v4 as uuidv4 } from 'uuid';

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
                        <Varsel
                            variant={'error'}
                            size={'small'}
                            melding={`${feil.info?.melding || feil.message}`}
                            key={`error-${uuidv4()}`}
                        />
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
