import { Control, Controller } from 'react-hook-form';
import { FormkravFormData, INGEN_VEDTAK } from './FormkravFormUtils';
import { HStack, Radio, RadioGroup, Select, TextField, VStack } from '@navikt/ds-react';
import { Rammevedtak } from '~/types/Rammevedtak';
import { Rammebehandling } from '~/types/Rammebehandling';
import { Datovelger } from '~/components/datovelger/Datovelger';
import { datoTilDatoInputText } from '~/utils/date';

const FormkravForm = (props: {
    control: Control<FormkravFormData>;
    vedtakOgBehandling: Array<{ vedtak: Rammevedtak; behandling: Rammebehandling }>;
    readonly?: boolean;
}) => {
    return (
        <VStack gap="8" align="start">
            <Controller
                control={props.control}
                name="journalpostId"
                render={({ field, fieldState }) => (
                    <TextField
                        {...field}
                        label="Journalpost ID"
                        size="small"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    />
                )}
            />
            <Controller
                control={props.control}
                name="mottattFraJournalpost"
                render={({ field, fieldState }) => (
                    <Datovelger
                        {...field}
                        onDateChange={field.onChange}
                        value={field.value ? datoTilDatoInputText(field.value) : undefined}
                        label="Opprettet (fra journalpost)"
                        size="small"
                        error={fieldState.error?.message}
                        maxDate={new Date()}
                        readOnly={props.readonly}
                    />
                )}
            />
            <Controller
                control={props.control}
                name="vedtakDetPåklages"
                render={({ field, fieldState }) => (
                    <Select
                        {...field}
                        label="Vedtaket som er påklaget"
                        size="small"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <option value="">Ikke valgt</option>
                        <option value={INGEN_VEDTAK}>Har ikke klaget på et vedtak</option>
                        {props.vedtakOgBehandling.map(({ vedtak, behandling }) => (
                            <option key={`${vedtak.id}-${behandling.id}`} value={vedtak.id}>
                                {behandling.type} - {vedtak.resultat} - {vedtak.opprettet}
                            </option>
                        ))}
                    </Select>
                )}
            />

            <Controller
                control={props.control}
                name="erKlagerPartISaken"
                render={({ field, fieldState }) => (
                    <RadioGroup
                        {...field}
                        legend="Er klager part i saken?"
                        size="small"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="6">
                            <Radio value={true}>Ja</Radio>
                            <Radio value={false}>Nei</Radio>
                        </HStack>
                    </RadioGroup>
                )}
            />
            <Controller
                control={props.control}
                name="klagesDetPåKonkreteElementer"
                render={({ field, fieldState }) => (
                    <RadioGroup
                        {...field}
                        legend="Klages det på konkrete elementer i vedtaket?"
                        size="small"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="6">
                            <Radio value={true}>Ja</Radio>
                            <Radio value={false}>Nei</Radio>
                        </HStack>
                    </RadioGroup>
                )}
            />
            <Controller
                control={props.control}
                name="erKlagefristOverholdt"
                render={({ field, fieldState }) => (
                    <RadioGroup
                        {...field}
                        legend="Er klagefristen overholdt?"
                        size="small"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="6">
                            <Radio value={true}>Ja</Radio>
                            <Radio value={false}>Nei</Radio>
                        </HStack>
                    </RadioGroup>
                )}
            />
            <Controller
                control={props.control}
                name="erKlagenSignert"
                render={({ field, fieldState }) => (
                    <RadioGroup
                        {...field}
                        legend="Er klagen signert?"
                        size="small"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="6">
                            <Radio value={true}>Ja</Radio>
                            <Radio value={false}>Nei</Radio>
                        </HStack>
                    </RadioGroup>
                )}
            />
        </VStack>
    );
};

export default FormkravForm;
