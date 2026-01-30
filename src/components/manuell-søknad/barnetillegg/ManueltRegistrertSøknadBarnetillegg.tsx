import React from 'react';
import styles from '../Spørsmål.module.css';
import { FieldPath, useController, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { classNames } from '~/utils/classNames';
import type {
    Barn,
    ManueltRegistrertSøknad,
} from '~/components/manuell-søknad/ManueltRegistrertSøknad';
import { LeggTilBarnManuelt } from '~/components/manuell-søknad/barnetillegg/LeggTilBarnManuelt';
import { JaNeiSpørsmål } from '~/components/manuell-søknad/JaNeiSpørsmål';
import { useHentPersonopplysningerBarn } from '~/components/manuell-søknad/barnetillegg/useHentPersonopplysningerBarn';
import { v4 as uuidv4 } from 'uuid';
import { SakId } from '~/types/Sak';
import { InformasjonOmBarnPDL } from '~/components/manuell-søknad/barnetillegg/InformasjonOmBarnPDL';
import { InformasjonOmBarnManuell } from '~/components/manuell-søknad/barnetillegg/InformasjonOmBarnManuell';
import { TrashIcon } from '@navikt/aksel-icons';
import { Periode } from '~/types/Periode';

type Props = {
    sakId: SakId;
    name: FieldPath<ManueltRegistrertSøknad>;
    legend: string;
    tittel?: string;
};

export const ManueltRegistrertSøknadBarnetillegg = ({ sakId, name, legend }: Props) => {
    const { control, setValue } = useFormContext<ManueltRegistrertSøknad>();
    const [skalHenteBarn, setSkalHenteBarn] = React.useState(false);

    const barnFraFolkeregisteret = useFieldArray<ManueltRegistrertSøknad>({
        control,
        name: 'svar.barnetilleggPdl',
    });

    const barnetilleggPdlWatch = useWatch({
        control,
        name: 'svar.barnetilleggPdl',
    });

    const manuelleBarn = useFieldArray<ManueltRegistrertSøknad>({
        control,
        name: 'svar.barnetilleggManuelle',
    });

    const periode = useController<ManueltRegistrertSøknad>({
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
                    erSøktBarnetilleggFor: undefined,
                    fnr: p.fnr,
                    uuid: uuidv4(),
                    index,
                }),
            );
            setValue('svar.barnetilleggPdl', barn);
        }
    }, [skalHenteBarn, barnFraAPI, setValue]);

    const { fraOgMed, tilOgMed } = periode.field.value as Periode;
    const søknadsperiodeErTom = fraOgMed.length === 0 && tilOgMed.length === 0;

    return (
        <div className={harSøktOmBarnetillegg.field.value === 'JA' ? styles.blokkUtvidet : ''}>
            <JaNeiSpørsmål name={name} legend={legend} />
            {harSøktOmBarnetillegg.field.value === 'JA' && (
                <div className={styles.blokk}>
                    {søknadsperiodeErTom && (
                        <Alert variant="warning">
                            Vi kan ikke hente informasjon om barn fra folkeregisteret uten at
                            søknadsperioden er satt.
                        </Alert>
                    )}
                    <Button
                        className={styles.finnTiltakButton}
                        type="button"
                        size="small"
                        onClick={() => {
                            setSkalHenteBarn(true);
                        }}
                        loading={isLoading}
                        disabled={søknadsperiodeErTom}
                    >
                        Legg til barn fra folkeregisteret
                    </Button>

                    {barnFraFolkeregisteret.fields.length > 0 && (
                        <Button
                            type="button"
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
                                <div key={`barn-${uuidv4()}`}>
                                    <InformasjonOmBarnPDL
                                        barn={barn}
                                        søknadsperiode={periode.field.value as Periode}
                                    />
                                    <JaNeiSpørsmål
                                        name={`svar.barnetilleggPdl.${index}.erSøktBarnetilleggFor.svar`}
                                        legend="Er søkt om barnetillegg for?"
                                        måVæreBesvart
                                    />
                                    {barnetilleggPdlWatch?.[index]?.erSøktBarnetilleggFor?.svar ===
                                        'JA' && (
                                        <JaNeiSpørsmål
                                            name={`svar.barnetilleggPdl.${index}.oppholdInnenforEøs.svar`}
                                            legend="Oppholder seg i EØS-land i tiltaksperioden"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {manuelleBarn.fields.length > 0 && (
                        <div className={styles.blokk}>
                            <Heading size="medium" level="3" spacing>
                                Barn lagt til manuelt
                            </Heading>
                            <VStack gap="space-16">
                                {manuelleBarn.fields.map((barn: Barn, index: number) => (
                                    <HStack key={barn.uuid} gap="space-16" justify="space-between">
                                        <InformasjonOmBarnManuell
                                            barn={barn}
                                            søknadsperiode={periode.field.value as Periode}
                                        />
                                        <Button
                                            type="button"
                                            icon={<TrashIcon />}
                                            variant="tertiary"
                                            onClick={() => manuelleBarn.remove(index)}
                                        >
                                            Slett
                                        </Button>
                                    </HStack>
                                ))}
                            </VStack>
                        </div>
                    )}
                    <LeggTilBarnManuelt onAppend={(barn) => manuelleBarn.append(barn)} />
                </div>
            )}
        </div>
    );
};
