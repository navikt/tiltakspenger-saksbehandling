import React from 'react';
import styles from './Spørsmål.module.css';
import { FieldPath, useController, useFieldArray, useFormContext } from 'react-hook-form';
import { Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { formaterDatotekst } from '~/utils/date';
import { classNames } from '~/utils/classNames';
import type { Barn, Søknad } from '~/components/papirsøknad/papirsøknadTypes';
import { LeggTilBarnManuelt } from '~/components/papirsøknad/LeggTilBarnManuelt';
import { JaNeiSpørsmål } from './JaNeiSpørsmål';

type Props = {
    name: FieldPath<Søknad>;
    legend: string;
    tittel?: string;
};

export const Barnetillegg = ({ name, legend }: Props) => {
    const { control } = useFormContext<Søknad>();

    const barnFraFolkeregisteret = useFieldArray<Søknad>({
        control,
        name: 'svar.barnetillegg.barnFraFolkeregisteret',
    });

    const manuelleBarn = useFieldArray<Søknad>({
        control,
        name: 'svar.barnetillegg.manueltRegistrerteBarn',
    });

    const hardkodaPdlBarn: Barn[] = [
        {
            uuid: '1',
            fornavn: 'Ezekiel',
            etternavn: 'Ruud',
            fødselsdato: '2010-05-20',
            oppholdInnenforEøs: undefined,
        },
        {
            uuid: '2',
            fornavn: 'Bartholomeus',
            etternavn: 'Ruud',
            fødselsdato: '2012-08-15',
            oppholdInnenforEøs: undefined,
        },
    ];

    const harSøktOmBarnetillegg = useController({
        name: name,
        control,
        defaultValue: undefined,
    });

    const getTekstForJaNeiSpørsmål = (value: boolean | undefined) => {
        if (value === null || value === undefined) return 'Ikke besvart';
        return value ? 'Ja' : 'Nei';
    };

    return (
        <div className={harSøktOmBarnetillegg.field.value ? styles.blokkUtvidet : ''}>
            <JaNeiSpørsmål name={name} legend={legend} />

            {harSøktOmBarnetillegg.field.value && (
                <div className={styles.blokk}>
                    <Button
                        className={styles.finnTiltakButton}
                        size="small"
                        onClick={() => barnFraFolkeregisteret.replace(hardkodaPdlBarn)}
                    >
                        Hent barn fra folkeregisteret
                    </Button>

                    {barnFraFolkeregisteret.fields.length > 0 && (
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                                barnFraFolkeregisteret.remove();
                            }}
                        >
                            Nullstill
                        </Button>
                    )}

                    {barnFraFolkeregisteret.fields.length > 0 && (
                        <div
                            className={classNames(styles.blokk, styles.informasjonsInnhentingBlokk)}
                        >
                            <Heading size="medium" level="3" spacing>
                                Barn fra Folkeregisteret
                            </Heading>
                            {barnFraFolkeregisteret.fields.map((barn, index) => (
                                <div key={barn.id ?? barn.uuid}>
                                    <Heading size="small" level="4">
                                        {`${barn.fornavn} ${barn.etternavn} - født ${formaterDatotekst(
                                            barn.fødselsdato,
                                        )}`}
                                    </Heading>
                                    <JaNeiSpørsmål
                                        name={`svar.barnetillegg.barnFraFolkeregisteret.${index}.oppholdInnenforEøs`}
                                        legend={` Oppholder seg i EØS-land i tiltaksperioden`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {manuelleBarn.fields.length > 0 && (
                        <div className={styles.blokk}>
                            <Heading size="medium" level="3" spacing>
                                Barn lagt til manuelt
                            </Heading>
                            {manuelleBarn.fields.map((barn: Barn, index: number) => (
                                <HStack key={barn.uuid} gap="4" justify="space-between">
                                    <VStack>
                                        <Heading
                                            size="small"
                                            level="4"
                                        >{`${barn.fornavn} ${barn.etternavn} - født ${formaterDatotekst(
                                            barn.fødselsdato,
                                        )}`}</Heading>
                                        <div>
                                            Oppholder seg i EØS-land i tiltaksperioden:{' '}
                                            {getTekstForJaNeiSpørsmål(barn.oppholdInnenforEøs)}
                                            <br />
                                            Det er vedlagt dokumentasjon for barnet:{' '}
                                            {getTekstForJaNeiSpørsmål(
                                                barn.manueltRegistrertBarnHarVedlegg,
                                            )}
                                        </div>
                                    </VStack>
                                    <Button
                                        icon={<TrashIcon />}
                                        variant="tertiary"
                                        onClick={() => manuelleBarn.remove(index)}
                                    >
                                        Slett
                                    </Button>
                                </HStack>
                            ))}
                        </div>
                    )}
                    <LeggTilBarnManuelt onAppend={(barn) => manuelleBarn.append(barn)} />
                </div>
            )}
        </div>
    );
};
