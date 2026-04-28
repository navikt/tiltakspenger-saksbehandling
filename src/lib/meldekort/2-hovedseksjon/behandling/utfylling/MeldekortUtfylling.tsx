import {
    Alert,
    BodyShort,
    Button,
    Checkbox,
    Heading,
    HStack,
    Textarea,
    VStack,
} from '@navikt/ds-react';
import { useSak } from '~/context/sak/SakContext';
import {
    ForhåndsvisMeldekortbehandlingBrevRequest,
    MeldekortbehandlingForm,
    meldekortbehandlingFormTilDto,
    meldekortUtfyllingValidation,
} from './meldekortUtfyllingUtils';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useMeldeperiodeKjede } from '../../../context/MeldeperiodeKjedeContext';
import {
    MeldekortbehandlingDagStatus,
    MeldekortbehandlingDTO,
    MeldekortbehandlingProps,
} from '~/types/meldekort/Meldekortbehandling';
import { MeldekortUker } from '../../../0-felles-komponenter/uker/MeldekortUker';
import { useRef } from 'react';
import { classNames } from '~/utils/classNames';
import { MeldekortBegrunnelse } from '../../../0-felles-komponenter/begrunnelse/MeldekortBegrunnelse';
import AvsluttMeldekortbehandling from '~/lib/personoversikt/meldekort-oversikt/avsluttMeldekortbehandling/AvsluttMeldekortbehandling';
import { meldeperiodeUrl } from '~/utils/urls';
import { MeldekortBeregningOgSimulering } from '~/lib/meldekort/0-felles-komponenter/beregning-simulering/MeldekortBeregningOgSimulering';
import Divider from '~/lib/_felles/divider/Divider';
import { useFetchBlobFraApi, useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { hookFormErrorsTilFeiloppsummering } from '~/utils/validering';
import { Nullable } from '~/types/UtilTypes';
import { MeldeperiodeKjedeProps } from '~/types/meldekort/Meldeperiode';
import { useNotification } from '~/context/NotificationContext';
import { BekreftelsesModal } from '~/lib/modaler/BekreftelsesModal';
import { SakId } from '~/types/Sak';
import { FetcherError } from '~/utils/fetch/fetch';
import { PERSONOVERSIKT_TABS } from '~/lib/personoversikt/Personoversikt';
import { useMeldekortbehandlingForm } from '~/lib/meldekort/context/MeldekortUtfyllingFormContext';

import styles from './MeldekortUtfylling.module.css';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
};

