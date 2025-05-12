import { BodyLong, Button, Heading, HStack, Modal, Textarea } from '@navikt/ds-react';
import React, { FormEvent, useState } from 'react';
import router from 'next/router';

import style from './AvsluttMeldekortBehandling.module.css';

import styles from '../../avsluttBehandling/AvsluttBehandling.module.css';
import { TrashIcon } from '@navikt/aksel-icons';
import { SakId } from '../../../../types/SakTypes';
import {
    MeldekortBehandlingId,
    MeldekortBehandlingProps,
} from '../../../../types/meldekort/MeldekortBehandling';
import { useFetchJsonFraApi } from '../../../../utils/fetch/useFetchFraApi';

const AvsluttMeldekortbehandlingModal = (props: {
    sakId: SakId;
    meldekortBehandlingId: MeldekortBehandlingId;
    saksoversiktUrl: string;
    åpen: boolean;
    onClose: () => void;
}) => {
    const [begrunnelse, setBegrunnelse] = useState<string>('');
    const [error, setError] = useState<string>();
    const hasError = error !== undefined;

    const avsluttMeldekortBehandlingApi = useFetchJsonFraApi<
        MeldekortBehandlingProps,
        { begrunnelse: string }
    >(`/sak/${props.sakId}/meldekort/${props.meldekortBehandlingId}/avbryt`, 'POST', {
        onSuccess: () => {
            router.push(props.saksoversiktUrl);
        },
    });

    const submit = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (begrunnelse.trim() === '') {
            setError('Du må fylle ut en begrunnelse');
        } else {
            avsluttMeldekortBehandlingApi.trigger({
                begrunnelse: begrunnelse,
            });
        }
    };

    return (
        <Modal
            className={styles.modal}
            width={700}
            aria-label="Avslutt behandling"
            open={props.åpen}
            onClose={props.onClose}
            size="small"
        >
            <Modal.Header className={styles.modalHeader}>
                <HStack>
                    <TrashIcon title="Søppelbøtteikon" fontSize="1.5rem" />
                    <Heading level="4" size="small">
                        Avslutt behandling
                    </Heading>
                </HStack>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                <BodyLong>
                    Hvis du avslutter meldekortbehandlingen må behandlingen startes på nytt for å
                    behandle meldekortet manuelt.
                </BodyLong>
                <Textarea
                    onChange={(e) => {
                        setBegrunnelse(e.target.value);
                        setError(undefined);
                    }}
                    error={error}
                    label={'Hvorfor avsluttes behandlingen? (obligatorisk)'}
                    value={begrunnelse}
                    maxLength={200}
                    id="begrunnelse"
                    size="small"
                    aria-label={'Begrunnelse'}
                    disabled={false}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="danger"
                    size="small"
                    loading={avsluttMeldekortBehandlingApi.isMutating}
                    type="submit"
                    disabled={hasError}
                    onClick={(e) => {
                        submit(e);
                    }}
                >
                    Avslutt behandling
                </Button>
                <Button variant="secondary" type="button" size="small" onClick={props.onClose}>
                    Ikke avslutt behandling
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const AvsluttMeldekortBehandling = (props: {
    sakId: SakId;
    meldekortBehandlingId: MeldekortBehandlingId;
    saksoversiktUrl: string;
}) => {
    const [vilAvslutteBehandling, setVilAvslutteBehandling] = useState(false);

    return (
        <div>
            {vilAvslutteBehandling && (
                <AvsluttMeldekortbehandlingModal
                    åpen={vilAvslutteBehandling}
                    onClose={() => setVilAvslutteBehandling(false)}
                    sakId={props.sakId}
                    meldekortBehandlingId={props.meldekortBehandlingId}
                    saksoversiktUrl={props.saksoversiktUrl}
                />
            )}
            <Button
                className={style.knapp}
                size="small"
                variant="danger"
                type={'button'}
                onClick={() => {
                    setVilAvslutteBehandling(true);
                }}
            >
                Avslutt behandling
            </Button>
        </div>
    );
};

export default AvsluttMeldekortBehandling;
