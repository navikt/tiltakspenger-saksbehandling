import { Button, Dialog, HStack, LocalAlert, Select, TextField, VStack } from '@navikt/ds-react';
import styles from '~/dev/DevModal.module.css';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { resolverResultat } from '~/utils/resolverResultat';
import {
    KlageHendelseFeilregistrertType,
    KlageHendelseKlagebehandlingAvsluttetUtfall,
    OmgjøringskravbehandlingAvsluttetUtfall,
} from '~/lib/klage/typer/Klageinstanshendelse';

interface KlageHendelseFormData {
    klagebehandlingId: string;
    type: LokalHendelseType | '';
    utfall: LokalHendelseUtfall | '';
}

enum LokalHendelseType {
    KLAGEBEHANDLING_AVSLUTTET = 'KLAGEBEHANDLING_AVSLUTTET',
    OMGJOERINGSKRAVBEHANDLING_AVSLUTTET = 'OMGJOERINGSKRAVBEHANDLING_AVSLUTTET',
    BEHANDLING_FEILREGISTRERT = 'BEHANDLING_FEILREGISTRERT',
}

type LokalHendelseUtfall =
    | KlageHendelseKlagebehandlingAvsluttetUtfall
    | OmgjøringskravbehandlingAvsluttetUtfall
    | KlageHendelseFeilregistrertType;

export const KlageHendelseModal = (props: { open: boolean; onClose: () => void }) => {
    const nyKlageHendelse = useFetchJsonFraApi<void, KlageHendelseFormData>(
        '/dev/klage/hendelse',
        'POST',
    );

    const form = useForm<KlageHendelseFormData>({
        defaultValues: {
            klagebehandlingId: '',
            type: '',
            utfall: '',
        },
        resolver: async (values) => {
            const errors: FieldErrors<KlageHendelseFormData> = {};
            if (!values.klagebehandlingId) {
                errors.klagebehandlingId = {
                    type: 'required',
                    message: 'Klagebehandling ID er påkrevd',
                };
            }
            if (!values.type) {
                errors.type = { type: 'required', message: 'Type er påkrevd' };
            }
            if (!values.utfall) {
                errors.utfall = { type: 'required', message: 'Utfall er påkrevd' };
            }

            if (values.type && values.utfall) {
                if (values.type === LokalHendelseType.KLAGEBEHANDLING_AVSLUTTET) {
                    if (
                        !Object.values(KlageHendelseKlagebehandlingAvsluttetUtfall).includes(
                            values.utfall as KlageHendelseKlagebehandlingAvsluttetUtfall,
                        )
                    ) {
                        errors.utfall = {
                            type: 'validate',
                            message: 'Ugyldig utfall for klagebehandling avsluttet',
                        };
                    }
                } else if (values.type === LokalHendelseType.OMGJOERINGSKRAVBEHANDLING_AVSLUTTET) {
                    if (
                        !Object.values(OmgjøringskravbehandlingAvsluttetUtfall).includes(
                            values.utfall as OmgjøringskravbehandlingAvsluttetUtfall,
                        )
                    ) {
                        errors.utfall = {
                            type: 'validate',
                            message: 'Ugyldig utfall for omgjøringskravbehandling avsluttet',
                        };
                    }
                } else if (values.type === LokalHendelseType.BEHANDLING_FEILREGISTRERT) {
                    if (
                        !Object.values(KlageHendelseFeilregistrertType).includes(
                            values.utfall as KlageHendelseFeilregistrertType,
                        )
                    ) {
                        errors.utfall = {
                            type: 'validate',
                            message: 'Ugyldig utfall for behandling feilregistrert',
                        };
                    }
                }
            }

            return resolverResultat(values, errors);
        },
    });

    /* eslint-disable-next-line */
    const type = form.watch('type');

    const onSubmit = (values: KlageHendelseFormData) => {
        nyKlageHendelse.trigger(values);
        props.onClose();
    };

    return (
        <Dialog open={props.open} onOpenChange={(nesteÅpen) => !nesteÅpen && props.onClose()}>
            <Dialog.Popup aria-label="Lag ny klagehendelse">
                <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
                    <Dialog.Header>
                        <Dialog.Title>Lag ny klagehendelse</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <VStack gap="space-20">
                            <Controller
                                control={form.control}
                                name={'klagebehandlingId'}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        error={fieldState.error?.message}
                                        label="Klagebehandling ID"
                                        description="IDen til klagebehandlingen hendelsen skal knyttes til"
                                        size="small"
                                    />
                                )}
                            />
                            <Controller
                                control={form.control}
                                name={'type'}
                                render={({ field, fieldState }) => (
                                    <Select
                                        {...field}
                                        label="Type"
                                        size="small"
                                        error={fieldState.error?.message}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            form.setValue('utfall', '');
                                        }}
                                    >
                                        <option value="">Velg type</option>
                                        <option value={LokalHendelseType.KLAGEBEHANDLING_AVSLUTTET}>
                                            Klagebehandling avsluttet
                                        </option>
                                        <option
                                            value={
                                                LokalHendelseType.OMGJOERINGSKRAVBEHANDLING_AVSLUTTET
                                            }
                                        >
                                            Omgjøringskravbehandling avsluttet
                                        </option>
                                        <option value={LokalHendelseType.BEHANDLING_FEILREGISTRERT}>
                                            Behandling feilregistrert
                                        </option>
                                    </Select>
                                )}
                            />
                            {type && (
                                <Controller
                                    control={form.control}
                                    name={'utfall'}
                                    render={({ field, fieldState }) => (
                                        <Select
                                            {...field}
                                            label="Utfall"
                                            size="small"
                                            error={fieldState.error?.message}
                                        >
                                            <option value="">Velg utfall</option>
                                            {type === LokalHendelseType.KLAGEBEHANDLING_AVSLUTTET &&
                                                Object.values(
                                                    KlageHendelseKlagebehandlingAvsluttetUtfall,
                                                ).map((utfall) => (
                                                    <option key={utfall} value={utfall}>
                                                        {utfall}
                                                    </option>
                                                ))}
                                            {type ===
                                                LokalHendelseType.OMGJOERINGSKRAVBEHANDLING_AVSLUTTET &&
                                                Object.values(
                                                    OmgjøringskravbehandlingAvsluttetUtfall,
                                                ).map((utfall) => (
                                                    <option key={utfall} value={utfall}>
                                                        {utfall}
                                                    </option>
                                                ))}
                                            {type === LokalHendelseType.BEHANDLING_FEILREGISTRERT &&
                                                Object.values(KlageHendelseFeilregistrertType).map(
                                                    (utfall) => (
                                                        <option key={utfall} value={utfall}>
                                                            {utfall}
                                                        </option>
                                                    ),
                                                )}
                                        </Select>
                                    )}
                                />
                            )}
                        </VStack>
                    </Dialog.Body>
                    <Dialog.Footer>
                        {nyKlageHendelse.error && (
                            <LocalAlert status="error">
                                <LocalAlert.Header>
                                    <LocalAlert.Title>En feil skjedde</LocalAlert.Title>
                                </LocalAlert.Header>
                                <LocalAlert.Content>
                                    {nyKlageHendelse.error.message}
                                </LocalAlert.Content>
                            </LocalAlert>
                        )}
                        <HStack gap="space-16">
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={props.onClose}
                                size="small"
                            >
                                Avbryt
                            </Button>
                            <Button variant="primary" type="submit" size="small">
                                Lag klagehendelse
                            </Button>
                        </HStack>
                    </Dialog.Footer>
                </form>
            </Dialog.Popup>
        </Dialog>
    );
};
