import {
    RadioGroup,
    Radio,
    DatePicker,
    Select,
    Button,
    useRangeDatepicker,
    VStack,
    HStack,
    Alert,
} from '@navikt/ds-react';
import { FormEvent, useState } from 'react';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/date';

interface RedigeringSkjemaProps {
    vilkår: string;
    håndterLukkRedigering: () => void;
    behandlingId: string;
    behandlingPeriodeFom: Date;
    behandlingPeriodeTom: Date;
}

export const RedigeringSkjema = ({
    håndterLukkRedigering,
    vilkår,
    behandlingPeriodeFom,
    behandlingPeriodeTom,
    behandlingId,
}: RedigeringSkjemaProps) => {
    const [valgtFom, settFom] = useState<Date>(behandlingPeriodeFom);
    const [valgtTom, settTom] = useState<Date>(behandlingPeriodeTom);
    const [harYtelse, settHarYtelse] = useState<boolean>(false);
    const [begrunnelse, settBegrunnelse] = useState<string>('');

    const mutator = useSWRConfig().mutate;

    const håndterLagreSaksopplysning = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        håndterLukkRedigering();

        if (!harYtelse) {
            settFom(behandlingPeriodeFom);
            settTom(behandlingPeriodeTom);
        }

        console.log(valgtFom?.);
        console.log(valgtTom?.getUTCDate());
        const res = fetch(`/api/behandling/${behandlingId}`, {
            method: 'POST',
            body: JSON.stringify({
                fom: formatDate(valgtFom),
                tom: formatDate(valgtTom),
                vilkår: vilkår,
                begrunnelse: begrunnelse,
                harYtelse: harYtelse,
            }),
        }).then(() => {
            mutator(`/api/behandling/${behandlingId}`).then(() => {
                toast('Saksopplysning endret');
            });
        });
    };

    const { datepickerProps, toInputProps, fromInputProps } = useRangeDatepicker({
        fromDate: new Date(),
        onRangeChange: (range) => {
            if (range) {
                settFom(range.from);
                settTom(range.to);
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
                {!harYtelse && (
                    <Alert variant="info">{`Mottar ikke ${vilkår.toLowerCase()} i perioden ${behandlingPeriodeFom.toLocaleDateString()} til ${behandlingPeriodeTom.toLocaleDateString()}`}</Alert>
                )}
                <RadioGroup
                    legend="Endre vilkår"
                    defaultValue={false}
                    onChange={(value: boolean) => settHarYtelse(value)}
                >
                    <Radio value={false}>Mottar ikke</Radio>
                    <Radio value={true}>Mottar</Radio>
                </RadioGroup>
                {harYtelse && (
                    <DatePicker {...datepickerProps}>
                        <HStack gap="5">
                            <DatePicker.Input {...fromInputProps} label="Fra" />
                            <DatePicker.Input {...toInputProps} label="Til" />
                        </HStack>
                    </DatePicker>
                )}
                <Select
                    label="Begrunnelse for endring"
                    style={{ width: '415px' }}
                    onChange={(e) => settBegrunnelse(e.target.value)}
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
