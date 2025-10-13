import React from 'react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import type { Søknad } from '~/components/papirsøknad/papirsøknadTypes';
import { JaNeiSpørsmål } from './JaNeiSpørsmål';
import { Periodevelger } from './Periodevelger';

import styles from './Spørsmål.module.css';

type Props = {
    spørsmålName: FieldPath<Søknad>;
    periodeName: FieldPath<Søknad>;
    spørsmål: string;
    periodeSpørsmål?: string;
};

export const SpørsmålMedPeriodevelger = ({
    spørsmålName,
    periodeName,
    spørsmål,
    periodeSpørsmål,
}: Props) => {
    const { control, resetField } = useFormContext<Søknad>();

    const controller = useController({
        name: spørsmålName,
        control,
        defaultValue: undefined,
    });

    return (
        <div className={controller.field.value ? styles.blokkUtvidet : ''}>
            <JaNeiSpørsmål
                name={spørsmålName}
                legend={spørsmål}
                onChange={() => {
                    if (!controller.field.value) {
                        resetField(periodeName);
                    }
                }}
            />
            {controller.field.value && (
                <Periodevelger name={periodeName} tittel={periodeSpørsmål} />
            )}
        </div>
    );
};
