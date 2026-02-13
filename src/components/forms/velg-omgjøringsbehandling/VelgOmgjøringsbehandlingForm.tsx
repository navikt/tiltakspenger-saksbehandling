import { Modal, Select, Button, VStack, Heading, HStack, LocalAlert } from '@navikt/ds-react';
import { Control, useWatch, Controller, useForm } from 'react-hook-form';
import { Rammevedtak } from '~/types/Rammevedtak';
import { Søknad } from '~/types/Søknad';
import { formaterTidspunkt } from '~/utils/date';
import {
    VelgOmgjøringsbehandlingFormData,
    velgOmgjøringsbehandlingFormDataTilOpprettRammebehandlingRequest,
    velgOmgjøringsbehandlingFormValidation,
    VelgOmgjøringsbehandlingTyper,
} from './VelgOmgjøringsbehandlingFormUtils';
import { useOpprettRammebehandlingForKlage } from '~/api/KlageApi';
import router from 'next/router';
import { behandlingUrl } from '~/utils/urls';
import { KlageId } from '~/types/Klage';
import { Nullable } from '~/types/UtilTypes';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { RevurderingResultat } from '~/types/Revurdering';

export const VelgOmgjøringsbehandlingModal = (props: {
    sakId: string;
    saksnummer: string;
    klageId: KlageId;
    vedtakSomPåklages: Nullable<Rammevedtak>;
    søknader: Søknad[];
    åpen: boolean;
    onClose: () => void;
}) => {
    const form = useForm<VelgOmgjøringsbehandlingFormData>({
        defaultValues: {
            behandlingstype: '',
            søknadId: '',
        },
        resolver: velgOmgjøringsbehandlingFormValidation,
    });

    const opprettRammebehandling = useOpprettRammebehandlingForKlage({
        sakId: props.sakId,
        klageId: props.klageId,
        onSuccess: (rammebehandling) => {
            router.push(behandlingUrl({ saksnummer: props.saksnummer, id: rammebehandling.id }));
        },
    });

    const onSubmit = (data: VelgOmgjøringsbehandlingFormData) => {
        opprettRammebehandling.trigger(
            velgOmgjøringsbehandlingFormDataTilOpprettRammebehandlingRequest(data),
        );
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Modal
                width={550}
                aria-label="Velg omgjøringsbehandling"
                open={props.åpen}
                onClose={props.onClose}
            >
                <Modal.Header>
                    <Heading size="medium">Velg omgjøringsbehandling</Heading>
                </Modal.Header>
                <Modal.Body>
                    <VelgOmgjøringsbehandlingForm
                        control={form.control}
                        vedtakSomPåklages={props.vedtakSomPåklages}
                        søknader={props.søknader}
                    />
                </Modal.Body>
                <Modal.Footer>
                    {opprettRammebehandling.error && (
                        <LocalAlert status="error" size="small">
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Feil ved opprettelse av omgjøringsbehandling
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>
                                {opprettRammebehandling.error.message}
                            </LocalAlert.Content>
                        </LocalAlert>
                    )}
                    <HStack gap="space-16">
                        <Button variant="secondary" onClick={props.onClose}>
                            Lukk
                        </Button>
                        <Button variant="primary" loading={opprettRammebehandling.isMutating}>
                            Opprett omgjøringsbehandling
                        </Button>
                    </HStack>
                </Modal.Footer>
            </Modal>
        </form>
    );
};

const VelgOmgjøringsbehandlingForm = (props: {
    control: Control<VelgOmgjøringsbehandlingFormData>;
    vedtakSomPåklages: Nullable<Rammevedtak>;
    søknader: Søknad[];
}) => {
    const behandlingstype = useWatch({
        control: props.control,
        name: 'behandlingstype',
    });

    const erVedtakSomPåKlagesInnvilgelse =
        props.vedtakSomPåklages?.resultat &&
        (props.vedtakSomPåklages.resultat === SøknadsbehandlingResultat.INNVILGELSE ||
            props.vedtakSomPåklages.resultat === RevurderingResultat.INNVILGELSE);

    return (
        <VStack gap="space-16">
            <Controller
                name={'behandlingstype'}
                control={props.control}
                render={({ field, fieldState }) => (
                    <Select label="Behandlingstype" {...field} error={fieldState.error?.message}>
                        <option value="">-- Velg behandlingstype --</option>
                        <option
                            value={VelgOmgjøringsbehandlingTyper.SØKNADSBEHANDLING}
                            disabled={props.søknader.length === 0}
                        >
                            Søknadsbehandling
                        </option>
                        <option
                            value={VelgOmgjøringsbehandlingTyper.REVURDERING_INNVILGELSE}
                            disabled={!erVedtakSomPåKlagesInnvilgelse}
                        >
                            Revurdering - Innvilgelse
                        </option>
                        <option
                            value={VelgOmgjøringsbehandlingTyper.REVURDERING_OMGJØRING}
                            disabled={!props.vedtakSomPåklages?.gyldigeKommandoer.OMGJØR}
                        >
                            Revurdering - Omgjøring
                        </option>
                    </Select>
                )}
            />
            {behandlingstype === VelgOmgjøringsbehandlingTyper.SØKNADSBEHANDLING && (
                <Controller
                    name={'søknadId'}
                    control={props.control}
                    render={({ field, fieldState }) => (
                        <Select {...field} label="Velg søknad" error={fieldState.error?.message}>
                            <option value="">-- Velg søknad --</option>
                            {props.søknader.map((søknad) => (
                                <option key={søknad.id} value={søknad.id}>
                                    {formaterTidspunkt(søknad.opprettet)}
                                </option>
                            ))}
                        </Select>
                    )}
                />
            )}
        </VStack>
    );
};
export default VelgOmgjøringsbehandlingForm;
