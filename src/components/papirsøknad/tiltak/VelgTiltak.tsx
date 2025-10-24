import React from 'react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import { JaNeiSpørsmål } from '~/components/papirsøknad/JaNeiSpørsmål';
import { Søknad, Tiltak } from '~/components/papirsøknad/papirsøknadTypes';
import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import styles from '../Spørsmål.module.css';
import { classNames } from '~/utils/classNames';
import { formaterDatotekst } from '~/utils/date';
import { useHentTiltaksdeltakelser } from '~/components/papirsøknad/tiltak/useHentTiltaksdeltakelser';
import { SakId } from '~/types/SakTypes';

type Props = {
    sakId: SakId;
    spørsmålName: FieldPath<Søknad>;
    legend: string;
};

export const VelgTiltak = ({ sakId, spørsmålName, legend }: Props) => {
    const { control, setValue, resetField } = useFormContext<Søknad>();
    const [muligeTiltak, setMuligeTiltak] = React.useState<Tiltak[]>([]);

    const spørsmål = useController({
        name: spørsmålName,
        control,
        defaultValue: undefined,
    });

    const [skalHenteTiltak, setSkalHenteTiltak] = React.useState(false);

    const formatLabelForTiltakValg = (tiltak: Tiltak) => {
        const { fraOgMed, tilOgMed } = tiltak.periode ?? {};
        const periodeTekst =
            fraOgMed && tilOgMed
                ? ` (${formaterDatotekst(fraOgMed)} - ${formaterDatotekst(tilOgMed)})`
                : '';
        const arrangørNavn = tiltak.arrangørnavn ? ` - ${tiltak.arrangørnavn}` : '';
        return `${tiltak.typeNavn}${arrangørNavn}${periodeTekst}`;
    };

    const {
        data: tiltaksdeltakelser,
        isLoading,
        error,
    } = useHentTiltaksdeltakelser(sakId, skalHenteTiltak);

    React.useEffect(() => {
        if (skalHenteTiltak && tiltaksdeltakelser) {
            setMuligeTiltak(tiltaksdeltakelser);
        }
    }, [skalHenteTiltak, tiltaksdeltakelser, muligeTiltak]);

    return (
        <div className={classNames(styles.informasjonsInnhentingBlokk, styles.blokk)}>
            <JaNeiSpørsmål name="svar.harTiltak" legend={legend} />
            {spørsmål.field.value && (
                <div className={styles.blokk}>
                    <Button
                        className={styles.finnTiltakButton}
                        size="small"
                        loading={isLoading}
                        onClick={() => setSkalHenteTiltak(true)}
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
                        <div>Noe gikk galt ved uthenting av søkers tiltaksdeltakelser.</div>
                    )}

                    {skalHenteTiltak && muligeTiltak.length > 0 && (
                        <RadioGroup
                            legend="Velg tiltak"
                            onChange={(value) => setValue('svar.tiltak', value)}
                        >
                            {muligeTiltak.map((tiltak) => (
                                <Radio
                                    key={tiltak.eksternDeltakelseId}
                                    value={tiltak.eksternDeltakelseId}
                                >
                                    {formatLabelForTiltakValg(tiltak)}
                                </Radio>
                            ))}
                        </RadioGroup>
                    )}
                </div>
            )}
        </div>
    );
};
