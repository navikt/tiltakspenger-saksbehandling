import { useState } from 'react';
import router from 'next/router';
import { Button, ButtonProps, Textarea } from '@navikt/ds-react';
import { SakId } from '~/lib/sak/SakTyper';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import styles from './AvsluttMeldekortbehandling.module.css';
import AvbrytBehandlingModal from '~/lib/_felles/modaler/avbryt/AvbrytBehandlingModal';
import { Controller, FieldErrors, useForm } from 'react-hook-form';

export const AvsluttMeldekortbehandlingModal = (props: {
    sakId: SakId;
    meldekortbehandlingId: MeldekortbehandlingId;
    personoversiktUrl: string;
    åpen: boolean;
    onClose: () => void;
}) => {
    const form = useForm<{ begrunnelse: string }>({
        defaultValues: { begrunnelse: '' },
        resolver: (values) => {
            const errors: FieldErrors<{ begrunnelse: string }> = {};

            if (!values.begrunnelse || values.begrunnelse.trim() === '') {
                errors.begrunnelse = { type: 'required', message: 'Du må fylle ut en begrunnelse' };
            }
            return { values, errors };
        },
    });

    const avsluttMeldekortbehandlingApi = useFetchJsonFraApi<
        MeldekortbehandlingProps,
        { begrunnelse: string }
    >(`/sak/${props.sakId}/meldekort/${props.meldekortbehandlingId}/avbryt`, 'POST', {
        onSuccess: () => {
            router.push(props.personoversiktUrl);
        },
    });

    const onSubmit = (values: { begrunnelse: string }) => {
        avsluttMeldekortbehandlingApi.trigger({ begrunnelse: values.begrunnelse });
    };

    return (
        <AvbrytBehandlingModal
            bodyInnhold={
                <Controller
                    name="begrunnelse"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Textarea
                            {...field}
                            error={fieldState.error?.message}
                            label={'Hvorfor avsluttes behandlingen? (obligatorisk)'}
                            maxLength={200}
                            size="small"
                        />
                    )}
                />
            }
            åpen={props.åpen}
            onClose={props.onClose}
            onSubmit={form.handleSubmit(onSubmit)}
        />
    );
};

const AvsluttMeldekortbehandling = (props: {
    sakId: SakId;
    meldekortbehandlingId: MeldekortbehandlingId;
    personoversiktUrl: string;
    buttonProps?: {
        size?: ButtonProps['size'];
        variant?: ButtonProps['variant'];
    };
}) => {
    const [vilAvslutteBehandling, setVilAvslutteBehandling] = useState(false);

    return (
        <div>
            {vilAvslutteBehandling && (
                <AvsluttMeldekortbehandlingModal
                    åpen={vilAvslutteBehandling}
                    onClose={() => setVilAvslutteBehandling(false)}
                    sakId={props.sakId}
                    meldekortbehandlingId={props.meldekortbehandlingId}
                    personoversiktUrl={props.personoversiktUrl}
                />
            )}
            <Button
                className={styles.knapp}
                size={props.buttonProps?.size ?? 'small'}
                variant={props.buttonProps?.variant ?? 'danger'}
                type="button"
                onClick={() => {
                    setVilAvslutteBehandling(true);
                }}
            >
                Avslutt behandling
            </Button>
        </div>
    );
};

export default AvsluttMeldekortbehandling;
