import React from 'react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import type { Papirsøknad } from '~/components/papirsøknad/papirsøknadTypes';
import { JaNeiSpørsmål } from './JaNeiSpørsmål';
import { Periodevelger } from './Periodevelger';

import styles from './Spørsmål.module.css';

type Props = {
    spørsmålName: FieldPath<Papirsøknad>;
    periodeName: FieldPath<Papirsøknad>;
    spørsmål: string;
    periodeSpørsmål?: string;
};

export const SpørsmålMedPeriodevelger = ({
    spørsmålName,
    periodeName,
    spørsmål,
    periodeSpørsmål,
}: Props) => {
    const { control, resetField } = useFormContext<Papirsøknad>();

    const jaNeiSpørsmål = useController({
        name: spørsmålName,
        control,
        defaultValue: undefined,
    });

    return (
        <div className={jaNeiSpørsmål.field.value ? styles.blokkUtvidet : ''}>
            <JaNeiSpørsmål
                name={spørsmålName}
                legend={spørsmål}
                onChange={(newValue) => {
                    if (!newValue) {
                        resetField(periodeName);
                    }
                }}
            />
            {jaNeiSpørsmål.field.value && (
                <Periodevelger
                    name={periodeName}
                    tittel={periodeSpørsmål}
                    rules={{
                        fraOgMed: { required: 'Fra og med er påkrevd' },
                        tilOgMed: { required: 'Til og med er påkrevd' },
                    }}
                />
            )}
        </div>
    );
};
