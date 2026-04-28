import {
    Alert,
    Box,
    Button,
    DatePicker,
    Detail,
    Heading,
    HStack,
    Label,
    LocalAlert,
    Modal,
    Radio,
    RadioGroup,
    Select,
    TextField,
    useRangeDatepicker,
    VStack,
} from '@navikt/ds-react';
import React from 'react';
import { useFetchJsonFraApi } from '../../utils/fetch/useFetchFraApi';
import router from 'next/router';
import { pageWithAuthentication } from '../../auth/pageWithAuthentication';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { dateTilISOTekst } from '../../utils/date';

import { Nullable } from '~/types/UtilTypes';
import {
    KlageHendelseFeilregistrertType,
    KlageHendelseKlagebehandlingAvsluttetUtfall,
    OmgjøringskravbehandlingAvsluttetUtfall,
} from '~/lib/klage/typer/Klageinstanshendelse';

export const getServerSideProps = pageWithAuthentication(async () => {
    if (process?.env.NEXT_PUBLIC_DEVROUTES && process.env.NEXT_PUBLIC_DEVROUTES === 'true') {
        return { props: {} };
    }

    return { notFound: true };
});

const LocalDevPage = () => {
    return (
        <VStack justify={'center'} align={'center'} style={{ height: '70vh' }}>
            <HStack gap="space-6">
                <NySøknad />
                <KlageHendelse />
            </HStack>
        </VStack>
    );
};

export default LocalDevPage;

const KlageHendelse = () => {
    const [vilOppretteKlageHendelse, setVilOppretteKlageHendelse] = React.useState(false);

    return (
        <div>
            {vilOppretteKlageHendelse && (
                <KlageHendelseModal
                    open={vilOppretteKlageHendelse}
                    onClose={() => setVilOppretteKlageHendelse(false)}
                />
            )}
            <Button variant="secondary" onClick={() => setVilOppretteKlageHendelse(true)}>
                Ny klagehendelse
            </Button>
        </div>
    );
};

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

