import { TrashIcon } from '@navikt/aksel-icons';
import { Modal, HStack, Heading, BodyLong, Textarea, Button, VStack } from '@navikt/ds-react';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import style from './AvsluttBehandling.module.css';
import { BehandlingId } from '../../../types/BehandlingTypes';
import { SøknadId } from '../../../types/SøknadTypes';
import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';
import { Nullable } from '../../../types/common';
import { SakProps } from '../../../types/SakTypes';
import { useSak } from '../../../context/sak/useSak';

const AvsluttBehandling = (props: {
    saksnummer: string;
    søknadsId?: Nullable<SøknadId>;
    behandlingsId?: Nullable<BehandlingId>;
    button?: {
        size?: 'small' | 'medium';
        alignment?: 'start' | 'end';
    };
}) => {
    const [vilAvslutteBehandling, setVilAvslutteBehandling] = React.useState(false);

    //TODO - her burde vi nok ha litt mer context rundt hva som er valgt
    if (!props.søknadsId && !props.behandlingsId) {
        return <div>Teknisk feil: Enten søknadsId, eller behandlingsId må være satt</div>;
    }

    return (
        <VStack>
            {vilAvslutteBehandling && (
                <AvsluttBehandlingModal
                    åpen={vilAvslutteBehandling}
                    onClose={() => setVilAvslutteBehandling(false)}
                    saksnummer={props.saksnummer}
                    søknadsId={props.søknadsId ?? null}
                    behandlingsId={props.behandlingsId ?? null}
                />
            )}
            <Button
                variant="danger"
                type="button"
                size={props.button?.size ?? 'small'}
                onClick={() => setVilAvslutteBehandling(true)}
            >
                Avslutt behandling
            </Button>
        </VStack>
    );
};

export default AvsluttBehandling;

const AvsluttBehandlingModal = (props: {
    saksnummer: string;
    søknadsId: Nullable<SøknadId>;
    behandlingsId: Nullable<BehandlingId>;
    åpen: boolean;
    onClose: () => void;
}) => {
    const { setSak } = useSak();
    const form = useForm<{ begrunnelse: string }>({ defaultValues: { begrunnelse: '' } });

    const avsluttBehandlingMutation = useFetchJsonFraApi<
        SakProps,
        { søknadId: Nullable<string>; behandlingId: Nullable<string>; begrunnelse: string }
    >(`sak/${props.saksnummer}/avbryt-aktiv-behandling`, 'POST', {
        onSuccess: (sak) => {
            setSak(sak!);
            props.onClose();
        },
    });

    return (
        <form
            onSubmit={form.handleSubmit((values) => {
                avsluttBehandlingMutation.trigger({
                    søknadId: props.søknadsId,
                    behandlingId: props.behandlingsId,
                    begrunnelse: values.begrunnelse,
                });
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
