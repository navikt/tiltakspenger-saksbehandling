import { Alert, Button, Heading, Loader, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { SaksbehandlerContext } from '../../pages/_app';
import StegHeader from './StegHeader';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { useHentLivsopphold } from '../../hooks/useHentLivsopphold';
import { useSWRConfig } from 'swr';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

export interface SkjemaFelter {
    valgtVerdi: boolean;
}

export const AndreYtelserMinimalistisk = () => {
    const router = useRouter();
    const behandlingId = router.query.behandlingId as string;
    const { livsopphold, isLoading } = useHentLivsopphold(behandlingId);
    const mutator = useSWRConfig().mutate;

    const {
        handleSubmit,
        control,
        formState: { errors },
        watch,
        resetField,
    } = useForm<SkjemaFelter>({
        mode: 'onSubmit',
        defaultValues: {
            valgtVerdi: undefined,
        },
    });

    const watchHarLivsoppholdytelser = watch('valgtVerdi');

    const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

    if (isLoading || !livsopphold) {
        return <Loader />;
    }

    const håndterLagreLivsoppholdSaksopplysning = (harYtelser: boolean) => {
        if (harYtelser) {
            return
        }

        fetch(`/api/behandling/${behandlingId}/vilkar/livsopphold`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ytelseForPeriode: [
                    {
                        periode: livsopphold.vurderingsPeriode,
                        deltar: harYtelser,
                    }
                ],
            }),
        })
            .then(() => {
                mutator(`/api/behandling/${behandlingId}/vilkar/livsopphold`);
            })
            .catch((error) => {
                throw new Error(
                    `Noe gikk galt ved lagring av antall dager: ${error.message}`,
                );
            });
    };

    const onSubmit: SubmitHandler<SkjemaFelter> = (data) => {
        håndterLagreLivsoppholdSaksopplysning(data.valgtVerdi)
    };

    return (
        <VStack gap="4">
            <StegHeader
                headertekst={'Forholdet til andre ytelser'}
                lovdatatekst={livsopphold.vilkårLovreferanse.beskrivelse}
                paragraf={livsopphold.vilkårLovreferanse.paragraf}
                lovdatalenke={
                    'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
                }
            />
            <UtfallstekstMedIkon samletUtfall={livsopphold.samletUtfall} />
            <form
                onSubmit={handleSubmit(onSubmit)}
                style={{
                    background: '#E6F0FF',
                    padding: '1rem',
                }}
            >
                <Controller
                    name={'valgtVerdi'}
                    control={control}
                    render={({ field: { onChange } }) => {
                        return (
                            <RadioGroup
                                legend="Har bruker andre ytelser til livsopphold i vurderingperioden?"
                                onChange={onChange}
                                defaultValue={undefined}
                            >
                                <Radio
                                    value={true}
                                >{`Ja`}</Radio>
                                <Radio
                                    value={false}
                                >{`Nei`}</Radio>
                            </RadioGroup>
                        );
                    }}
                />
                <Button type="submit" value="submit">
                    Lagre endring
                </Button>

                {watchHarLivsoppholdytelser && (
                    <Alert variant="error">
                        <Heading spacing size="small" level="3">
                            Fører til avslag
                        </Heading>
                        Denne vurderingen fører til et avslag. Det støttes ikke i denne løsningen.
                    </Alert>
                )}
            </form>
        </VStack >
    );
};
