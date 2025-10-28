import React from 'react';
import styles from '../Spørsmål.module.css';
import { FieldPath, useController, useFieldArray, useFormContext } from 'react-hook-form';
import { Alert, Button, Heading, HStack } from '@navikt/ds-react';
import { classNames } from '~/utils/classNames';
import type { Barn, Papirsøknad } from '~/components/papirsøknad/papirsøknadTypes';
import { LeggTilBarnManuelt } from '~/components/papirsøknad/barnetillegg/LeggTilBarnManuelt';
import { JaNeiSpørsmål } from '~/components/papirsøknad/JaNeiSpørsmål';
import { useHentPersonopplysningerBarn } from '~/components/papirsøknad/barnetillegg/useHentPersonopplysningerBarn';
import { v4 as uuidv4 } from 'uuid';
import { SakId } from '~/types/Sak';
import { InformasjonOmBarnPDL } from '~/components/papirsøknad/barnetillegg/InformasjonOmBarnPDL';
import { InformasjonOmBarnManuell } from '~/components/papirsøknad/barnetillegg/InformasjonOmBarnManuell';
import { TrashIcon } from '@navikt/aksel-icons';

type Props = {
    sakId: SakId;
    name: FieldPath<Papirsøknad>;
    legend: string;
    tittel?: string;
};

export const Barnetillegg = ({ sakId, name, legend }: Props) => {
    const { control, setValue } = useFormContext<Papirsøknad>();
    const [skalHenteBarn, setSkalHenteBarn] = React.useState(false);

    const barnFraFolkeregisteret = useFieldArray<Papirsøknad>({
        control,
        name: 'svar.barnetilleggPdl',
    });

    const manuelleBarn = useFieldArray<Papirsøknad>({
        control,
        name: 'svar.barnetilleggManuelle',
    });

    const periode = useController<Papirsøknad>({
        control,
        name: 'manueltSattSøknadsperiode',
    });

    const harSøktOmBarnetillegg = useController({
        name: name,
        control,
        defaultValue: undefined,
    });

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
                    uuid: uuidv4(),
                    index,
                }),
            );
            setValue('svar.barnetilleggPdl', barn);
        }
    }, [skalHenteBarn, barnFraAPI, setValue]);

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

                    {error && skalHenteBarn && (
                        <Alert variant="error">Kunne ikke hente barn fra folkeregisteret</Alert>
                    )}

                    {(barnFraAPI?.length ?? 0) > 0 && (
                        <div
                            className={classNames(styles.blokk, styles.informasjonsInnhentingBlokk)}
                        >
                            <Heading size="medium" level="3" spacing>
                                Barn fra Folkeregisteret
                            </Heading>
                            {barnFraAPI?.map((barn, index) => (
                                <>
                                    <InformasjonOmBarnPDL key={`barn-${uuidv4()}`} barn={barn} />
                                    <JaNeiSpørsmål
                                        name={`svar.barnetilleggPdl.${index}.oppholdInnenforEøs`}
                                        legend={` Oppholder seg i EØS-land i tiltaksperioden`}
                                    />
                                </>
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
                                    <InformasjonOmBarnManuell barn={barn} />
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
