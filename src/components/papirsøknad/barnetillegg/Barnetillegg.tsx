import React from 'react';
import styles from '../Spørsmål.module.css';
import { FieldPath, useController, useFieldArray, useFormContext } from 'react-hook-form';
import { Alert, Button, Heading, HStack, Tag, VStack } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { formaterDatotekst } from '~/utils/date';
import { classNames } from '~/utils/classNames';
import type { Barn, Søknad } from '~/components/papirsøknad/papirsøknadTypes';
import { LeggTilBarnManuelt } from '~/components/papirsøknad/barnetillegg/LeggTilBarnManuelt';
import { JaNeiSpørsmål } from '~/components/papirsøknad/JaNeiSpørsmål';
import { useHentPersonopplysningerBarn } from '~/components/papirsøknad/barnetillegg/useHentPersonopplysningerBarn';
import { SakId } from '~/types/SakTypes';
import { Personopplysninger } from '~/components/personaliaheader/useHentPersonopplysninger';
import { v4 as uuidv4 } from 'uuid';

type Props = {
    sakId: SakId;
    name: FieldPath<Søknad>;
    legend: string;
    tittel?: string;
};

export const Barnetillegg = ({ sakId, name, legend }: Props) => {
    const { control } = useFormContext<Søknad>();

    const barnFraFolkeregisteret = useFieldArray<Søknad>({
        control,
        name: 'svar.barnetillegg.barnFraFolkeregisteret',
    });

    const manuelleBarn = useFieldArray<Søknad>({
        control,
        name: 'svar.barnetillegg.manueltRegistrerteBarn',
    });

    const periode = useController<Søknad>({
        control,
        name: 'manueltSattSøknadsperiode',
    });

    const [skalHenteBarn, setSkalHenteBarn] = React.useState(false);

    const {
        data: barnFraAPI,
        isLoading,
        error,
    } = useHentPersonopplysningerBarn(sakId, skalHenteBarn);

    React.useEffect(() => {
        if (skalHenteBarn && barnFraAPI) {
            const barn: Barn[] = barnFraAPI.map(
                (p, index): Barn => ({
                    fornavn: p.fornavn,
                    mellomnavn: p.mellomnavn || undefined,
                    etternavn: p.etternavn,
                    fødselsdato: p.fødselsdato,
                    uuid: p.fnr,
                    index,
                }),
            );
            if (
                !barn.every((b) =>
                    barnFraFolkeregisteret.fields.flatMap((bff) => bff.uuid).includes(b.uuid),
                )
            ) {
                barnFraFolkeregisteret.replace(barn);
            }
        }
    }, [skalHenteBarn, barnFraAPI, barnFraFolkeregisteret]);

    const harSøktOmBarnetillegg = useController({
        name: name,
        control,
        defaultValue: undefined,
    });

    const getTekstForJaNeiSpørsmål = (value: boolean | undefined) => {
        if (value === null || value === undefined) return 'Ikke besvart';
        return value ? 'Ja' : 'Nei';
    };

    const getBarnHeader = (barn: Barn | Personopplysninger, adressebeskyttet: boolean) => {
        if (!adressebeskyttet) {
            return `${barn.fornavn} ${barn.etternavn} - født ${formaterDatotekst(barn.fødselsdato)}`;
        } else {
            return `Barn med adressebeskyttelse - Født ${formaterDatotekst(barn.fødselsdato)}`;
        }
    };

    return (
        <div className={harSøktOmBarnetillegg.field.value ? styles.blokkUtvidet : ''}>
            <JaNeiSpørsmål name={name} legend={legend} />

            {harSøktOmBarnetillegg.field.value && (
                <div className={styles.blokk}>
                    {!periode.field.value && (
                        <Alert variant="warning">
                            Vi kan ikke hente informasjon om barn fra folkeregisteret uten å at
                            søknadsperioden er satt.
                        </Alert>
                    )}
                    <Button
                        className={styles.finnTiltakButton}
                        size="small"
                        onClick={() => {
                            setSkalHenteBarn(true);
                        }}
                        loading={isLoading}
                        disabled={!periode.field.value}
                    >
                        Legg til barn fra folkeregisteret
                    </Button>

                    {barnFraFolkeregisteret.fields.length > 0 && (
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                                barnFraFolkeregisteret.remove();
                                setSkalHenteBarn(false);
                            }}
                        >
                            Nullstill
                        </Button>
                    )}

                    {error && skalHenteBarn && <div>Kunne ikke hente barn fra folkeregisteret</div>}

                    {(barnFraAPI?.length ?? 0) > 0 && (
                        <div
                            className={classNames(styles.blokk, styles.informasjonsInnhentingBlokk)}
                        >
                            <Heading size="medium" level="3" spacing>
                                Barn fra Folkeregisteret
                            </Heading>
                            {barnFraAPI?.map((barn, index) => (
                                <div key={`barn-${index}-${uuidv4()}`}>
                                    <HStack gap="2">
                                        <Heading size="small" level="4">
                                            {getBarnHeader(
                                                barn,
                                                barn.fortrolig || barn.strengtFortrolig,
                                            )}
                                        </Heading>
                                        {barn.strengtFortrolig && (
                                            <Tag variant="error">Strengt fortrolig adresse</Tag>
                                        )}
                                        {barn.fortrolig && (
                                            <Tag variant="error">Fortrolig adresse</Tag>
                                        )}
                                        {barn.skjerming && <Tag variant="error">Skjermet</Tag>}
                                        {barn.dødsdato && (
                                            <Tag variant="neutral">
                                                Død {formaterDatotekst(barn.dødsdato)}
                                            </Tag>
                                        )}
                                    </HStack>
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
                                        <Heading size="small" level="4">
                                            {getBarnHeader(barn, false)}
                                        </Heading>
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
