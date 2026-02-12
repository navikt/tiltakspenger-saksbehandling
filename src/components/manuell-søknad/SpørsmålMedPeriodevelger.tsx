import React from 'react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import type { ManueltRegistrertSøknad } from '~/components/manuell-søknad/ManueltRegistrertSøknad';
import { JaNeiSpørsmål } from './JaNeiSpørsmål';
import { Periodevelger } from './Periodevelger';

import styles from './SpørsmålMedPeriodeVelger.module.css';

type Props = {
    spørsmålFelt: FieldPath<ManueltRegistrertSøknad>;
    fraOgMedFelt: FieldPath<ManueltRegistrertSøknad>;
    tilOgMedFelt: FieldPath<ManueltRegistrertSøknad>;
    spørsmål: string;
    periodeSpørsmål?: string;
};

export const SpørsmålMedPeriodevelger = ({
    spørsmålFelt,
    fraOgMedFelt,
    tilOgMedFelt,
    spørsmål,
    periodeSpørsmål,
}: Props) => {
    const { control, resetField } = useFormContext<ManueltRegistrertSøknad>();

    const jaNeiSpørsmål = useController({
        name: spørsmålFelt,
        control,
        defaultValue: undefined,
    });

    return (
        <div className={jaNeiSpørsmål.field.value === 'JA' ? styles.blokkUtvidet : ''}>
            <JaNeiSpørsmål
                name={spørsmålFelt}
                legend={spørsmål}
                onChange={(newValue) => {
                    if (newValue !== 'JA') {
                        resetField(fraOgMedFelt);
                        resetField(tilOgMedFelt);
                    }
                }}
            />
            {jaNeiSpørsmål.field.value === 'JA' && (
                <Periodevelger
                    fraOgMedFelt={fraOgMedFelt}
                    tilOgMedFelt={tilOgMedFelt}
                    tittel={periodeSpørsmål}
                />
            )}
        </div>
    );
};
