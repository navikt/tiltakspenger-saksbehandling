import {
    Box,
    Button,
    Dialog,
    HStack,
    Radio,
    RadioGroup,
    TextField,
    VStack,
} from '@navikt/ds-react';
import router from 'next/router';
import styles from '~/dev/DevModal.module.css';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { RangePickerDate } from '~/dev/søknad/RangePickerDate';
import { Saksnummer } from '~/lib/sak/Saksnummer';
import { Nullable } from '~/types/UtilTypes';
import { Oppholdssted } from '~/lib/søknad/søknadTyper';
import { dateTilISOTekst } from '~/utils/date';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { personoversiktUrl } from '~/utils/urls';

interface NySøknadFormData {
    fnr: string;
    periode: { fraOgMed: Date | undefined; tilOgMed: Date | undefined };
    vilHaBarn: boolean;
    barnetillegg: {
        fnr: string;
        fødselsdato: string;
        fornavn: string;
        etternavn: string;
        oppholdssted: Oppholdssted;
    }[];
}

export const NySøknadModal = (props: { open: boolean; onClose: () => void }) => {
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
        Saksnummer,
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
                oppholdssted: Oppholdssted;
            }[];
        }
    >('/dev/soknad/ny', 'POST', {
        onSuccess: (data) => {
            router.push(personoversiktUrl(data));
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
                          oppholderSegIEØS: {
                              svar: b.oppholdssted === 'IKKE_EØS_LAND' ? 'Nei' : 'Ja',
                          },
                          oppholdssted: b.oppholdssted,
                      }))
                    : [],
        });
    };

    return (
        <Dialog open={props.open} onOpenChange={(nesteÅpen) => !nesteÅpen && props.onClose()}>
            <Dialog.Popup aria-label="Lag ny søknad">
                <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
                    <Dialog.Header>
                        <Dialog.Title>Lag ny søknad</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
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
                                                                    legend={'Oppholdssted'}
                                                                    {...field}
                                                                    value={field.value}
                                                                >
                                                                    <Radio value={'NORGE'}>
                                                                        Norge
                                                                    </Radio>
                                                                    <Radio value={'ANNET_EØS_LAND'}>
                                                                        Annet EØS-land
                                                                    </Radio>
                                                                    <Radio value={'IKKE_EØS_LAND'}>
                                                                        Land utenfor EØS
                                                                    </Radio>
                                                                </RadioGroup>
                                                            )}
                                                            name={`barnetillegg.${index}.oppholdssted`}
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
                                                    oppholdssted: 'NORGE',
                                                })
                                            }
                                        >
                                            Legg til
                                        </Button>
                                    </VStack>
                                )}
                            </VStack>
                        </VStack>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <VStack gap="space-16">
                            {fetchNysøknad.error && (
                                <Infokort variant={'feil'}>{fetchNysøknad.error.message}</Infokort>
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
                    </Dialog.Footer>
                </form>
            </Dialog.Popup>
        </Dialog>
    );
};
