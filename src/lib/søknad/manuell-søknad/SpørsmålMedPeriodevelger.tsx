import { FieldPath, useController, useFormContext } from 'react-hook-form';
import type { ManueltRegistrertSøknad } from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import { JaNeiSpørsmål } from './JaNeiSpørsmål';
import { Periodevelger, ManuellSøknadPeriodeFelt } from './Periodevelger';

import styles from './SpørsmålMedPeriodeVelger.module.css';

type Props = {
    spørsmålFelt: FieldPath<ManueltRegistrertSøknad>;
    periodeFelt: ManuellSøknadPeriodeFelt;
    spørsmål: string;
    periodeSpørsmål?: string;
};

export const SpørsmålMedPeriodevelger = ({
    spørsmålFelt,
    periodeFelt,
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
                        resetField(periodeFelt);
                    }
                }}
            />
            {jaNeiSpørsmål.field.value === 'JA' && (
                <Periodevelger periodeFelt={periodeFelt} tittel={periodeSpørsmål} />
            )}
        </div>
    );
};
