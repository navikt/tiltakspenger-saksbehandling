import React from 'react';
import { Controller, FieldPath, useController, useFormContext } from 'react-hook-form';
import type { Barn, Søknad } from '~/components/papirsøknad/papirsøknadTypes';
import { JaNeiSpørsmål } from './JaNeiSpørsmål';

import styles from './Spørsmål.module.css';
import { Button, Heading, TextField } from '@navikt/ds-react';
import { Datovelger } from '~/components/datovelger/Datovelger';
import { formaterDatotekst } from '~/utils/date';
import { classNames } from '~/utils/classNames';
import { PlusIcon } from '@navikt/aksel-icons';

type Props = {
    name: FieldPath<Søknad>;
    legend: string;
    tittel?: string;
};

export const Barnetillegg = ({ name, legend }: Props) => {
    const { control, getValues, setValue } = useFormContext<Søknad>();
    const [pdlBarn, setPdlBarn] = React.useState<Barn[]>([]);
    const [manuelleBarn, setManuelleBarn] = React.useState<Barn[]>([]);
    const [visLeggTilBarnFelter, setVisLeggTilBarnFelt] = React.useState(false);

    const spørsmål = useController({
        name: name,
        control,
        defaultValue: undefined,
    });

    return (
        <div className={spørsmål.field.value ? styles.blokkUtvidet : ''}>
            <JaNeiSpørsmål name={name} legend={legend} />

            {spørsmål.field.value && (
                <div className={styles.blokk}>
                    <Button
                        className={styles.finnTiltakButton}
                        size="small"
                        onClick={() =>
                            setPdlBarn([
                                {
                                    uuid: '1',
                                    fornavn: 'Ezekiel',
                                    etternavn: 'Ruud',
                                    fødselsdato: '2010-05-20',
                                    oppholdInnenforEøs: false,
                                },
                                {
                                    uuid: '2',
                                    fornavn: 'Bartholomeus',
                                    etternavn: 'Ruud',
                                    fødselsdato: '2012-08-15',
                                    oppholdInnenforEøs: true,
                                },
                            ])
                        }
                    >
                        Hent barn fra folkeregisteret
                    </Button>
                    {pdlBarn.length > 0 && (
                        <div
                            className={classNames(styles.blokk, styles.informasjonsInnhentingBlokk)}
                        >
                            <Heading size="medium" level="3" spacing>
                                Barn fra Folkeregisteret
                            </Heading>
                            {pdlBarn.map((barn) => (
                                <>
                                    <Heading
                                        size="small"
                                        level="4"
                                    >{`${barn.fornavn} ${barn.etternavn} - født ${formaterDatotekst(barn.fødselsdato)}`}</Heading>
                                    <div key={barn.uuid}>
                                        <JaNeiSpørsmål
                                            name={`svar.barnetillegg.eøsOppholdForBarnFraAPI.${barn.uuid}`}
                                            legend={` Oppholder seg i EØS-land i tiltaksperioden`}
                                            afterOnChange={() => {
                                                setPdlBarn((prev) =>
                                                    prev.map((b) =>
                                                        b.uuid === barn.uuid
                                                            ? {
                                                                  ...b,
                                                                  oppholdInnenforEøs:
                                                                      !b.oppholdInnenforEøs,
                                                              }
                                                            : b,
                                                    ),
                                                );
                                            }}
                                        />
                                    </div>
                                </>
                            ))}
                        </div>
                    )}

                    {manuelleBarn.length > 0 && (
                        <div className={classNames(styles.blokk)}>
                            <Heading size="medium" level="3" spacing>
                                Barn lagt til manuelt
                            </Heading>
                            {manuelleBarn.map((barn) => (
                                <>
                                    <Heading
                                        size="small"
                                        level="4"
                                    >{`${barn.fornavn} ${barn.etternavn} - født ${formaterDatotekst(barn.fødselsdato)}`}</Heading>
                                    <div key={barn.uuid}>
                                        <JaNeiSpørsmål
                                            name={`svar.barnetillegg.eøsOppholdForBarnFraAPI.${barn.uuid}`}
                                            legend={` Oppholder seg i EØS-land i tiltaksperioden`}
                                            afterOnChange={() => {
                                                setPdlBarn((prev) =>
                                                    prev.map((b) =>
                                                        b.uuid === barn.uuid
                                                            ? {
                                                                  ...b,
                                                                  oppholdInnenforEøs:
                                                                      !b.oppholdInnenforEøs,
                                                              }
                                                            : b,
                                                    ),
                                                );
                                            }}
                                        />
                                    </div>
                                </>
                            ))}
                        </div>
                    )}
                    <Button
                        onClick={() => setVisLeggTilBarnFelt(true)}
                        className={styles.leggTilBarnButton}
                        variant="secondary"
                        type="button"
                        icon={<PlusIcon aria-hidden />}
                        hidden={visLeggTilBarnFelter}
                    >
                        Legg til barn
                    </Button>

                    {visLeggTilBarnFelter && (
                        <div className={styles.blokk}>
                            <Heading size="small" level="4" spacing>
                                Legg til barn manuelt
                            </Heading>
                            <Controller
                                name={`svar.barnetillegg.kladd`}
                                render={({ field }) => {
                                    const value = field.value ?? {
                                        fornavn: '',
                                        etternavn: '',
                                        fødselsdato: '',
                                        oppholdInnenforEøs: false,
                                        uuid: '',
                                    };
                                    return (
                                        <div>
                                            <TextField
                                                label="Fornavn"
                                                value={value.fornavn ?? ''}
                                                onChange={(e) =>
                                                    field.onChange({
                                                        ...value,
                                                        fornavn: e.target.value,
                                                    })
                                                }
                                            />
                                            <TextField
                                                label="Etternavn"
                                                value={value.etternavn ?? ''}
                                                onChange={(e) =>
                                                    field.onChange({
                                                        ...value,
                                                        etternavn: e.target.value,
                                                    })
                                                }
                                            />
                                            <Datovelger
                                                label="Fødselsdato"
                                                selected={value.fødselsdato || undefined}
                                                onDateChange={(date) =>
                                                    field.onChange({
                                                        ...value,
                                                        fødselsdato: date
                                                            ? typeof date === 'string'
                                                                ? date
                                                                : date.toISOString().split('T')[0]
                                                            : '',
                                                    })
                                                }
                                            />
                                            <JaNeiSpørsmål
                                                name="svar.barnetillegg.kladd.oppholdInnenforEøs"
                                                legend="Oppholder seg i EØS-land"
                                            />
                                        </div>
                                    );
                                }}
                            />

                            <Button
                                onClick={() => setVisLeggTilBarnFelt(false)}
                                className={styles.leggTilBarnButton}
                                variant="secondary"
                                type="button"
                            >
                                Avbryt
                            </Button>

                            <Button
                                onClick={() => {
                                    const kladd = getValues('svar.barnetillegg.kladd') as
                                        | Barn
                                        | undefined;
                                    if (!kladd) {
                                        setVisLeggTilBarnFelt(false);
                                        return;
                                    }
                                    const newBarn: Barn = {
                                        fornavn: kladd.fornavn ?? '',
                                        etternavn: kladd.etternavn ?? '',
                                        fødselsdato: kladd.fødselsdato ?? '',
                                        oppholdInnenforEøs: kladd.oppholdInnenforEøs ?? false,
                                        uuid: kladd.uuid || `${Date.now()}`,
                                    };
                                    setManuelleBarn((prev) => [...prev, newBarn]);
                                    setValue('svar.barnetillegg.kladd', {
                                        fornavn: '',
                                        etternavn: '',
                                        fødselsdato: '',
                                        oppholdInnenforEøs: false,
                                        uuid: '',
                                    });
                                    setVisLeggTilBarnFelt(false);
                                }}
                                variant="primary"
                                type="button"
                            >
                                Legg til barn
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
