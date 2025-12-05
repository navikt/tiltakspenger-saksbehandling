import {
    Alert,
    BodyShort,
    Button,
    HelpText,
    HStack,
    InlineMessage,
    Textarea,
    VStack,
} from '@navikt/ds-react';
import { useSak } from '~/context/sak/SakContext';
import {
    ForhåndsvisMeldekortbehandlingBrevRequest,
    hentMeldekortForhåndsutfylling,
    MeldekortBehandlingForm,
    meldekortBehandlingFormTilDto,
    useCustomMeldekortUtfyllingValidationResolver,
} from './meldekortUtfyllingUtils';
import { Controller, FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { useMeldeperiodeKjede } from '../../../MeldeperiodeKjedeContext';
import {
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingDTO,
    MeldekortBehandlingProps,
} from '~/types/meldekort/MeldekortBehandling';
import { MeldekortUker } from '../../../0-felles-komponenter/uker/MeldekortUker';
import React, { useEffect, useRef } from 'react';
import { classNames } from '~/utils/classNames';
import { MeldekortBegrunnelse } from '../../../0-felles-komponenter/begrunnelse/MeldekortBegrunnelse';
import AvsluttMeldekortBehandling from '~/components/personoversikt/meldekort-oversikt/avsluttMeldekortBehandling/AvsluttMeldekortBehandling';
import { meldeperiodeUrl } from '~/utils/urls';
import { MeldekortBeregningOgSimulering } from '~/components/meldekort/0-felles-komponenter/beregning-simulering/MeldekortBeregningOgSimulering';

import styles from './MeldekortUtfylling.module.css';
import Divider from '~/components/divider/Divider';
import { useFetchBlobFraApi, useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { hookFormErrorsTilFeiloppsummering } from '~/utils/ValideringUtils';
import { Nullable } from '~/types/UtilTypes';
import { MeldeperiodeKjedeProps } from '~/types/meldekort/Meldeperiode';
import { useNotification } from '~/context/NotificationContext';
import { BekreftelsesModal } from '~/components/modaler/BekreftelsesModal';
import { SakId } from '~/types/Sak';
import { FetcherError } from '~/utils/fetch/fetch';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortUtfylling = ({ meldekortBehandling }: Props) => {
    const { sakId, saksnummer } = useSak().sak;
    const { navigateWithNotification } = useNotification();
    const {
        meldeperiodeKjede,
        tidligereMeldekortBehandlinger,
        sisteMeldeperiode,
        setMeldeperiodeKjede,
    } = useMeldeperiodeKjede();

    const brukersMeldekortForBehandling =
        meldeperiodeKjede.brukersMeldekort.find(
            (b) => b.id === meldekortBehandling.brukersMeldekortId,
        ) ?? meldeperiodeKjede.brukersMeldekort.at(-1); // Bruk siste brukers meldekort som fallback

    const { antallDager } = sisteMeldeperiode;

    const formContext = useForm<MeldekortBehandlingForm>({
        defaultValues: {
            dager: hentMeldekortForhåndsutfylling(
                meldekortBehandling,
                tidligereMeldekortBehandlinger,
                sisteMeldeperiode,
                brukersMeldekortForBehandling,
            ),
            begrunnelse: meldekortBehandling.begrunnelse ?? '',
            tekstTilVedtaksbrev: meldekortBehandling.tekstTilVedtaksbrev ?? '',
        },
        resolver: useCustomMeldekortUtfyllingValidationResolver(),
        context: { tillattAntallDager: antallDager },
    });

    const skjemaErEndret = formContext.formState.isDirty;
    const skjemaErUtfylt = formContext
        .getValues()
        .dager.every((dag) => dag.status !== MeldekortBehandlingDagStatus.IkkeBesvart);
    const skalViseBeregningVarsel = skjemaErEndret && skjemaErUtfylt;

    const forhåndsvisBrev = useFetchBlobFraApi<ForhåndsvisMeldekortbehandlingBrevRequest>(
        `/sak/${sakId}/meldekortbehandling/${meldekortBehandling.id}/forhandsvis`,
        'POST',
    );

    const buttonActionRef =
        useRef<Nullable<'lagreOgBeregn' | 'sendTilBeslutter' | 'åpneSendTilBeslutterModal'>>(null);

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

    const modalRef = useRef<HTMLDialogElement>(null);

    const sendMeldekortTilBeslutter = useFetchJsonFraApi<
        MeldeperiodeKjedeProps,
        MeldekortBehandlingDTO
    >(`/sak/${sakId}/meldekort/${meldekortBehandling.id}`, 'POST', {
        onSuccess: (oppdatertKjede) => {
            if (oppdatertKjede) {
                setMeldeperiodeKjede(oppdatertKjede);
                navigateWithNotification(
                    `/sak/${saksnummer}`,
                    'Meldekortet er sendt til beslutter!',
                );
            }
        },
    });

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

    useEffect(() => {
        formContext.reset({
            dager: hentMeldekortForhåndsutfylling(
                meldekortBehandling,
                tidligereMeldekortBehandlinger,
                sisteMeldeperiode,
                brukersMeldekortForBehandling,
            ),
            begrunnelse: meldekortBehandling.begrunnelse ?? '',
            tekstTilVedtaksbrev: meldekortBehandling.tekstTilVedtaksbrev ?? '',
        });
    }, [meldekortBehandling, tidligereMeldekortBehandlinger, brukersMeldekortForBehandling]);

    return (
        <FormProvider {...formContext}>
            <form onSubmit={formContext.handleSubmit(onSubmit)}>
                <VStack gap={'5'}>
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
                    <MeldekortBegrunnelse
                        defaultValue={meldekortBehandling.begrunnelse}
                        onChange={(event) => {
                            formContext.setValue('begrunnelse', event.target.value);
                        }}
                    />

                    <Divider orientation="horizontal" />
                    <Controller
                        name={'tekstTilVedtaksbrev'}
                        control={formContext.control}
                        render={({ field }) => (
                            <Textarea
                                label="Vedtaksbrev for behandling av meldekort"
                                description={
                                    <VStack gap="2">
                                        <BodyShort>
                                            Teksten vises i vedtaksbrevet til bruker.
                                        </BodyShort>

                                        {(meldekortBehandling.tekstTilVedtaksbrev ?? '') !==
                                            formContext.watch('tekstTilVedtaksbrev') && (
                                            <HStack gap="1">
                                                <InlineMessage status="warning">
                                                    Teksten er endret og ikke lagret.
                                                </InlineMessage>
                                                <HelpText>
                                                    Endringene blir lagret ved &apos;Lagre og
                                                    beregn&apos;, og &apos;Send til beslutter&apos;
                                                </HelpText>
                                            </HStack>
                                        )}
                                    </VStack>
                                }
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
                                    tekstTilVedtaksbrev: formContext.getValues(
                                        'tekstTilVedtaksbrev',
                                    )
                                        ? formContext.getValues('tekstTilVedtaksbrev')
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
                    />
                </VStack>
            </form>
        </FormProvider>
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
}) => {
    return (
        <VStack gap={'2'}>
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
                <HStack gap="2">
                    <Button
                        variant={'secondary'}
                        size="small"
                        loading={props.lagreOgBeregnMeldekort.isMutating}
                        onClick={() => {
                            props.buttonActionRef.current = 'lagreOgBeregn';
                        }}
                    >
                        Lagre og beregn
                    </Button>
                    <Button
                        size="small"
                        onClick={() => {
                            props.buttonActionRef.current = 'åpneSendTilBeslutterModal';
                        }}
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
            {props.lagreOgBeregnMeldekort.error && (
                <Alert variant="error" size="small">
                    <BodyShort>Feil ved lagring og beregning</BodyShort>
                    <BodyShort>{props.lagreOgBeregnMeldekort.error?.message}</BodyShort>
                </Alert>
            )}
        </VStack>
    );
};
