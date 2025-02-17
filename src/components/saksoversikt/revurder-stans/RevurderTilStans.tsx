import { Button, HStack } from '@navikt/ds-react';
import Spørsmålsmodal from '../../revurderingsmodal/Spørsmålsmodal';
import { Controller, useForm } from 'react-hook-form';
import { setupValidation } from '../../../utils/validation';
import { Datovelger } from '../../revurderingsmodal/Datovelger';
import { useRef } from 'react';
import { dateTilISOTekst } from '../../../utils/date';
import { useOpprettRevurdering } from '../../../hooks/useOpprettRevurdering';
import { SakId } from '../../../types/SakTypes';

interface RevurderingForm {
    fraOgMed: Date;
}

type Props = {
    førsteLovligeStansdato: string;
    sakId: SakId;
    saksnummer: string;
};

export const RevurderTilStans = ({ førsteLovligeStansdato, sakId, saksnummer }: Props) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const fraOgMed = new Date(førsteLovligeStansdato);

    const { opprettRevurdering } = useOpprettRevurdering(sakId, saksnummer);

    const onSubmit = () => {
        opprettRevurdering({
            fraOgMed: dateTilISOTekst(getValues().fraOgMed),
        });
    };

    const {
        getValues,
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<RevurderingForm>({
        defaultValues: {
            fraOgMed,
        },
    });

    return (
        <>
            <Button size="small" variant="secondary" onClick={() => modalRef.current?.showModal()}>
                Revurder til stans
            </Button>
            <Spørsmålsmodal
                modalRef={modalRef}
                heading="Velg dato for stans"
                submitTekst="Opprett revurdering"
                onSubmit={handleSubmit(onSubmit)}
            >
                {
                    <HStack gap="5">
                        <Controller
                            name={'fraOgMed'}
                            control={control}
                            rules={{
                                validate: setupValidation([]),
                            }}
                            render={({ field: { onChange, value } }) => (
                                <Datovelger
                                    onDateChange={onChange}
                                    label="Stans fra og med"
                                    minDate={fraOgMed}
                                    defaultSelected={value}
                                    error={errors.fraOgMed ? errors.fraOgMed.message : ''}
                                />
                            )}
                        />
                    </HStack>
                }
            </Spørsmålsmodal>
        </>
    );
};
