import {
    Alert,
    Box,
    Button,
    DatePicker,
    Detail,
    Heading,
    HStack,
    Label,
    Modal,
    Radio,
    RadioGroup,
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

export const getServerSideProps = pageWithAuthentication(async () => {
    if (process?.env.NEXT_PUBLIC_DEVROUTES && process.env.NEXT_PUBLIC_DEVROUTES === 'true') {
        return { props: {} };
    }

    return {
        notFound: true,
    };
});

const LocalDevPage = () => {
    return (
        <VStack justify={'center'} align={'center'} style={{ height: '70vh' }}>
            <HStack>
                <NySøknad />
            </HStack>
        </VStack>
    );
};

export default LocalDevPage;

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
                    <VStack gap="5">
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

                        <VStack gap="2">
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
                            {form.watch('vilHaBarn') && (
                                <VStack gap="4">
                                    {fields.map((item, index) => {
                                        return (
                                            <Box
                                                key={item.id}
                                                background="bg-subtle"
                                                style={{ padding: '16px' }}
                                            >
                                                <VStack gap="4">
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
                                                    <HStack gap="2">
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
                    <VStack gap="4">
                        {fetchNysøknad.error && (
                            <Alert variant="error">{fetchNysøknad.error.message}</Alert>
                        )}
                        <HStack gap="4">
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
            <HStack gap={'4'}>
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
