import { TrashIcon } from '@navikt/aksel-icons';
import { Modal, HStack, Heading, BodyLong, Textarea, Button, VStack } from '@navikt/ds-react';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import style from './AvsluttBehandling.module.css';
import { BehandlingId } from '../../../types/BehandlingTypes';
import { SøknadId } from '../../../types/SøknadTypes';
import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';

const AvsluttBehandling = (props: { id: BehandlingId | SøknadId }) => {
    const [vilAvslutteBehandling, setVilAvslutteBehandling] = React.useState(false);

    return (
        <VStack className={style.avsluttBehandlingContainer}>
            {vilAvslutteBehandling && (
                <AvsluttBehandlingModal
                    åpen={vilAvslutteBehandling}
                    onClose={() => setVilAvslutteBehandling(false)}
                    id={props.id}
                />
            )}
            <Button
                className={style.knapp}
                variant="danger"
                type="button"
                size="small"
                onClick={() => setVilAvslutteBehandling(true)}
            >
                Avslutt behandling
            </Button>
        </VStack>
    );
};

export default AvsluttBehandling;

const AvsluttBehandlingModal = (props: {
    id: BehandlingId | SøknadId;
    åpen: boolean;
    onClose: () => void;
}) => {
    const isBehandling = props.id.startsWith('beh_');
    const url = isBehandling ? `/behandling/${props.id}/avslutt` : `/soknad/${props.id}/avslutt`;
    const form = useForm<{ begrunnelse: string }>({ defaultValues: { begrunnelse: '' } });

    //TODO - fiks returtype
    const avsluttBehandlingMutation = useFetchJsonFraApi<unknown, { begrunnelse: string }>(
        url,
        'POST',
        {
            onSuccess: () => {
                //TODO - refresh sak eller noe
            },
        },
    );

    return (
        <form
            onSubmit={form.handleSubmit((values) => {
                avsluttBehandlingMutation.trigger({ begrunnelse: values.begrunnelse });
            })}
        >
            <Modal
                className={style.modal}
                width={700}
                aria-label="Avslutt behandling"
                open={props.åpen}
                onClose={props.onClose}
                size="small"
            >
                <Modal.Header className={style.modalHeader}>
                    <HStack>
                        <TrashIcon title="Søppelbøtte ikon" fontSize="1.5rem" />
                        <Heading level="4" size="small">
                            Avslutt behandling
                        </Heading>
                    </HStack>
                </Modal.Header>
                <Modal.Body className={style.modalBody}>
                    <BodyLong>
                        Hvis du avslutter søknadsbehandlingen kan ikke søknaden lenger behandles.
                    </BodyLong>
                    <Controller
                        rules={{ required: 'Du må fylle ut en begrunnelse' }}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Textarea
                                {...field}
                                error={fieldState.error?.message}
                                className={style.textarea}
                                label="Hvorfor avsluttes behandlingen? (obligatorisk)"
                            />
                        )}
                        name={'begrunnelse'}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        size="small"
                        loading={avsluttBehandlingMutation.isMutating}
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
