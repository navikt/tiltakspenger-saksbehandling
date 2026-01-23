import React from 'react';
import { Controller, FieldPath, useController, useFormContext, useWatch } from 'react-hook-form';
import { JaNeiSpørsmål } from '~/components/manuell-søknad/JaNeiSpørsmål';
import {
    ManueltRegistrertSøknad,
    Tiltak,
} from '~/components/manuell-søknad/ManueltRegistrertSøknad';
import { Alert, Button, Radio, RadioGroup, TextField, VStack } from '@navikt/ds-react';
import styles from '../Spørsmål.module.css';
import { classNames } from '~/utils/classNames';
import { formaterDatotekst } from '~/utils/date';
import { useHentTiltaksdeltakelser } from '~/components/manuell-søknad/tiltak/useHentTiltaksdeltakelser';
import { SakId } from '~/types/Sak';
import { Periode } from '~/types/Periode';

type Props = {
    sakId: SakId;
    spørsmålName: FieldPath<ManueltRegistrertSøknad>;
    legend: string;
};

export const VelgTiltak = ({ sakId, spørsmålName, legend }: Props) => {
    const { control, setValue, resetField } = useFormContext<ManueltRegistrertSøknad>();
    const [muligeTiltak, setMuligeTiltak] = React.useState<Tiltak[]>([]);

    const spørsmål = useController({
        name: spørsmålName,
        control,
        defaultValue: undefined,
    });

    const [skalHenteTiltak, setSkalHenteTiltak] = React.useState(false);

    const formatLabelForTiltakValg = (tiltak: Tiltak) => {
        const periodeTekst =
            tiltak.deltakelseFraOgMed && tiltak.deltakelseTilOgMed
                ? ` (${formaterDatotekst(tiltak.deltakelseFraOgMed)} - ${formaterDatotekst(tiltak.deltakelseTilOgMed)})`
                : '';
        return `${tiltak.visningsnavn}${periodeTekst}`;
    };

    const søknadsperiode = useWatch({ name: 'manueltSattSøknadsperiode' }) as Periode;
    const fraOgMed = søknadsperiode?.fraOgMed;
    const tilOgMed = søknadsperiode?.tilOgMed;
    const {
        data: tiltaksdeltakelser,
        isLoading,
        error,
    } = useHentTiltaksdeltakelser(sakId, fraOgMed, tilOgMed, skalHenteTiltak);

    React.useEffect(() => {
        if (skalHenteTiltak && tiltaksdeltakelser) {
            setMuligeTiltak(tiltaksdeltakelser);
        }
    }, [skalHenteTiltak, tiltaksdeltakelser, muligeTiltak]);

    return (
        <div className={classNames(styles.informasjonsInnhentingBlokk, styles.blokk)}>
            <JaNeiSpørsmål
                name="svar.harSøktPåTiltak.svar"
                legend={legend}
                onChange={(newValue) => {
                    if (newValue !== 'JA') {
                        resetField('svar.tiltak');
                    }
                }}
            />
            {spørsmål.field.value === 'JA' && (
                <div className={styles.blokk}>
                    {(!fraOgMed || !tilOgMed) && (
                        <Alert variant="warning">
                            Vi kan ikke hente tiltaksdeltakelser før søknadsperioden er satt.
                        </Alert>
                    )}
                    <Button
                        type="button"
                        className={styles.finnTiltakButton}
                        size="small"
                        loading={isLoading}
                        onClick={() => setSkalHenteTiltak(true)}
                        disabled={!fraOgMed || !tilOgMed}
                    >
                        Finn tiltak
                    </Button>

                    {skalHenteTiltak && (
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                                resetField('svar.tiltak');
                                setSkalHenteTiltak(false);
                            }}
                        >
                            Nullstill
                        </Button>
                    )}

                    {error && skalHenteTiltak && (
                        <Alert variant="error">
                            Noe gikk galt ved uthenting av søkers tiltaksdeltakelser.
                        </Alert>
                    )}

                    {skalHenteTiltak && (
                        <>
                            {muligeTiltak.length === 0 && (
                                <Alert variant="warning">
                                    Fant ingen tiltaksdeltakelser for den angitte perioden. Du kan
                                    skrive inn tiltaket manuelt under.
                                </Alert>
                            )}
                            {muligeTiltak.length > 0 && (
                                <VStack gap="2">
                                    <Alert variant="info">
                                        Dersom ingen av tiltakene under passer kan du skrive inn
                                        tiltaket manuelt under.
                                    </Alert>
                                    <RadioGroup
                                        legend="Velg tiltak"
                                        onChange={(value) => setValue('svar.tiltak', value)}
                                    >
                                        {muligeTiltak.map((tiltak) => (
                                            <Radio
                                                key={tiltak.eksternDeltakelseId}
                                                value={{
                                                    eksternDeltakelseId: tiltak.eksternDeltakelseId,
                                                    deltakelseFraOgMed: tiltak.deltakelseFraOgMed,
                                                    deltakelseTilOgMed: tiltak.deltakelseTilOgMed,
                                                    typeKode: tiltak.typeKode,
                                                    typeNavn: tiltak.typeNavn,
                                                }}
                                            >
                                                {formatLabelForTiltakValg(tiltak)}
                                            </Radio>
                                        ))}
                                    </RadioGroup>
                                </VStack>
                            )}
                        </>
                    )}
                    <Controller
                        name={'manueltSattTiltak'}
                        control={control}
                        render={({ field, fieldState }) => (
                            <div className={styles.blokk}>
                                <TextField
                                    label="Annet tiltak"
                                    value={field.value ?? ''}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={fieldState.error?.message}
                                />
                            </div>
                        )}
                    />
                </div>
            )}
        </div>
    );
};
