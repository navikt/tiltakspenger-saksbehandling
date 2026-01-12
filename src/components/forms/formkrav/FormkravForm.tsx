import { Control, Controller } from 'react-hook-form';
import { FormkravFormData, INGEN_VEDTAK } from './FormkravFormUtils';
import { Radio, RadioGroup, Select, TextField, VStack } from '@navikt/ds-react';
import { Rammevedtak } from '~/types/Rammevedtak';
import { Rammebehandling } from '~/types/Rammebehandling';

const FormkravForm = (props: {
    control: Control<FormkravFormData>;
    vedtakOgBehandling: Array<{ vedtak: Rammevedtak; behandling: Rammebehandling }>;
}) => {
    return (
        <VStack gap="2" align="start">
            <Controller
                control={props.control}
                name="journalpostId"
                render={({ field, fieldState }) => (
                    <TextField
                        {...field}
                        label="Journalpost ID"
                        size="small"
                        error={fieldState.error?.message}
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
                    >
                        <option value="">Velg vedtak</option>
                        <option value={INGEN_VEDTAK}>Ingen vedtak</option>
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
                    >
                        <Radio value={true}>Ja</Radio>
                        <Radio value={false}>Nei</Radio>
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
                    >
                        <Radio value={true}>Ja</Radio>
                        <Radio value={false}>Nei</Radio>
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
                    >
                        <Radio value={true}>Ja</Radio>
                        <Radio value={false}>Nei</Radio>
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
                    >
                        <Radio value={true}>Ja</Radio>
                        <Radio value={false}>Nei</Radio>
                    </RadioGroup>
                )}
            />
        </VStack>
    );
};

export default FormkravForm;
