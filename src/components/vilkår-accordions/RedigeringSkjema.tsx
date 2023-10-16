import { RadioGroup, Radio, DatePicker, Select, Button, useRangeDatepicker, VStack, HStack } from '@navikt/ds-react';
import { FormEvent, useState } from 'react';

interface RedigeringSkjemaProps {
    vilkår: string;
    håndterLukkRedigering: () => void;
    behandlingId: string;
}

export const RedigeringSkjema = ({ håndterLukkRedigering, vilkår, behandlingId }: RedigeringSkjemaProps) => {
    const [valgtFom, setFom] = useState<Date>();
    const [valgtTom, setTom] = useState<Date>();
    const [harYtelse, setHarYtelse] = useState<boolean>();
    const [begrunnelse, setBegrunnelse] = useState<string>('');

    const håndterLagreSaksopplysning = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        håndterLukkRedigering();

        const res = fetch(`/api/behandling/${behandlingId}`, {
            method: 'POST',
            body: JSON.stringify({
                fom: valgtFom?.toISOString().split('T')[0],
                tom: valgtTom?.toISOString().split('T')[0],
                vilkår: vilkår,
                begrunnelse: begrunnelse,
                harYtelse: harYtelse,
            }),
        });
    };

    const { datepickerProps, toInputProps, fromInputProps } = useRangeDatepicker({
        fromDate: new Date('Sep 12 2023'),
        onRangeChange: (range) => {
            if (range) {
                setFom(range.from);
                setTom(range.to);
            }
        },
    });

    return (
        <form
            style={{
                background: '#F2F3F5',
                width: '100%',
                height: '100%',
                padding: '1rem',
            }}
            onSubmit={(e) => håndterLagreSaksopplysning(e)}
        >
            <VStack gap="5">
                <RadioGroup legend="Endre vilkår" onChange={(value: boolean) => setHarYtelse(value)}>
                    <Radio value={false}>Mottar ikke</Radio>
                    <Radio value={true}>Mottar</Radio>
                </RadioGroup>
                <DatePicker {...datepickerProps}>
                    <HStack gap="5">
                        <DatePicker.Input {...fromInputProps} label="Fra" />
                        <DatePicker.Input {...toInputProps} label="Til" />
                    </HStack>
                </DatePicker>
                <Select
                    label="Begrunnelse for endring"
                    style={{ width: '415px' }}
                    onChange={(e) => setBegrunnelse(e.target.value)}
                >
                    <option value="">Velg grunn</option>
                    <option value="Feil i innhentet data">Feil i innhentet data</option>
                    <option value="Endring etter søknadstidspunkt">Endring etter søknadstidspunkt</option>
                </Select>
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
    );
};
