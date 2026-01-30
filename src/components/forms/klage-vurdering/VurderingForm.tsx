import React from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import {
    KlageVurderingTypeFormData,
    klageVurderingTypeFormDataTilTekst,
    OmgjøringÅrsakFormData,
    omgjøringÅrsakFormDataTilTekst,
    VurderingFormData,
} from './VurderingFormUtils';
import { Select, Textarea, VStack } from '@navikt/ds-react';

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
                    <Select {...field} label="Vedtak" readOnly error={fieldState.error?.message}>
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
        </VStack>
    );
};

export default VurderingForm;
