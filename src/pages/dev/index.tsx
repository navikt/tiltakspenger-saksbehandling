import {
    Alert,
    Button,
    DatePicker,
    Heading,
    HStack,
    Label,
    Modal,
    TextField,
    useRangeDatepicker,
    VStack,
} from '@navikt/ds-react';
import React from 'react';
import { useFetchJsonFraApi } from '../../utils/fetch/useFetchFraApi';
import router from 'next/router';
import { pageWithAuthentication } from '../../auth/pageWithAuthentication';
import { dateTilISOTekst } from '../../utils/date';

export const getServerSideProps = pageWithAuthentication(async () => {
    if (process?.env.NEXT_PUBLIC_DEVROUTES && process.env.NEXT_PUBLIC_DEVROUTES === 'true') {
        return { props: {} };
    }

    return {
        notFound: true,
    };
});

const LocalDevPage = () => {
    return (
        <VStack justify={'center'} align={'center'} style={{ height: '70vh' }}>
            <HStack>
                <NySøknad />
            </HStack>
        </VStack>
    );
};

export default LocalDevPage;

const NySøknad = () => {
    const [vilOppretteNySøknad, setVilOppretteNySøknad] = React.useState(false);

    return (
        <div>
            {vilOppretteNySøknad && (
                <NySøknadModal
                    open={vilOppretteNySøknad}
                    onClose={() => setVilOppretteNySøknad(false)}
                />
            )}
            <Button variant="secondary" onClick={() => setVilOppretteNySøknad(true)}>
                Ny søknad
            </Button>
        </div>
    );
};

const NySøknadModal = (props: { open: boolean; onClose: () => void }) => {
    const [fnr, setFnr] = React.useState('');
    const [fom, setFom] = React.useState<Date>();
    const [tom, setTom] = React.useState<Date>();

    const fetchNysøknad = useFetchJsonFraApi<
        string,
        {
            fnr: string | null;
            deltakelsesperiode: {
                fraOgMed: string;
                tilOgMed: string;
            } | null;
        }
    >('/dev/soknad/ny', 'POST', {
        onSuccess: (data) => {
            router.push(`/sak/${data}`);
        },
    });

    const onSubmit = () => {
        fetchNysøknad.trigger({
            fnr: fnr ? fnr : null,
            deltakelsesperiode:
                fom && tom
                    ? { fraOgMed: dateTilISOTekst(fom), tilOgMed: dateTilISOTekst(tom) }
                    : null,
        });
    };

    return (
        <Modal aria-label="Lag ny søknad" open={props.open} onClose={props.onClose}>
            <Modal.Header>
                <Heading size="medium">Lag ny søknad</Heading>
            </Modal.Header>
            <Modal.Body>
                <VStack gap="5">
                    <TextField
                        label="Fødselsnummer"
                        description="Hvis du ikke setter in fnr, vil det bli generert et tilfeldig (mest sannsynlig ugyldig) fnr"
                        value={fnr}
                        onChange={(e) => setFnr(e.target.value)}
                    />
                    <RangePickerDate
                        value={{
                            fraOgMed: fom,
                            tilOgMed: tom,
                        }}
                        onChange={(periode) => {
                            setFom(periode.fraOgMed ?? undefined);
                            setTom(periode.tilOgMed ?? undefined);
                        }}
                    />
                </VStack>
            </Modal.Body>
            <Modal.Footer>
                <VStack gap="4">
                    {fetchNysøknad.error && (
                        <Alert variant="error">{fetchNysøknad.error.message}</Alert>
                    )}
                    <HStack gap="4">
                        <Button variant="secondary" type="button" onClick={props.onClose}>
                            Avbryt
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            onClick={() => onSubmit()}
                            loading={fetchNysøknad.isMutating}
                        >
                            Lag søknad
                        </Button>
                    </HStack>
                </VStack>
            </Modal.Footer>
        </Modal>
    );
};

export const RangePickerDate = (props: {
    value: { fraOgMed: Date | undefined; tilOgMed: Date | undefined };
    size?: 'medium' | 'small';
    onChange: (periode: { fraOgMed: Date | undefined; tilOgMed: Date | undefined }) => void;
    error?: { fraOgMed?: string; tilOgMed?: string };
}) => {
    const { datepickerProps, fromInputProps, toInputProps } = useRangeDatepicker({
        onRangeChange: (v) =>
            props.onChange({ fraOgMed: v?.from ?? undefined, tilOgMed: v?.to ?? undefined }),
        defaultSelected: {
            from: props.value.fraOgMed ?? undefined,
            to: props.value.tilOgMed ?? undefined,
        },
    });

    return (
        <VStack>
            <Label>Deltakelsesperiode</Label>
            <HStack gap={'4'}>
                <DatePicker {...datepickerProps} dropdownCaption>
                    <DatePicker.Input
                        {...fromInputProps}
                        label={'Fra og med'}
                        size={props.size ?? 'medium'}
                    />
                </DatePicker>
                <DatePicker {...datepickerProps} dropdownCaption>
                    <DatePicker.Input {...toInputProps} label={'Til og med'} size={'medium'} />
                </DatePicker>
            </HStack>
        </VStack>
    );
};
