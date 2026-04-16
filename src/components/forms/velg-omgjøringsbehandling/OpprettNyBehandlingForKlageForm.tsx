import {
    Modal,
    Select,
    Button,
    VStack,
    Heading,
    HStack,
    LocalAlert,
    BodyShort,
} from '@navikt/ds-react';
import { Control, useWatch, Controller, useForm } from 'react-hook-form';
import { Rammevedtak, VedtakId } from '~/types/Rammevedtak';
import { Søknad } from '~/types/Søknad';
import { formaterTidspunkt, ukenummerFraDatotekst } from '~/utils/date';
import {
    VelgOmgjøringsbehandlingFormData,
    velgOmgjøringsbehandlingFormDataTilOpprettRammebehandlingRequest,
    velgOmgjøringsbehandlingFormValidation,
    VelgOmgjøringsbehandlingTyper,
} from './OpprettNyBehandlingForKlageFormUtils';
import { useOpprettRammebehandlingForKlage } from '~/api/KlageApi';
import router from 'next/router';
import { behandlingUrl } from '~/utils/urls';
import { KlageId } from '~/types/Klage';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { RevurderingResultat } from '~/types/Revurdering';
import { MeldekortVedtak } from '~/types/meldekort/MeldekortVedtak';

export const OpprettNyBehandlingForKlageModal = (props: {
    sakId: string;
    saksnummer: string;
    klageId: KlageId;
    vedtakIdDetKlagesPå: VedtakId;
    vedtak: Rammevedtak[];
    meldekortvedtak: MeldekortVedtak[];
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
                aria-label="Velg ny behandling"
                open={props.åpen}
                onClose={props.onClose}
            >
                <Modal.Header>
                    <Heading size="medium">Velg ny behandling</Heading>
                </Modal.Header>
                <Modal.Body>
                    <OpprettNyBehandlingForKlageModalBody
                        control={form.control}
                        vedtakIdDetKlagesPå={props.vedtakIdDetKlagesPå}
                        vedtak={props.vedtak}
                        søknader={props.søknader}
                        meldekortVedtak={props.meldekortvedtak}
                    />
                </Modal.Body>
                <Modal.Footer>
                    {opprettRammebehandling.error && (
                        <LocalAlert status="error" size="small">
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Feil ved opprettelse av ny behandling
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
                            Opprett ny behandling
                        </Button>
                    </HStack>
                </Modal.Footer>
            </Modal>
        </form>
    );
};

const OpprettNyBehandlingForKlageModalBody = (props: {
    control: Control<VelgOmgjøringsbehandlingFormData>;
    vedtak: Rammevedtak[];
    meldekortVedtak: MeldekortVedtak[];
    søknader: Søknad[];
    vedtakIdDetKlagesPå: VedtakId;
}) => {
    const behandlingstype = useWatch({
        control: props.control,
        name: 'behandlingstype',
    });

    const harInnvilgelsesVedtak = !!props.vedtak.find(
        (vedtak) =>
            vedtak.resultat === SøknadsbehandlingResultat.INNVILGELSE ||
            vedtak.resultat === RevurderingResultat.INNVILGELSE,
    );

    const harVedtakSomKanOmgjøres = !!props.vedtak.find((vedtak) =>
        vedtak.gyldigeKommandoer.OMGJØR ? true : false,
    );

    const meldekortVedtakSomPåklages = props.meldekortVedtak.find(
        (vedtak) => vedtak.id === props.vedtakIdDetKlagesPå,
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
                            disabled={!meldekortVedtakSomPåklages}
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
                    name={'vedtakId'}
                    control={props.control}
                    render={({ field, fieldState }) => (
                        <Select
                            {...field}
                            label="Velg vedtak som skal omgjøres"
                            error={fieldState.error?.message}
                        >
                            <option value="">-- Velg omgjøringsvedtak --</option>
                            {props.vedtak
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

            {behandlingstype === VelgOmgjøringsbehandlingTyper.MELDEKORTBEHANDLING &&
                meldekortVedtakSomPåklages && (
                    <VStack>
                        <BodyShort>
                            Ny meldekortbehandling kommer til å bli opprettet for uke{' '}
                            {ukenummerFraDatotekst(meldekortVedtakSomPåklages.periode.fraOgMed)} og{' '}
                            {ukenummerFraDatotekst(meldekortVedtakSomPåklages.periode.tilOgMed)}
                        </BodyShort>
                    </VStack>
                )}
        </VStack>
    );
};
export default OpprettNyBehandlingForKlageModalBody;
