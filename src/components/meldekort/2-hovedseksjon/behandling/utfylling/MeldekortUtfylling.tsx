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
    tellDagerMedDeltattEllerFravær,
} from './meldekortUtfyllingUtils';
import { Controller, FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { useMeldeperiodeKjede } from '../../../MeldeperiodeKjedeContext';
import {
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingDTO,
    MeldekortBehandlingProps,
} from '~/types/meldekort/MeldekortBehandling';
import { MeldekortUker } from '../../../0-felles-komponenter/uker/MeldekortUker';
import { MeldekortUtfyllingLagre } from './lagre/MeldekortUtfyllingLagre';
import { MeldekortSendTilBeslutning } from '../beslutning/MeldekortSendTilBeslutning';
import React, { useEffect, useRef } from 'react';
import { classNames } from '~/utils/classNames';
import { MeldekortBegrunnelse } from '../../../0-felles-komponenter/begrunnelse/MeldekortBegrunnelse';
import AvsluttMeldekortBehandling from '~/components/personoversikt/meldekort-oversikt/avsluttMeldekortBehandling/AvsluttMeldekortBehandling';
import { meldeperiodeUrl } from '~/utils/urls';
import { MeldekortBeregningOgSimulering } from '~/components/meldekort/0-felles-komponenter/beregning-simulering/MeldekortBeregningOgSimulering';

import styles from './MeldekortUtfylling.module.css';
import Divider from '~/components/divider/Divider';
import { useFetchBlobFraApi } from '~/utils/fetch/useFetchFraApi';
import { gyldigeStatusValg } from '~/components/meldekort/0-felles-komponenter/uker/MeldekortUkeBehandling';
import { formaterDatotekst } from '~/utils/date';
import { hookFormErrorsTilFeiloppsummering } from '~/utils/ValideringUtils';

const useCustomValidationResolver = () =>
    React.useCallback(
        async (
            data: MeldekortBehandlingForm,
            valideringscontext: { tillattAntallDager: number },
        ) => {
            const errors: FieldErrors<MeldekortBehandlingForm> = {};

            if (
                tellDagerMedDeltattEllerFravær(data.dager) > valideringscontext.tillattAntallDager
            ) {
                errors['dager'] = {
                    type: 'dager',
                    message: `For mange dager utfylt - Maks ${valideringscontext.tillattAntallDager} dager med tiltak for denne perioden.`,
                };
            }

            data.dager.forEach((dag, index) => {
                /*
                Denne er fordi vi teller med dagene som saksbehandler ikke skal få lov til å endre
                slik at feilmeldingene blir mappet til den riktige indeksen.
                */
                if (dag.status === MeldekortBehandlingDagStatus.IkkeRettTilTiltakspenger) {
                    return;
                }

                if (!gyldigeStatusValg.includes(dag.status)) {
                    //erorr objektet vårt må bygges opp dynamisk for å matche react-hook-form sitt format
                    errors.dager = errors.dager ?? [];
                    errors.dager[index] = errors.dager[index] ?? {};

                    errors['dager'][index]['status'] = {
                        type: `dager.${index}.status`,
                        message: `Ugyldig status valgt for dag ${formaterDatotekst(dag.dato)}`,
                    };
                }
            });

            return { values: data, errors: errors };
        },
        [],
    );

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortUtfylling = ({ meldekortBehandling }: Props) => {
    const { meldeperiodeKjede, tidligereMeldekortBehandlinger, sisteMeldeperiode } =
        useMeldeperiodeKjede();
    const { sakId, saksnummer } = useSak().sak;
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
            begrunnelse: meldekortBehandling.begrunnelse,
            tekstTilVedtaksbrev: meldekortBehandling.tekstTilVedtaksbrev ?? null,
        },
        resolver: useCustomValidationResolver(),
        context: { tillattAntallDager: antallDager },
    });

    const skjemaErEndret = formContext.formState.isDirty;
    const skjemaErUtfylt = formContext
        .getValues()
        .dager.every((dag) => dag.status !== MeldekortBehandlingDagStatus.IkkeBesvart);
    const skalViseBeregningVarsel = skjemaErEndret && skjemaErUtfylt;

    const hentMeldekortUtfylling = (): MeldekortBehandlingDTO => ({
        dager: formContext.getValues().dager,
        begrunnelse: formContext.getValues().begrunnelse,
        tekstTilVedtaksbrev: formContext.getValues().tekstTilVedtaksbrev ?? null,
    });

    const modalRef = useRef<HTMLDialogElement>(null);

    const forhåndsvisBrev = useFetchBlobFraApi<ForhåndsvisMeldekortbehandlingBrevRequest>(
        `/sak/${sakId}/meldekortbehandling/${meldekortBehandling.id}/forhandsvis`,
        'POST',
    );

    const onSubmit = () => {
        modalRef.current?.showModal();
    };

    useEffect(() => {
        formContext.reset({
            dager: hentMeldekortForhåndsutfylling(
                meldekortBehandling,
                tidligereMeldekortBehandlinger,
                sisteMeldeperiode,
                brukersMeldekortForBehandling,
            ),
            begrunnelse: meldekortBehandling.begrunnelse,
            tekstTilVedtaksbrev: meldekortBehandling.tekstTilVedtaksbrev,
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

                                        {meldekortBehandling.tekstTilVedtaksbrev !==
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
                                value={field.value ?? ''}
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
                            forhåndsvisBrev.trigger(
                                {
                                    tekstTilVedtaksbrev: formContext.getValues(
                                        'tekstTilVedtaksbrev',
                                    )
                                        ? formContext.getValues('tekstTilVedtaksbrev')
                                        : null,
                                },
                                {
                                    onSuccess: (blob) => {
                                        window.open(URL.createObjectURL(blob!));
                                    },
                                },
                            );
                        }}
                    >
                        Forhåndsvis brev
                    </Button>
                    {forhåndsvisBrev.error && (
                        <Alert variant="error" size="small">
                            <BodyShort>Feil ved forhåndsvisning av brev</BodyShort>
                            <BodyShort>{`[${forhåndsvisBrev.error.status}] ${forhåndsvisBrev.error.message}`}</BodyShort>
                        </Alert>
                    )}
                    <Divider orientation="horizontal" />
                    <VStack gap={'2'}>
                        {Object.values(formContext.formState.errors).length > 0 && (
                            <Alert variant={'error'} size={'small'}>
                                <BodyShort weight={'semibold'} size={'small'}>
                                    {'Feil i utfyllingen'}
                                </BodyShort>
                                <ul>
                                    {hookFormErrorsTilFeiloppsummering(
                                        formContext.formState.errors,
                                    ).map((error, idx) => (
                                        <li key={`${idx}-${error}`}>
                                            <BodyShort size="small">{error}</BodyShort>
                                        </li>
                                    ))}
                                </ul>
                            </Alert>
                        )}
                        <HStack justify={'space-between'}>
                            <AvsluttMeldekortBehandling
                                sakId={sakId}
                                meldekortBehandlingId={meldekortBehandling.id}
                                personoversiktUrl={meldeperiodeUrl(
                                    saksnummer,
                                    meldekortBehandling.periode,
                                )}
                                buttonProps={{
                                    variant: 'tertiary',
                                }}
                            />
                            <HStack gap="2">
                                <MeldekortUtfyllingLagre
                                    meldekortId={meldekortBehandling.id}
                                    sakId={sakId}
                                    hentMeldekortUtfylling={hentMeldekortUtfylling}
                                />
                                <MeldekortSendTilBeslutning
                                    meldekortId={meldekortBehandling.id}
                                    sakId={sakId}
                                    hentMeldekortUtfylling={hentMeldekortUtfylling}
                                    saksnummer={saksnummer}
                                    modalRef={modalRef}
                                />
                            </HStack>
                        </HStack>
                    </VStack>
                </VStack>
            </form>
        </FormProvider>
    );
};
