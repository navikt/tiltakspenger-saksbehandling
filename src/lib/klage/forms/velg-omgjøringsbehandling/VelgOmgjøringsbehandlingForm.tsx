import { Button, Dialog, LocalAlert, Select, VStack } from '@navikt/ds-react';
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
import { Meldekortvedtak } from '~/lib/meldekort/typer/Meldekortvedtak';

import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';

import { MeldeperiodekjedeProps } from '~/lib/meldekort/typer/Meldeperiodekjede';

export const VelgOmgjøringsbehandlingModal = (props: {
    sakId: string;
    saksnummer: string;
    klagebehandling: Klagebehandling;
    rammevedtak: Rammevedtak[];
    søknader: Søknad[];
    meldekortvedtak: Meldekortvedtak[];
    meldeperiodekjeder: MeldeperiodekjedeProps[];
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
                        (behandling as MeldekortbehandlingProps).periode,
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
        <Dialog open={props.åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && props.onClose()}>
            <Dialog.Popup width={'550px'} aria-label="Velg omgjøringsbehandling">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Dialog.Header>
                        <Dialog.Title>Velg omgjøringsbehandling</Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body>
                        <VStack gap="space-16">
                            <VelgOmgjøringsbehandlingForm
                                control={form.control}
                                rammevedtak={props.rammevedtak}
                                søknader={props.søknader}
                                klagebehandling={props.klagebehandling}
                                meldekortvedtak={props.meldekortvedtak}
                                meldeperiodekjeder={props.meldeperiodekjeder}
                            />

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
                        </VStack>
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Button
                            variant="primary"
                            type="submit"
                            loading={opprettRammebehandling.isMutating}
                        >
                            Opprett omgjøringsbehandling
                        </Button>

                        <Dialog.CloseTrigger>
                            <Button variant="secondary" type="button">
                                Lukk
                            </Button>
                        </Dialog.CloseTrigger>
                    </Dialog.Footer>
                </form>
            </Dialog.Popup>
        </Dialog>
    );
};

const VelgOmgjøringsbehandlingForm = (props: {
    control: Control<VelgOmgjøringsbehandlingFormData>;
    rammevedtak: Rammevedtak[];
    søknader: Søknad[];
    klagebehandling: Klagebehandling;
    meldekortvedtak: Meldekortvedtak[];
    meldeperiodekjeder: MeldeperiodekjedeProps[];
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

    const harVedtakSomKanOmgjøres = !!props.rammevedtak.find(
        (vedtak) => !!vedtak.gyldigeKommandoer.OMGJØR,
    );

    const klagerPåUtbetalingsvedtak = !!props.meldekortvedtak.find(
        (v) => v.id === props.klagebehandling.formkrav.vedtakDetKlagesPå,
    );

    const kjederSomKanOpprettesMeldekortbehandlingerFor = props.meldeperiodekjeder
        .filter(
            (kjede) =>
                kjede.meldekortbehandlingStatus === MeldekortbehandlingStatus.GODKJENT ||
                kjede.meldekortbehandlingStatus === MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET,
        )
        .map((k) => k.id);

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
                                .filter((vedtak) => !!vedtak.gyldigeKommandoer.OMGJØR)
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
                            {kjederSomKanOpprettesMeldekortbehandlingerFor.map((kjedeId) => (
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
