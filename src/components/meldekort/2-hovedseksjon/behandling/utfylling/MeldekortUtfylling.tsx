import { Alert, BodyShort, Button, HStack, Textarea, VStack } from '@navikt/ds-react';
import { useSak } from '~/context/sak/SakContext';
import {
    ForhåndsvisMeldekortbehandlingBrevRequest,
    MeldekortBehandlingForm,
    meldekortBehandlingFormTilDto,
    meldekortUtfyllingValidation,
} from './meldekortUtfyllingUtils';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useMeldeperiodeKjede } from '../../../context/MeldeperiodeKjedeContext';
import {
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingDTO,
    MeldekortBehandlingProps,
} from '~/types/meldekort/MeldekortBehandling';
import { MeldekortUker } from '../../../0-felles-komponenter/uker/MeldekortUker';
import { useRef } from 'react';
import { classNames } from '~/utils/classNames';
import { MeldekortBegrunnelse } from '../../../0-felles-komponenter/begrunnelse/MeldekortBegrunnelse';
import AvsluttMeldekortBehandling from '~/components/personoversikt/meldekort-oversikt/avsluttMeldekortBehandling/AvsluttMeldekortBehandling';
import { meldeperiodeUrl } from '~/utils/urls';
import { MeldekortBeregningOgSimulering } from '~/components/meldekort/0-felles-komponenter/beregning-simulering/MeldekortBeregningOgSimulering';
import Divider from '~/components/divider/Divider';
import { useFetchBlobFraApi, useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { hookFormErrorsTilFeiloppsummering } from '~/utils/validering';
import { Nullable } from '~/types/UtilTypes';
import { MeldeperiodeKjedeProps } from '~/types/meldekort/Meldeperiode';
import { useNotification } from '~/context/NotificationContext';
import { BekreftelsesModal } from '~/components/modaler/BekreftelsesModal';
import { SakId } from '~/types/Sak';
import { FetcherError } from '~/utils/fetch/fetch';
import { PERSONOVERSIKT_TABS } from '~/components/personoversikt/Personoversikt';
import { useMeldekortUtfyllingForm } from '~/components/meldekort/context/MeldekortUtfyllingFormContext';

import styles from './MeldekortUtfylling.module.css';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortUtfylling = ({ meldekortBehandling }: Props) => {
    const { sakId, saksnummer } = useSak().sak;
    const { navigateWithNotification } = useNotification();
    const { sisteMeldeperiode, setMeldeperiodeKjede } = useMeldeperiodeKjede();

    const { antallDager, ingenDagerGirRett } = sisteMeldeperiode;

    const formContext = useMeldekortUtfyllingForm();

    const skjemaErEndret = formContext.formState.isDirty;
    const skjemaErUtfylt = formContext
        .getValues()
        .dager.every((dag) => dag.status !== MeldekortBehandlingDagStatus.IkkeBesvart);
    const skalViseBeregningVarsel = skjemaErEndret && skjemaErUtfylt;

    const forhåndsvisBrev = useFetchBlobFraApi<ForhåndsvisMeldekortbehandlingBrevRequest>(
        `/sak/${sakId}/meldekortbehandling/${meldekortBehandling.id}/forhandsvis`,
        'POST',
    );

    const lagreOgBeregnMeldekort = useFetchJsonFraApi<
        MeldeperiodeKjedeProps,
        MeldekortBehandlingDTO
    >(`/sak/${sakId}/meldekort/${meldekortBehandling.id}/oppdater`, 'POST', {
        onSuccess: (oppdatertKjede) => {
            if (oppdatertKjede) {
                setMeldeperiodeKjede(oppdatertKjede);
            }
        },
    });

    const sendMeldekortTilBeslutter = useFetchJsonFraApi<
        MeldeperiodeKjedeProps,
        MeldekortBehandlingDTO
    >(`/sak/${sakId}/meldekort/${meldekortBehandling.id}`, 'POST', {
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

    const onSubmit = (data: MeldekortBehandlingForm) => {
        switch (buttonActionRef.current) {
            case 'åpneSendTilBeslutterModal':
                modalRef.current?.showModal();
                break;
            case 'lagreOgBeregn':
                //fordi brevet krever at beregning gjøres for å forhåndsvise, fjerner vi tidligere feil som kan ha oppstått
                forhåndsvisBrev.reset();
                lagreOgBeregnMeldekort.reset();
                lagreOgBeregnMeldekort.trigger(meldekortBehandlingFormTilDto(data));
                break;
            case 'sendTilBeslutter':
                sendMeldekortTilBeslutter.reset();
                sendMeldekortTilBeslutter.trigger(meldekortBehandlingFormTilDto(data));
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
        !skjemaErEndret && !harValideringsFeil && meldekortBehandling.beregning !== null;

    return (
        <form onSubmit={formContext.handleSubmit(onSubmit)}>
            <VStack gap={'space-20'}>
                <MeldekortUker dager={formContext.watch('dager')} underBehandling={true} />
                {skalViseBeregningVarsel && (
                    <Alert inline={true} variant={'warning'}>
                        {'Trykk "lagre og beregn" for å oppdatere beregningene'}
                    </Alert>
                )}
                <MeldekortBeregningOgSimulering
                    meldekortBehandling={meldekortBehandling}
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
                            label="Vedtaksbrev for behandling av meldekort"
                            description="Teksten vises i vedtaksbrevet til bruker."
                            minRows={5}
                            resize={'vertical'}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Button
                    className={styles.forhåndsvisBrevButton}
                    type="button"
                    variant="secondary"
                    size="small"
                    loading={forhåndsvisBrev.isMutating}
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
                                            dag.status !== MeldekortBehandlingDagStatus.IkkeBesvart,
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
                    meldekortBehandling={meldekortBehandling}
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
    meldekortBehandling: MeldekortBehandlingProps;
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
    form: UseFormReturn<MeldekortBehandlingForm>;
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
                <AvsluttMeldekortBehandling
                    sakId={props.sakId}
                    meldekortBehandlingId={props.meldekortBehandling.id}
                    personoversiktUrl={meldeperiodeUrl(
                        props.saksnummer,
                        props.meldekortBehandling.periode,
                    )}
                    buttonProps={{ variant: 'tertiary' }}
                />
                <HStack gap="space-8">
                    <Button
                        variant={'secondary'}
                        size="small"
                        loading={props.lagreOgBeregnMeldekort.isMutating}
                        onClick={() => {
                            props.buttonActionRef.current = 'lagreOgBeregn';
                        }}
                        disabled={props.ingenDagerGirRett}
                    >
                        Lagre og beregn
                    </Button>
                    <Button
                        size="small"
                        onClick={() => {
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
