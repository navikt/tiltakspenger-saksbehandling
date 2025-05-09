import { BodyLong, Button, Heading, HStack, Modal, Textarea } from '@navikt/ds-react';
import React, { useState } from 'react';
import router from 'next/router';

import style from './AvsluttMeldekortBehandling.module.css';

import styles from '../../avsluttBehandling/AvsluttBehandling.module.css';
import { TrashIcon } from '@navikt/aksel-icons';
import { Controller, useForm } from 'react-hook-form';
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
    const form = useForm<{ begrunnelse: string }>({ defaultValues: { begrunnelse: '' } });
    const avsluttMeldekortBehandlingApi = useFetchJsonFraApi<
        MeldekortBehandlingProps,
        { begrunnelse: string }
    >(`/sak/${props.sakId}/meldekort/${props.meldekortBehandlingId}/avbryt`, 'POST', {
        onSuccess: () => {
            router.push(props.saksoversiktUrl);
        },
    });

    return (
        <form
            onSubmit={form.handleSubmit((values) => {
                avsluttMeldekortBehandlingApi.trigger({
                    begrunnelse: values.begrunnelse,
                });
            })}
        >
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
                        Hvis du avslutter meldekortbehandlingen kan meldekortet ikke lenger
                        behandles.
                    </BodyLong>
                    <Controller
                        rules={{ required: 'Du må fylle ut en begrunnelse' }}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Textarea
                                {...field}
                                error={fieldState.error?.message}
                                className={styles.textarea}
                                label={'Hvorfor avsluttes behandlingen? (obligatorisk)'}
                            />
                        )}
                        name={'begrunnelse'}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        size="small"
                        loading={avsluttMeldekortBehandlingApi.isMutating}
                        type="submit"
                    >
                        Avslutt behandling
                    </Button>
                    <Button variant="secondary" type="button" size="small" onClick={props.onClose}>
                        Ikke avslutt behandling
                    </Button>
                </Modal.Footer>
            </Modal>
        </form>
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
