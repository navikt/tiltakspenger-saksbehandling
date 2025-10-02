import React from 'react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import type { Søknad } from '~/components/papirsøknad/papirsøknadTypes';
import { Spørsmål } from './Spørsmål';
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
    const { control } = useFormContext<Søknad>();

    const spørsmålController = useController({
        name: spørsmålName,
        control,
        defaultValue: undefined,
    });

    return (
        <div className={spørsmålController.field.value ? styles.blokkUtvidet : ''}>
            <Spørsmål name={spørsmålName} legend={spørsmål} />
            {spørsmålController.field.value && (
                <Periodevelger name={periodeName} tittel={periodeSpørsmål} />
            )}
        </div>
    );
};
