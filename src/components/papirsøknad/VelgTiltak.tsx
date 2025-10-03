import React from 'react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import { JaNeiSpørsmål } from '~/components/papirsøknad/JaNeiSpørsmål';
import { Søknad, Tiltak } from '~/components/papirsøknad/papirsøknadTypes';
import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import styles from './Spørsmål.module.css';
import { classNames } from '~/utils/classNames';
import { formaterDatotekst } from '~/utils/date';

type Props = {
    spørsmålName: FieldPath<Søknad>;
    legend: string;
};

export const VelgTiltak = ({ spørsmålName, legend }: Props) => {
    const { control, setValue } = useFormContext<Søknad>();
    const [muligeTiltak, setMuligeTiltak] = React.useState<Tiltak[]>([]);

    const spørsmål = useController({
        name: spørsmålName,
        control,
        defaultValue: undefined,
    });

    return (
        <div className={classNames(styles.informasjonsInnhentingBlokk, styles.blokk)}>
            <JaNeiSpørsmål name="svar.harTiltak" legend={legend} />
            {spørsmål.field.value && (
                <div className={styles.blokk}>
                    <Button
                        className={styles.finnTiltakButton}
                        size="small"
                        onClick={() =>
                            setMuligeTiltak([
                                {
                                    aktivitetId: '1',
                                    navn: 'Gruppe Amo',
                                    periode: { fraOgMed: '2025-10-03', tilOgMed: '2025-10-17' },
                                },
                                {
                                    aktivitetId: '2',
                                    navn: 'Arbeidstrening',
                                    periode: { fraOgMed: '2025-10-10', tilOgMed: '2025-10-25' },
                                },
                                {
                                    aktivitetId: '3',
                                    navn: 'Godliaresearch',
                                    periode: { fraOgMed: '2025-10-03', tilOgMed: '2025-10-17' },
                                },
                            ])
                        }
                    >
                        Finn tiltak
                    </Button>
                    {muligeTiltak.length > 0 && (
                        <RadioGroup
                            legend="Velg tiltak"
                            onChange={(value) => setValue('svar.tiltak', value)}
                        >
                            {muligeTiltak.map((tiltak) => (
                                <Radio key={tiltak.aktivitetId} value={tiltak.aktivitetId}>
                                    {tiltak.navn}{' '}
                                    {tiltak.periode &&
                                        `(${formaterDatotekst(tiltak.periode.fraOgMed)} - ${formaterDatotekst(tiltak.periode.tilOgMed)})`}
                                </Radio>
                            ))}
                        </RadioGroup>
                    )}
                </div>
            )}
        </div>
    );
};
