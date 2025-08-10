import { Button, Modal } from '@navikt/ds-react';
import React, { ReactNode, RefObject } from 'react';
import Varsel from '../varsel/Varsel';
import { FetcherError } from '~/utils/fetch/fetch';

import styles from './BekreftelsesModal.module.css';

type Props = {
    modalRef?: RefObject<HTMLDialogElement>;
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
                {feil && (
                    <Varsel
                        variant={'error'}
                        size={'small'}
                        melding={`${feil.info?.melding || feil.message}`}
                        key={Date.now()}
                    />
                )}
                <div className={styles.knapper}>
                    {bekreftKnapp}
                    <Button variant={'secondary'} type={'button'} onClick={() => lukkModal()}>
                        {'Avbryt'}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};
