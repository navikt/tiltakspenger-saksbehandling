import { Box, HStack, Heading, Spacer, Button, DatePicker } from '@navikt/ds-react';
import { Controller, useForm } from 'react-hook-form';
import { BehandlingForBenk } from '../../types/BehandlingTypes';
import { MeldeperiodeSammendragProps } from '../../types/MeldekortTypes';
import { dateTilISOTekst } from '../../utils/date';
import { setupValidation } from '../../utils/validation';
import Datovelger from '../revurderingsmodal/Datovelger';
import Spørsmålsmodal from '../revurderingsmodal/Spørsmålsmodal';
import { useRef } from 'react';
import { useOpprettRevurdering } from '../../hooks/opprettRevurdering';
import { RevurderingForm } from '../../pages/sak/[saksnummer]';
import { MeldekortOversikt } from './meldekort-oversikt/MeldekortOversikt';
import { BehandlingerOversikt } from './behandlinger-oversikt/BehandlingerOversikt';

import styles from './Saksoversikt.module.css';

interface SaksoversiktProps {
    behandlingsoversikt: BehandlingForBenk[];
    meldeperioder: MeldeperiodeSammendragProps[];
    førsteLovligeStansdato: string;
    saksnummer: string;
    sakId: string;
}

export const Saksoversikt = ({
    behandlingsoversikt,
    førsteLovligeStansdato,
    meldeperioder,
    saksnummer,
    sakId,
}: SaksoversiktProps) => {
    const fraOgMed = new Date(førsteLovligeStansdato);
    const tilOgMed = new Date(behandlingsoversikt[0].periode.tilOgMed);

    const modalRef = useRef(null);

    const { opprettRevurdering } = useOpprettRevurdering(sakId, saksnummer);

    const onSubmit = () => {
        opprettRevurdering({
            periode: {
                fraOgMed: dateTilISOTekst(getValues().fraOgMed),
                tilOgMed: dateTilISOTekst(getValues().tilOgMed),
            },
        });
    };

    const {
        getValues,
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<RevurderingForm>({
        defaultValues: {
            fraOgMed: new Date(fraOgMed),
            tilOgMed: new Date(tilOgMed),
        },
    });

    return (
        <Box className={styles.wrapper}>
            <HStack align="center" style={{ marginBottom: '1rem' }}>
                <Heading spacing size="medium" level="2">
                    Saksoversikt
                </Heading>
                <Spacer />
                <Button
                    size="small"
                    variant="secondary"
                    onClick={() => modalRef.current.showModal()}
                >
                    Revurder
                </Button>
            </HStack>
            <Box className={styles.tabellwrapper}>
                <Heading level={'3'} size={'small'}>
                    {'Behandlinger'}
                </Heading>
                <BehandlingerOversikt behandlinger={behandlingsoversikt} />
            </Box>
            <Box className={styles.tabellwrapper}>
                <Heading level={'3'} size={'small'}>
                    {'Meldekort'}
                </Heading>
                <MeldekortOversikt meldeperioder={meldeperioder} saksnummer={saksnummer} />
            </Box>
            <Spørsmålsmodal
                modalRef={modalRef}
                heading="Velg periode for revurdering"
                submitTekst="Opprett revurdering"
                onSubmit={handleSubmit(onSubmit)}
            >
                {
                    <HStack gap="5">
                        <Controller
                            name="fraOgMed"
                            control={control}
                            rules={{
                                validate: setupValidation([]),
                            }}
                            render={({ field: { onChange, value } }) => (
                                <Datovelger
                                    onDateChange={onChange}
                                    label="Fra og med"
                                    minDate={new Date(fraOgMed)}
                                    maxDate={new Date(tilOgMed)}
                                    defaultSelected={value}
                                    errorMessage={errors.fraOgMed ? errors.fraOgMed.message : ''}
                                />
                            )}
                        />
                        <Controller
                            name="tilOgMed"
                            control={control}
                            rules={{
                                validate: setupValidation([]),
                            }}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker onChange={onChange}>
                                    <Datovelger
                                        onDateChange={onChange}
                                        label="Til og med"
                                        minDate={new Date(fraOgMed)}
                                        maxDate={new Date(tilOgMed)}
                                        defaultSelected={value}
                                        errorMessage={
                                            errors.tilOgMed ? errors.tilOgMed.message : ''
                                        }
                                    />
                                </DatePicker>
                            )}
                        />
                    </HStack>
                }
            </Spørsmålsmodal>
        </Box>
    );
};
