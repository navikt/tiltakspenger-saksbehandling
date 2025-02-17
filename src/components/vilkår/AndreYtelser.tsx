import { Alert, Button, Heading, Loader, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import VilkårHeader from './VilkårHeader';
import { useHentLivsopphold } from '../../hooks/vilkår/useHentLivsopphold';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import styles from './Vilkår.module.css';
import { useContext } from 'react';
import { BehandlingContextDeprecated } from '../layout/FørstegangsbehandlingLayout';
import { useLagreLivsoppholdSaksopplysning } from '../../hooks/vilkår/useLagreLivsoppholdSaksopplysning';
import Varsel from '../varsel/Varsel';
import { useHentBehandlingDeprecated } from '../../hooks/useHentBehandlingDeprecated';
import { lagUtfallstekst } from '../../utils/tekstformateringUtils';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { UtfallIkon } from '../utfallikon/UtfallIkon';

type SkjemaFelter = {
    harAndreYtelser: boolean;
};

const AndreYtelser = () => {
    const { behandlingId } = useContext(BehandlingContextDeprecated)!;
    const valgtBehandling = useHentBehandlingDeprecated(behandlingId).valgtBehandling!;
    const { livsopphold, isLoading, error } = useHentLivsopphold(behandlingId);
    const { onLagreLivsopphold, isLivsoppholdMutating } =
        useLagreLivsoppholdSaksopplysning(behandlingId);

    const { handleSubmit, control, watch } = useForm<SkjemaFelter>({
        mode: 'onSubmit',
        defaultValues: {
            harAndreYtelser: undefined,
        },
    });

    const watchHarLivsoppholdytelser = watch('harAndreYtelser');

    if (isLoading || !livsopphold) {
        return <Loader />;
    } else if (error)
        return (
            <Varsel
                variant="error"
                melding={`Kunne ikke hente livsoppholdvilkår (${error.status} ${error.info})`}
            />
        );

    const håndterLagreLivsoppholdSaksopplysning = (harYtelser: boolean) => {
        if (harYtelser) {
            return;
        }

        onLagreLivsopphold({
            ytelseForPeriode: {
                periode: valgtBehandling.vurderingsperiode,
                harYtelse: harYtelser,
            },
        });
    };

    const onSubmit: SubmitHandler<SkjemaFelter> = (data) => {
        håndterLagreLivsoppholdSaksopplysning(data.harAndreYtelser);
    };
    return (
        <VStack gap="4">
            <VilkårHeader
                headertekst={'Forholdet til andre ytelser'}
                lovdatatekst={livsopphold.vilkårLovreferanse.beskrivelse}
                paragraf={livsopphold.vilkårLovreferanse.paragraf}
                lovdatalenke={'https://lovdata.no/forskrift/2013-11-04-1286/§7'}
            />

            {!watchHarLivsoppholdytelser && (
                <IkonMedTekst
                    iconRenderer={() => <UtfallIkon utfall={livsopphold.samletUtfall} />}
                    text={lagUtfallstekst(livsopphold.samletUtfall)}
                />
            )}
            {watchHarLivsoppholdytelser && (
                <Alert variant="error">
                    <Heading spacing size="small" level="3">
                        Utfall støttes ikke
                    </Heading>
                    Denne vurderingen fører til et utfall vi ikke støtter i denne løsningen enda.
                </Alert>
            )}
            <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name={'harAndreYtelser'}
                    control={control}
                    render={({ field: { onChange } }) => {
                        return (
                            <RadioGroup
                                legend="Har bruker andre ytelser til livsopphold i vurderingsperioden?"
                                onChange={onChange}
                                defaultValue={
                                    livsopphold.samletUtfall == 'UAVKLART'
                                        ? undefined
                                        : livsopphold.avklartSaksopplysning.harLivsoppholdYtelser
                                }
                            >
                                <Radio value={true}>{`Ja`}</Radio>
                                <Radio value={false}>{`Nei`}</Radio>
                            </RadioGroup>
                        );
                    }}
                />
                <Button
                    type="submit"
                    value="submit"
                    size="small"
                    loading={isLivsoppholdMutating}
                    className={styles.margin_top}
                    disabled={watchHarLivsoppholdytelser}
                >
                    Lagre
                </Button>
            </form>
        </VStack>
    );
};

export default AndreYtelser;