const KlageHendelseModal = (props: { open: boolean; onClose: () => void }) => {
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
            const errors: Record<string, { message: string }> = {};
            if (!values.klagebehandlingId) {
                errors.klagebehandlingId = { message: 'Klagebehandling ID er påkrevd' };
            }
            if (!values.type) {
                errors.type = { message: 'Type er påkrevd' };
            }
            if (!values.utfall) {
                errors.utfall = { message: 'Utfall er påkrevd' };
            }

            if (values.type && values.utfall) {
                if (values.type === LokalHendelseType.KLAGEBEHANDLING_AVSLUTTET) {
                    if (
                        !Object.values(KlageHendelseKlagebehandlingAvsluttetUtfall).includes(
                            values.utfall as KlageHendelseKlagebehandlingAvsluttetUtfall,
                        )
                    ) {
                        errors.utfall = { message: 'Ugyldig utfall for klagebehandling avsluttet' };
                    }
                } else if (values.type === LokalHendelseType.OMGJOERINGSKRAVBEHANDLING_AVSLUTTET) {
                    if (
                        !Object.values(OmgjøringskravbehandlingAvsluttetUtfall).includes(
                            values.utfall as OmgjøringskravbehandlingAvsluttetUtfall,
                        )
                    ) {
                        errors.utfall = {
                            message: 'Ugyldig utfall for omgjøringskravbehandling avsluttet',
                        };
                    }
                } else if (values.type === LokalHendelseType.BEHANDLING_FEILREGISTRERT) {
                    if (
                        !Object.values(KlageHendelseFeilregistrertType).includes(
                            values.utfall as KlageHendelseFeilregistrertType,
                        )
                    ) {
                        errors.utfall = { message: 'Ugyldig utfall for behandling feilregistrert' };
                    }
                }
            }

            return { values, errors };
        },
    });

    /* eslint-disable-next-line */
    const type = form.watch('type');

    const onSubmit = (values: KlageHendelseFormData) => {
        nyKlageHendelse.trigger(values);
        props.onClose();
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Modal aria-label="Lag ny klagehendelse" open={props.open} onClose={props.onClose}>
                <Modal.Header>
                    <Heading size="medium">Lag ny klagehendelse</Heading>
                </Modal.Header>
                <Modal.Body>
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
                </Modal.Body>
                <Modal.Footer>
                    {nyKlageHendelse.error && (
                        <LocalAlert status="error">
                            <LocalAlert.Header>
                                <LocalAlert.Title>En feil skjedde</LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>{nyKlageHendelse.error.message}</LocalAlert.Content>
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
                </Modal.Footer>
            </Modal>
        </form>
    );
};

const NySøknad = () => {
    const [vilOppretteNySøknad, setVilOppretteNySøknad] = React.useState(false);

    return (
        <div>
            {vilOppretteNySøknad && (
                <NySøknadModal
                    open={vilOppretteNySøknad}
                    onClose={() => setVilOppretteNySøknad(false)}
                />
            )}
            <Button variant="secondary" onClick={() => setVilOppretteNySøknad(true)}>
                Ny søknad
            </Button>
        </div>
    );
};

interface NySøknadFormData {
    fnr: string;
    periode: { fraOgMed: Date | undefined; tilOgMed: Date | undefined };
    vilHaBarn: boolean;
    barnetillegg: {
        fnr: string;
        fødselsdato: string;
        fornavn: string;
        etternavn: string;
        oppholderSegIEØS: { svar: 'Ja' | 'Nei' };
    }[];
}

const NySøknadModal = (props: { open: boolean; onClose: () => void }) => {
    const form = useForm<NySøknadFormData>({
        defaultValues: {
            fnr: '',
            periode: { fraOgMed: undefined, tilOgMed: undefined },
            vilHaBarn: false,
            barnetillegg: [],
        },
    });
    const { fields, append, remove } = useFieldArray({
        name: 'barnetillegg',
        control: form.control,
    });

    const fetchNysøknad = useFetchJsonFraApi<
        string,
        {
            fnr: string | null;
            deltakelsesperiode: {
                fraOgMed: string;
                tilOgMed: string;
            } | null;
            barnetillegg: {
                fnr: Nullable<string>;
                fødselsdato: Nullable<string>;
                fornavn: Nullable<string>;
                etternavn: Nullable<string>;
                oppholderSegIEØS: { svar: 'Ja' | 'Nei' };
            }[];
        }
    >('/dev/soknad/ny', 'POST', {
        onSuccess: (data) => {
            router.push(`/sak/${data}`);
        },
    });

    const onSubmit = (values: NySøknadFormData) => {
        fetchNysøknad.trigger({
            fnr: values.fnr ? values.fnr : null,
            deltakelsesperiode:
                values.periode.fraOgMed && values.periode.tilOgMed
                    ? {
                          fraOgMed: dateTilISOTekst(values.periode.fraOgMed),
                          tilOgMed: dateTilISOTekst(values.periode.tilOgMed),
                      }
                    : null,
            barnetillegg:
                values.vilHaBarn && values.barnetillegg.length > 0
                    ? values.barnetillegg.map((b) => ({
                          fnr: b.fnr || null,
                          fødselsdato: b.fødselsdato || null,
                          fornavn: b.fornavn || null,
                          etternavn: b.etternavn || null,
                          oppholderSegIEØS: b.oppholderSegIEØS,
                      }))
                    : [],
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Modal aria-label="Lag ny søknad" open={props.open} onClose={props.onClose}>
                <Modal.Header>
                    <Heading size="medium">Lag ny søknad</Heading>
                </Modal.Header>
                <Modal.Body>
                    <VStack gap="space-20">
                        <Controller
                            render={({ field }) => (
                                <TextField
                                    label="Fødselsnummer"
                                    description="Hvis du ikke setter in fnr, vil det bli generert et tilfeldig (mest sannsynlig ugyldig) fnr"
                                    size="small"
                                    {...field}
                                />
                            )}
                            name={'fnr'}
                            control={form.control}
                        />

                        <Controller
                            render={({ field }) => (
                                <RangePickerDate
                                    size="small"
                                    value={{
                                        fraOgMed: field.value.fraOgMed,
                                        tilOgMed: field.value.tilOgMed,
                                    }}
                                    onChange={(periode) => {
                                        field.onChange(periode);
                                    }}
                                />
                            )}
                            name={'periode'}
                            control={form.control}
                        />

                        <VStack gap="space-8">
                            <Controller
                                render={({ field }) => (
                                    <RadioGroup
                                        legend={'Vil du ha barnetillegg?'}
                                        {...field}
                                        size="small"
                                    >
                                        <Radio value={true}>Ja</Radio>
                                        <Radio value={false}>Nei</Radio>
                                    </RadioGroup>
                                )}
                                name="vilHaBarn"
                                control={form.control}
                            />
                            {/* eslint-disable-next-line */}
                            {form.watch('vilHaBarn') && (
                                <VStack gap="space-16">
                                    {fields.map((item, index) => {
                                        return (
                                            <Box
                                                key={item.id}
                                                background="neutral-soft"
                                                style={{ padding: '16px' }}
                                            >
                                                <VStack gap="space-16">
                                                    <Controller
                                                        render={({ field }) => (
                                                            <TextField
                                                                size="small"
                                                                label="Fødselsnummer"
                                                                description="11 siffer - Tilfeldig (mest sannsynlig ugyldig) hvis ikke oppgitt"
                                                                {...field}
                                                            />
                                                        )}
                                                        name={`barnetillegg.${index}.fnr`}
                                                        control={form.control}
                                                    />
                                                    <Controller
                                                        render={({ field }) => (
                                                            <TextField
                                                                size="small"
                                                                label="Fødselsdato"
                                                                description="YYYY-MM-DD - Tilfeldig hvis ikke oppgitt"
                                                                {...field}
                                                            />
                                                        )}
                                                        name={`barnetillegg.${index}.fødselsdato`}
                                                        control={form.control}
                                                    />
                                                    <HStack gap="space-8">
                                                        <Controller
                                                            render={({ field }) => (
                                                                <TextField
                                                                    size="small"
                                                                    label="Fornavn"
                                                                    description="Tilfeldig hvis ikke oppgitt"
                                                                    {...field}
                                                                />
                                                            )}
                                                            name={`barnetillegg.${index}.fornavn`}
                                                            control={form.control}
                                                        />
                                                        <Controller
                                                            render={({ field }) => (
                                                                <TextField
                                                                    size="small"
                                                                    label="Etternavn"
                                                                    description="Tilfeldig hvis ikke oppgitt"
                                                                    {...field}
                                                                />
                                                            )}
                                                            name={`barnetillegg.${index}.etternavn`}
                                                            control={form.control}
                                                        />
                                                    </HStack>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <RadioGroup
                                                                size="small"
                                                                legend={'Oppholder seg i EØS?'}
                                                                {...field}
                                                                value={field.value}
                                                            >
                                                                <Radio value={'Ja'}>Ja</Radio>
                                                                <Radio value={'Nei'}>Nei</Radio>
                                                            </RadioGroup>
                                                        )}
                                                        name={`barnetillegg.${index}.oppholderSegIEØS.svar`}
                                                        control={form.control}
                                                    />
                                                    <Button
                                                        type="button"
                                                        size="small"
                                                        variant="secondary"
                                                        style={{ alignSelf: 'end' }}
                                                        onClick={() => remove(index)}
                                                    >
                                                        Fjern
                                                    </Button>
                                                </VStack>
                                            </Box>
                                        );
                                    })}
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="small"
                                        style={{ alignSelf: 'start' }}
                                        onClick={() =>
                                            append({
                                                fnr: '',
                                                fødselsdato: '',
                                                fornavn: '',
                                                etternavn: '',
                                                oppholderSegIEØS: { svar: 'Ja' },
                                            })
                                        }
                                    >
                                        Legg til
                                    </Button>
                                </VStack>
                            )}
                        </VStack>
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    <VStack gap="space-16">
                        {fetchNysøknad.error && (
                            <Alert variant="error">{fetchNysøknad.error.message}</Alert>
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
                            <Button
                                variant="primary"
                                loading={fetchNysøknad.isMutating}
                                size="small"
                            >
                                Lag søknad
                            </Button>
                        </HStack>
                    </VStack>
                </Modal.Footer>
            </Modal>
        </form>
    );
};

export const RangePickerDate = (props: {
    value: { fraOgMed: Date | undefined; tilOgMed: Date | undefined };
    size?: 'medium' | 'small';
    onChange: (periode: { fraOgMed: Date | undefined; tilOgMed: Date | undefined }) => void;
    error?: { fraOgMed?: string; tilOgMed?: string };
}) => {
    const { datepickerProps, fromInputProps, toInputProps } = useRangeDatepicker({
        onRangeChange: (v) =>
            props.onChange({ fraOgMed: v?.from ?? undefined, tilOgMed: v?.to ?? undefined }),
        defaultSelected: {
            from: props.value.fraOgMed ?? undefined,
            to: props.value.tilOgMed ?? undefined,
        },
    });

    return (
        <VStack>
            <Label>Deltakelsesperiode</Label>
            <Detail>Default periode er 1.april 2025 - 10.april 2025</Detail>
            <HStack gap={'space-16'}>
                <DatePicker {...datepickerProps} dropdownCaption>
                    <DatePicker.Input
                        {...fromInputProps}
                        label={'Fra og med'}
                        size={props.size ?? 'medium'}
                    />
                </DatePicker>
                <DatePicker {...datepickerProps} dropdownCaption>
                    <DatePicker.Input
                        {...toInputProps}
                        label={'Til og med'}
                        size={props.size ?? 'medium'}
                    />
                </DatePicker>
            </HStack>
        </VStack>
    );
};