export const MeldekortUtfylling = ({ meldekortbehandling }: Props) => {
    const { sakId, saksnummer } = useSak().sak;
    const { navigateWithNotification } = useNotification();
    const { sisteMeldeperiode, setMeldeperiodeKjede } = useMeldeperiodeKjede();

    const { antallDager, ingenDagerGirRett } = sisteMeldeperiode;

    const formContext = useMeldekortbehandlingForm()!;

    const skjemaErEndret = formContext.formState.isDirty;
    const skjemaErUtfylt = formContext
        .getValues()
        .dager.every((dag) => dag.status !== MeldekortbehandlingDagStatus.IkkeBesvart);
    const skalViseBeregningVarsel = skjemaErEndret && skjemaErUtfylt;

    const forhåndsvisBrev = useFetchBlobFraApi<ForhåndsvisMeldekortbehandlingBrevRequest>(
        `/sak/${sakId}/meldekortbehandling/${meldekortbehandling.id}/forhandsvis`,
        'POST',
    );

    const lagreOgBeregnMeldekort = useFetchJsonFraApi<
        MeldeperiodeKjedeProps,
        MeldekortbehandlingDTO
    >(`/sak/${sakId}/meldekort/${meldekortbehandling.id}/oppdater`, 'POST', {
        onSuccess: (oppdatertKjede) => {
            if (oppdatertKjede) {
                setMeldeperiodeKjede(oppdatertKjede);
            }
        },
    });

    const sendMeldekortTilBeslutter = useFetchJsonFraApi<
        MeldeperiodeKjedeProps,
        MeldekortbehandlingDTO
    >(`/sak/${sakId}/meldekort/${meldekortbehandling.id}`, 'POST', {
        onSuccess: (oppdatertKjede) => {
            if (oppdatertKjede) {
                setMeldeperiodeKjede(oppdatertKjede);
                navigateWithNotification(
                    `/sak/${saksnummer}#${PERSONOVERSIKT_TABS.meldekort}`,
                    'Meldekortet er sendt til beslutter!',
                );
            }
        },
    });

    const modalRef = useRef<HTMLDialogElement>(null);

    const buttonActionRef =
        useRef<Nullable<'lagreOgBeregn' | 'sendTilBeslutter' | 'åpneSendTilBeslutterModal'>>(null);

    const onSubmit = (data: MeldekortbehandlingForm) => {
        switch (buttonActionRef.current) {
            case 'åpneSendTilBeslutterModal':
                modalRef.current?.showModal();
                break;
            case 'lagreOgBeregn':
                //fordi brevet krever at beregning gjøres for å forhåndsvise, fjerner vi tidligere feil som kan ha oppstått
                forhåndsvisBrev.reset();
                lagreOgBeregnMeldekort.reset();
                lagreOgBeregnMeldekort.trigger(meldekortbehandlingFormTilDto(data));
                break;
            case 'sendTilBeslutter':
                sendMeldekortTilBeslutter.reset();
                sendMeldekortTilBeslutter.trigger(meldekortbehandlingFormTilDto(data));
                break;
        }
    };

    const harValideringsFeil =
        Object.values(
            meldekortUtfyllingValidation(formContext.getValues(), {
                tillattAntallDager: antallDager,
            }).errors,
        ).length > 0;

    //Vi er interesert i å disable 'send til beslutter' hvis formet ikke er i en tilstand som kan sendes videre
    const kanSendeTilBeslutning =
        !skjemaErEndret && !harValideringsFeil && meldekortbehandling.beregning !== null;

    const skalSendeVedtaksbrev = formContext.watch('skalSendeVedtaksbrev');

    return (
        // TODO Gjorde lintingen strengere ved oppgradering til Next 16. Fikset bare åpenbare feil, denne burde undersøkes.
        /* eslint-disable-next-line react-hooks/refs */
        <form onSubmit={formContext.handleSubmit(onSubmit)}>
            <VStack gap={'space-20'}>
                <MeldekortUker dager={formContext.watch('dager')} underBehandling={true} />
                {skalViseBeregningVarsel && (
                    <Alert inline={true} variant={'warning'}>
                        {'Trykk "lagre og beregn" for å oppdatere beregningene'}
                    </Alert>
                )}
                <MeldekortBeregningOgSimulering
                    meldekortbehandling={meldekortbehandling}
                    className={classNames(skjemaErEndret && styles.utdatertBeregning)}
                />
                <Controller
                    name={'begrunnelse'}
                    control={formContext.control}
                    render={({ field }) => <MeldekortBegrunnelse {...field} />}
                />

                <Divider orientation="horizontal" />
                <Controller
                    name={'tekstTilVedtaksbrev'}
                    control={formContext.control}
                    render={({ field }) => (
                        <Textarea
                            className={
                                skalSendeVedtaksbrev
                                    ? styles.vedtaksbrevTextarea
                                    : styles.vedtaksbrevTextareaReadOnly
                            }
                            label={
                                <HStack justify="space-between" align="center">
                                    <Heading size={'xsmall'} level={'5'}>
                                        Vedtaksbrev for behandling av meldekort
                                    </Heading>

                                    <Controller
                                        control={formContext.control}
                                        name={'skalSendeVedtaksbrev'}
                                        render={({ field }) => (
                                            <Checkbox
                                                onChange={(e) => field.onChange(!e.target.checked)}
                                                checked={!field.value}
                                            >
                                                Ikke send vedtaksbrev
                                            </Checkbox>
                                        )}
                                    />
                                </HStack>
                            }
                            description="Teksten vises i vedtaksbrevet til bruker."
                            minRows={5}
                            resize={'vertical'}
                            value={field.value}
                            onChange={field.onChange}
                            readOnly={!skalSendeVedtaksbrev}
                        />
                    )}
                />
                <Button
                    className={styles.forhåndsvisBrevButton}
                    type="button"
                    variant="secondary"
                    size="small"
                    loading={forhåndsvisBrev.isMutating}
                    disabled={meldekortbehandling.erAvsluttet || !skalSendeVedtaksbrev}
                    onClick={() => {
                        //resetter eventuelle tidligere feil før ny request
                        forhåndsvisBrev.reset();
                        forhåndsvisBrev.trigger(
                            {
                                tekstTilVedtaksbrev: formContext.getValues('tekstTilVedtaksbrev')
                                    ? formContext.getValues('tekstTilVedtaksbrev')
                                    : null,
                                dager: formContext
                                    .getValues('dager')
                                    .every(
                                        (dag) =>
                                            dag.status !== MeldekortbehandlingDagStatus.IkkeBesvart,
                                    )
                                    ? formContext.getValues('dager')
                                    : null,
                            },
                            { onSuccess: (blob) => window.open(URL.createObjectURL(blob!)) },
                        );
                    }}
                >
                    Forhåndsvis brev
                </Button>
                {forhåndsvisBrev.error && (
                    <Alert variant="error" size="small">
                        <BodyShort>Feil ved forhåndsvisning av brev</BodyShort>
                        <BodyShort>{forhåndsvisBrev.error.message}</BodyShort>
                    </Alert>
                )}
                <Divider orientation="horizontal" />
                <MeldekortUtfyllingFooter
                    sakId={sakId}
                    saksnummer={saksnummer}
                    meldekortbehandling={meldekortbehandling}
                    lagreOgBeregnMeldekort={lagreOgBeregnMeldekort}
                    sendMeldekortTilBeslutter={sendMeldekortTilBeslutter}
                    modalRef={modalRef}
                    buttonActionRef={buttonActionRef}
                    form={formContext}
                    ingenDagerGirRett={ingenDagerGirRett}
                    kanSendeTilBeslutning={kanSendeTilBeslutning}
                />
            </VStack>
        </form>
    );
};

