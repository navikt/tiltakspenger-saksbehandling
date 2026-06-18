import { Modal, Select, Button, VStack, Heading, HStack, LocalAlert } from '@navikt/ds-react';
import { Control, useWatch, Controller, useForm } from 'react-hook-form';
import { Rammevedtak } from '~/lib/rammebehandling/typer/Rammevedtak';
import { Søknad } from '~/types/Søknad';
import { formaterDatotekst, formaterTidspunkt } from '~/utils/date';
import {
    VelgOmgjøringsbehandlingFormData,
    velgOmgjøringsbehandlingFormDataTilOpprettBehandlingRequest,
    velgOmgjøringsbehandlingFormValidation,
    VelgOmgjøringsbehandlingTyper,
} from './VelgOmgjøringsbehandlingFormUtils';
import { useOpprettRammebehandlingForKlage as useOpprettBehandlingForKlage } from '~/lib/klage/api/KlageApi';
import router from 'next/router';
import { behandlingUrl, meldeperiodeUrl } from '~/utils/urls';
import { Klagebehandling } from '~/lib/klage/typer/Klage';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import {
    erBehandlingIdMeldekortbehandling,
    erBehandlingIdRammebehandling,
} from '~/lib/behandling-felles/utils/behandlingUtils';
import { MeldekortVedtak } from '~/lib/meldekort/typer/MeldekortVedtak';
import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/v2/typer';

export const VelgOmgjøringsbehandlingModal = (props: {
    sakId: string;
    saksnummer: string;
    klagebehandling: Klagebehandling;
    rammevedtak: Rammevedtak[];
    søknader: Søknad[];
    meldekortvedtak: MeldekortVedtak[];
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

    const opprettRammebehandling = useOpprettBehandlingForKlage({
        sakId: props.sakId,
        klageId: props.klagebehandling.id,
        onSuccess: (behandling) => {
            if (erBehandlingIdRammebehandling(behandling.id)) {
                router.push(behandlingUrl({ saksnummer: props.saksnummer, id: behandling.id }));
            }
            if (erBehandlingIdMeldekortbehandling(behandling.id)) {
                router.push(
                    meldeperiodeUrl(
                        props.saksnummer,
                        (behandling as MeldekortbehandlingPropsV2).periode,
                    ),
                );
            }
        },
    });

    const onSubmit = (data: VelgOmgjøringsbehandlingFormData) => {
        opprettRammebehandling.trigger(
            velgOmgjøringsbehandlingFormDataTilOpprettBehandlingRequest(data),
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
                        rammevedtak={props.rammevedtak}
                        søknader={props.søknader}
                        klagebehandling={props.klagebehandling}
                        meldekortvedtak={props.meldekortvedtak}
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
    rammevedtak: Rammevedtak[];
    søknader: Søknad[];
    klagebehandling: Klagebehandling;
    meldekortvedtak: MeldekortVedtak[];
}) => {
    const behandlingstype = useWatch({
        control: props.control,
        name: 'behandlingstype',
    });

    const harInnvilgelsesVedtak = !!props.rammevedtak.find(
        (vedtak) =>
            vedtak.resultat === SøknadsbehandlingResultat.INNVILGELSE ||
            vedtak.resultat === RevurderingResultat.INNVILGELSE,
    );

    const harVedtakSomKanOmgjøres = !!props.rammevedtak.find((vedtak) =>
        vedtak.gyldigeKommandoer.OMGJØR ? true : false,
    );

    const klagerPåUtbetalingsvedtak = !!props.meldekortvedtak.find(
        (v) => v.id === props.klagebehandling.formkrav.vedtakDetKlagesPå,
    );

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
                            disabled={!harInnvilgelsesVedtak}
                        >
                            Revurdering - Innvilgelse
                        </option>
                        <option
                            value={VelgOmgjøringsbehandlingTyper.REVURDERING_OMGJØRING}
                            disabled={!harVedtakSomKanOmgjøres}
                        >
                            Revurdering - Omgjøring
                        </option>
                        <option
                            value={VelgOmgjøringsbehandlingTyper.MELDEKORTBEHANDLING}
                            disabled={!klagerPåUtbetalingsvedtak}
                        >
                            Meldekortbehandling
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

            {behandlingstype === VelgOmgjøringsbehandlingTyper.REVURDERING_OMGJØRING && (
                <Controller
                    name={'vedtakSomSkalOmgjøres'}
                    control={props.control}
                    render={({ field, fieldState }) => (
                        <Select
                            {...field}
                            label="Velg vedtak som skal omgjøres"
                            error={fieldState.error?.message}
                        >
                            <option value="">-- Velg omgjøringsvedtak --</option>
                            {props.rammevedtak
                                .filter((vedtak) =>
                                    vedtak.gyldigeKommandoer.OMGJØR ? true : false,
                                )
                                .map((vedtak) => (
                                    <option key={vedtak.id} value={vedtak.id}>
                                        {formaterTidspunkt(vedtak.opprettet)}
                                    </option>
                                ))}
                        </Select>
                    )}
                />
            )}
            {behandlingstype === VelgOmgjøringsbehandlingTyper.MELDEKORTBEHANDLING && (
                <Controller
                    name={'kjedeId'}
                    control={props.control}
                    render={({ field, fieldState }) => (
                        <Select {...field} label="Periode" error={fieldState.error?.message}>
                            <option value="">-- Velg periode --</option>
                            {[
                                //dedupper kjede-id'er for å unngå duplikate perioder i dropdownen
                                ...new Set(props.meldekortvedtak.map((vedtak) => vedtak.kjedeId)),
                            ].map((kjedeId) => (
                                <option key={kjedeId} value={kjedeId}>
                                    {formaterDatotekst(kjedeId.split('/')[0])} -{' '}
                                    {formaterDatotekst(kjedeId.split('/')[1])}
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
