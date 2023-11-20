import { RadioGroup, Radio, Select, Button, VStack, HStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import PeriodeSkjema from "./PeriodeSkjema";
import dayjs from "dayjs";

interface RedigeringSkjemaProps {
    vilkår: string;
    håndterLukkRedigering: () => void;
    behandlingId: string;
    behandlingsperiode: {
        fom: string;
        tom: string;
    };
    vilkårsperiode: {
        fom: string;
        tom: string;
    };
}

interface SkjemaFelter {
    periode: {
        fom: Date;
        tom: Date;
    }
    harYtelse: string;
    begrunnelse: string;
}

export function påkrevdPeriodeValidator(periode: {
    fom: Date;
    tom: Date;
}) {
    if (!periode?.fom || !periode?.tom) {
        return "Fra og til må fylles ut";
    }
}

export function gyldigPeriodeValidator(periode: {
    fom: Date;
    tom: Date;
}) {
    const fraDato = dayjs(periode?.fom);
    const tilDato = dayjs(periode?.tom);

    if (fraDato.isAfter(tilDato)) {
        return 'Fra-dato kan ikke være etter til-dato';
    }
}

export const RedigeringSkjema = ({ håndterLukkRedigering, vilkår, vilkårsperiode, behandlingId, behandlingsperiode }: RedigeringSkjemaProps) => {
    const formMethods = useForm<SkjemaFelter>({
        mode: 'onSubmit',
        defaultValues: {
            periode: {
                fom: new Date(vilkårsperiode.fom),
                tom: new Date(vilkårsperiode.tom)
            }
        }
    })

    const [begrunnelse, setBegrunnelse] = useState<string>('');

    const mutator = useSWRConfig().mutate;

    const håndterLagreSaksopplysning = () => {
        håndterLukkRedigering();
        const skjemaFelter = formMethods.getValues()
        const res = fetch(`/api/behandling/${behandlingId}`, {
            method: 'POST',
            body: JSON.stringify({
                fom: skjemaFelter.periode?.fom.toISOString().split('T')[0],
                tom: skjemaFelter.periode?.tom.toISOString().split('T')[0],
                vilkår: vilkår,
                begrunnelse: skjemaFelter.begrunnelse,
                harYtelse: skjemaFelter.harYtelse === "ja" ? true : skjemaFelter.harYtelse === "nei" ? false : null
            }),
        }).then(() => {
            mutator(`/api/behandling/${behandlingId}`).then(() => {
                toast('Saksopplysning endret');
            });
        });
    };

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(håndterLagreSaksopplysning, (errors) => console.log(errors))}
                style={{
                    background: '#F2F3F5',
                    width: '100%',
                    height: '100%',
                    padding: '1rem',
                }}
            >
                <VStack gap="5">
                    <Controller
                        name={"harYtelse"}
                        control={formMethods.control}
                        rules={{ required: true }}
                        render={({ field: { onChange }, formState: {errors} }) => {
                            return (
                                <RadioGroup
                                    legend="Endre vilkår"
                                    onChange={(value) => onChange(value)}
                                    error={errors.harYtelse && "Vilkår mangler"}
                                >
                                    <Radio value={"nei"}>Mottar ikke</Radio>
                                    <Radio value={"ja"}>Mottar</Radio>
                                </RadioGroup>
                            )
                        }}
                    />
                    <PeriodeSkjema
                        name="periode"
                        validate={[
                            gyldigPeriodeValidator,
                            påkrevdPeriodeValidator
                        ]}
                        minDate={new Date(behandlingsperiode.fom)}
                        maxDate={new Date(behandlingsperiode.tom)}
                        defaultFra={new Date(vilkårsperiode.fom)}
                        defaultTil={new Date(vilkårsperiode.tom)}
                    />
                    <Controller
                        name={"begrunnelse"}
                        control={formMethods.control}
                        rules={{ required: true }}
                        render={({ field: { onChange }, formState: {errors} }) => {
                            return (
                                <Select
                                    label="Begrunnelse for endring"
                                    style={{ width: '415px' }}
                                    onChange={(e) => onChange(e.target.value)}
                                    error={errors.begrunnelse && "Begrunnelse mangler"}
                                >
                                    <option value="">Velg grunn</option>
                                    <option value="Feil i innhentet data">Feil i innhentet data</option>
                                    <option value="Endring etter søknadstidspunkt">Endring etter søknadstidspunkt</option>
                                </Select>
                            )
                        }}
                    />
                    <HStack>
                        <Button
                            type="button"
                            onClick={() => håndterLukkRedigering()}
                            variant="tertiary"
                            style={{ marginRight: '2rem' }}
                        >
                            Avbryt
                        </Button>
                        <Button type="submit">Lagre endring</Button>
                    </HStack>
                </VStack>
            </form>
        </FormProvider>
    );
};