const MeldekortUtfyllingFooter = (props: {
    sakId: SakId;
    saksnummer: string;
    meldekortbehandling: MeldekortbehandlingProps;
    lagreOgBeregnMeldekort: {
        isMutating: boolean;
        error?: FetcherError;
    };
    sendMeldekortTilBeslutter: {
        isMutating: boolean;
        error?: FetcherError;
    };
    modalRef: React.RefObject<Nullable<HTMLDialogElement>>;
    buttonActionRef: React.RefObject<
        Nullable<'lagreOgBeregn' | 'sendTilBeslutter' | 'åpneSendTilBeslutterModal'>
    >;
    form: UseFormReturn<MeldekortbehandlingForm>;
    ingenDagerGirRett: boolean;
    kanSendeTilBeslutning: boolean;
}) => {
    return (
        <VStack gap={'space-8'}>
            {Object.values(props.form.formState.errors).length > 0 && (
                <Alert variant={'error'} size={'small'}>
                    <BodyShort weight={'semibold'} size={'small'}>
                        {'Feil i utfyllingen'}
                    </BodyShort>
                    <ul>
                        {hookFormErrorsTilFeiloppsummering(props.form.formState.errors).map(
                            (error, idx) => (
                                <li key={`${idx}-${error}`}>
                                    <BodyShort size="small">{error}</BodyShort>
                                </li>
                            ),
                        )}
                    </ul>
                </Alert>
            )}
            <HStack justify={'space-between'}>
                <AvsluttMeldekortbehandling
                    sakId={props.sakId}
                    meldekortbehandlingId={props.meldekortbehandling.id}
                    personoversiktUrl={meldeperiodeUrl(
                        props.saksnummer,
                        props.meldekortbehandling.periode,
                    )}
                    buttonProps={{ variant: 'tertiary' }}
                />
                <HStack gap="space-8">
                    <Button
                        variant={'secondary'}
                        size="small"
                        loading={props.lagreOgBeregnMeldekort.isMutating}
                        onClick={() => {
                            // TODO Gjorde lintingen strengere ved oppgradering til Next 16. Fikset bare åpenbare feil, denne burde undersøkes.
                            /* eslint-disable-next-line react-hooks/immutability */
                            props.buttonActionRef.current = 'lagreOgBeregn';
                        }}
                        disabled={props.ingenDagerGirRett}
                    >
                        Lagre og beregn
                    </Button>
                    <Button
                        size="small"
                        onClick={() => {
                            // TODO Gjorde lintingen strengere ved oppgradering til Next 16. Fikset bare åpenbare feil, denne burde undersøkes.
                            /* eslint-disable-next-line react-hooks/immutability */
                            props.buttonActionRef.current = 'åpneSendTilBeslutterModal';
                        }}
                        disabled={props.ingenDagerGirRett || !props.kanSendeTilBeslutning}
                    >
                        Send til beslutter
                    </Button>
                    <BekreftelsesModal
                        modalRef={props.modalRef}
                        tittel={'Send meldekort til beslutter'}
                        feil={props.sendMeldekortTilBeslutter.error}
                        lukkModal={() => props.modalRef.current?.close()}
                        bekreftKnapp={
                            <Button
                                size={'small'}
                                loading={props.sendMeldekortTilBeslutter.isMutating}
                                onClick={() => {
                                    // TODO Gjorde lintingen strengere ved oppgradering til Next 16. Fikset bare åpenbare feil, denne burde undersøkes.
                                    /* eslint-disable-next-line react-hooks/immutability */
                                    props.buttonActionRef.current = 'sendTilBeslutter';
                                }}
                            >
                                Send til beslutter
                            </Button>
                        }
                    >
                        Er du sikker på at meldekortet er ferdig utfylt og klart til å sendes til
                        beslutter?
                    </BekreftelsesModal>
                </HStack>
            </HStack>
            {props.ingenDagerGirRett && (
                <Alert variant={'warning'} size={'small'}>
                    {
                        'Ingen dager gir rett til tiltakspenger i denne meldeperioden. Behandlingen kan kun avsluttes.'
                    }
                </Alert>
            )}
            {props.lagreOgBeregnMeldekort.error && (
                <Alert variant="error" size="small">
                    <BodyShort>Feil ved lagring og beregning</BodyShort>
                    <BodyShort>{props.lagreOgBeregnMeldekort.error?.message}</BodyShort>
                </Alert>
            )}
        </VStack>
    );
};
