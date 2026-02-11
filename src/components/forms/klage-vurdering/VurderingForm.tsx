import React from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import {
    KlagehjemmelFormData,
    klageHjemlerFormDataTilTekst,
    KlageVurderingTypeFormData,
    klageVurderingTypeFormDataTilTekst,
    OmgjøringÅrsakFormData,
    omgjøringÅrsakFormDataTilTekst,
    VurderingFormData,
} from './VurderingFormUtils';
import { Select, Textarea, UNSAFE_Combobox, VStack } from '@navikt/ds-react';

const VurderingForm = (props: { control: Control<VurderingFormData>; readonly?: boolean }) => {
    const klagevurderingstype = useWatch({
        control: props.control,
        name: 'klageVurderingType',
    });

    return (
        <VStack gap="space-32">
            <Controller
                control={props.control}
                name={'klageVurderingType'}
                render={({ field, fieldState }) => (
                    <Select
                        {...field}
                        label="Vedtak"
                        readOnly={props.readonly}
                        error={fieldState.error?.message}
                    >
                        <option value="">Velg</option>
                        {Object.values(KlageVurderingTypeFormData).map((type) => (
                            <option key={type} value={type}>
                                {klageVurderingTypeFormDataTilTekst[type]}
                            </option>
                        ))}
                    </Select>
                )}
            />
            {klagevurderingstype === KlageVurderingTypeFormData.OMGJØR && (
                <>
                    <Controller
                        control={props.control}
                        name="omgjør.årsak"
                        render={({ field, fieldState }) => (
                            <Select
                                {...field}
                                label="Årsak"
                                error={fieldState.error?.message}
                                readOnly={props.readonly}
                            >
                                <option value="">Velg</option>
                                {Object.values(OmgjøringÅrsakFormData).map((årsak) => (
                                    <option key={årsak} value={årsak}>
                                        {omgjøringÅrsakFormDataTilTekst[årsak]}
                                    </option>
                                ))}
                            </Select>
                        )}
                    />

                    <Controller
                        control={props.control}
                        name="omgjør.begrunnelse"
                        render={({ field, fieldState }) => (
                            <Textarea
                                {...field}
                                label="Begrunnelse"
                                error={fieldState.error?.message}
                                readOnly={props.readonly}
                            />
                        )}
                    />
                </>
            )}
            {klagevurderingstype === KlageVurderingTypeFormData.OPPRETTHOLD && (
                <Controller
                    control={props.control}
                    name="oppretthold.hjemler"
                    render={({ field, fieldState }) => (
                        <UNSAFE_Combobox
                            label="Hjemler"
                            isMultiSelect
                            error={fieldState.error?.message}
                            ref={field.ref}
                            name={field.name}
                            onBlur={field.onBlur}
                            readOnly={props.readonly}
                            selectedOptions={field.value}
                            options={Object.values(KlagehjemmelFormData).map(
                                (hjemmel) => klageHjemlerFormDataTilTekst[hjemmel],
                            )}
                            onToggleSelected={(option, isSelected) => {
                                if (isSelected) {
                                    field.onChange([...field.value, option]);
                                } else {
                                    field.onChange(field.value.filter((v) => v !== option));
                                }
                            }}
                        />
                    )}
                />
            )}
        </VStack>
    );
};

export default VurderingForm;
