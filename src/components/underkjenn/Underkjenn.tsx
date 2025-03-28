import { Alert, Button, Heading, HStack, Modal, Textarea } from '@navikt/ds-react';
import { useState } from 'react';
import { FetcherError } from '../../utils/fetch/fetch';
import { Controller, useForm } from 'react-hook-form';

const Underkjenn = (props: {
    size?: 'small' | 'medium';
    onUnderkjenn: {
        click: (begrunnelse: string) => void;
        pending: boolean;
        error?: FetcherError;
    };
}) => {
    const [vilUnderkjenne, setVilUnderkjenne] = useState(false);

    return (
        <div>
            <Button
                size={props.size}
                onClick={() => setVilUnderkjenne(true)}
                variant="secondary"
                type="button"
            >
                Underkjenn
            </Button>
            {vilUnderkjenne && (
                <UnderkjennModal
                    open={vilUnderkjenne}
                    onClose={() => setVilUnderkjenne(false)}
                    onUnderkjenn={props.onUnderkjenn}
                />
            )}
        </div>
    );
};

export default Underkjenn;

const UnderkjennModal = (props: {
    open: boolean;
    onClose: () => void;
    onUnderkjenn: {
        click: (begrunnelse: string) => void;
        pending: boolean;
        error?: FetcherError;
    };
}) => {
    const form = useForm({
        defaultValues: {
            begrunnelse: '',
        },
    });

    return (
        <Modal
            width={540}
            open={props.open}
            aria-label="Underkjenn behandling"
            onClose={props.onClose}
        >
            <form
                onSubmit={form.handleSubmit((data) => props.onUnderkjenn.click(data.begrunnelse))}
            >
                <Modal.Header>
                    <Heading size="medium" level="4">
                        Underkjenn behandling
                    </Heading>
                </Modal.Header>
                <Modal.Body>
                    <Controller
                        control={form.control}
                        rules={{
                            required: 'Begrunnelse er påkrevd',
                            minLength: 1,
                        }}
                        render={({ field, fieldState }) => (
                            <Textarea
                                error={fieldState.error?.message}
                                label={'Begrunnelse'}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                        name={'begrunnelse'}
                    />
                </Modal.Body>
                <Modal.Footer>
                    {props.onUnderkjenn.error && (
                        <Alert variant={'error'}>{props.onUnderkjenn.error.message}</Alert>
                    )}
                    <HStack gap="2">
                        <Button type="button" variant="secondary" onClick={props.onClose}>
                            Avbryt
                        </Button>
                        <Button loading={props.onUnderkjenn.pending}>Underkjenn</Button>
                    </HStack>
                </Modal.Footer>
            </form>
        </Modal>
    );
};
