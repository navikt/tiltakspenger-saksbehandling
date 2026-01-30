import { Modal, Select, Button, VStack, Heading, HStack, LocalAlert } from '@navikt/ds-react';
import React from 'react';
import { Control, useWatch, Controller, useForm } from 'react-hook-form';
import { behandlingstypeTextFormatter } from '~/components/benk/BenkSideUtils';
import { Rammebehandling } from '~/types/Rammebehandling';
import { Rammevedtak } from '~/types/Rammevedtak';
import { Søknad } from '~/types/Søknad';
import { formaterTidspunkt, formaterTidspunktKort } from '~/utils/date';
import { behandlingResultatTilText } from '~/utils/tekstformateringUtils';
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

export const VelgOmgjøringsbehandlingModal = (props: {
    sakId: string;
    saksnummer: string;
    klageId: KlageId;
    vedtakOgBehandling: Array<{ vedtak: Rammevedtak; behandling: Rammebehandling }>;
    søknader: Søknad[];
    åpen: boolean;
    onClose: () => void;
}) => {
    const form = useForm<VelgOmgjøringsbehandlingFormData>({
        defaultValues: {
            behandlingstype: '',
            søknadId: '',
            vedtakId: '',
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
                        vedtakOgBehandling={props.vedtakOgBehandling}
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
    vedtakOgBehandling: Array<{ vedtak: Rammevedtak; behandling: Rammebehandling }>;
    søknader: Søknad[];
}) => {
    const behandlingstype = useWatch({
        control: props.control,
        name: 'behandlingstype',
    });

    return (
        <VStack gap="space-16">
            <Controller
                name={'behandlingstype'}
                control={props.control}
                render={({ field, fieldState }) => (
                    <Select label="Behandlingstype" {...field} error={fieldState.error?.message}>
                        <option value="">-- Velg behandlingstype --</option>
                        <option value={VelgOmgjøringsbehandlingTyper.SØKNADSBEHANDLING_INNVILGELSE}>
                            Søknadsbehandling - Innvilgelse
                        </option>
                        <option value={VelgOmgjøringsbehandlingTyper.REVURDERING_INNVILGELSE}>
                            Revurdering - Innvilgelse
                        </option>
                        <option value={VelgOmgjøringsbehandlingTyper.REVURDERING_OMGJØRING}>
                            Revurdering - Omgjøring
                        </option>
                    </Select>
                )}
            />
            {behandlingstype === VelgOmgjøringsbehandlingTyper.SØKNADSBEHANDLING_INNVILGELSE && (
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
            {behandlingstype === 'REVURDERING_OMGJØRING' && (
                <Controller
                    name={'vedtakId'}
                    control={props.control}
                    render={({ field, fieldState }) => (
                        <Select {...field} label="Velg vedtak" error={fieldState.error?.message}>
                            <option value="">-- Velg vedtak --</option>
                            {props.vedtakOgBehandling.map(({ vedtak, behandling }) => (
                                <option key={`${vedtak.id}-${behandling.id}`} value={vedtak.id}>
                                    {behandlingstypeTextFormatter[behandling.type]} -{' '}
                                    {behandlingResultatTilText[vedtak.resultat]} -{' '}
                                    {formaterTidspunktKort(vedtak.opprettet)}
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
