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
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMeldeperiodeKjede } from '../../../MeldeperiodeKjedeContext';
import {
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingDTO,
    MeldekortBehandlingProps,
} from '~/types/meldekort/MeldekortBehandling';
import { MeldekortUker } from '../../../0-felles-komponenter/uker/MeldekortUker';
import { MeldekortUtfyllingLagre } from './lagre/MeldekortUtfyllingLagre';
import { MeldekortSendTilBeslutning } from '../beslutning/MeldekortSendTilBeslutning';
import React, { useEffect, useState } from 'react';
import { classNames } from '~/utils/classNames';
import { MeldekortBegrunnelse } from '../../../0-felles-komponenter/begrunnelse/MeldekortBegrunnelse';
import AvsluttMeldekortBehandling from '~/components/personoversikt/meldekort-oversikt/avsluttMeldekortBehandling/AvsluttMeldekortBehandling';
import { meldeperiodeUrl } from '~/utils/urls';
import { MeldekortBeregningOgSimulering } from '~/components/meldekort/0-felles-komponenter/beregning-simulering/MeldekortBeregningOgSimulering';

import styles from './MeldekortUtfylling.module.css';
import Divider from '~/components/divider/Divider';
import { useFetchBlobFraApi } from '~/utils/fetch/useFetchFraApi';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

/*
TODO - se på å bruke dette som validering av formet istedenfor det vi har nå
const useCustomValidering = (valideringscontext: { tillattAntallDager: number }) =>
    React.useCallback(async (data: MeldekortBehandlingForm) => {
        return {
            data: data,
            errors: {},
        };
    }, []);
*/

export const MeldekortUtfylling = ({ meldekortBehandling }: Props) => {
    const [valideringsFeil, setValideringsFeil] = useState('');

    const { meldeperiodeKjede, tidligereMeldekortBehandlinger, sisteMeldeperiode } =
        useMeldeperiodeKjede();
    const { sakId, saksnummer } = useSak().sak;
    const brukersMeldekortForBehandling =
        meldeperiodeKjede.brukersMeldekort.find(
            (b) => b.id === meldekortBehandling.brukersMeldekortId,
        ) ?? meldeperiodeKjede.brukersMeldekort.at(-1); // Bruk siste brukers meldekort som fallback

    const { antallDager } = sisteMeldeperiode;

    const formContext = useForm<MeldekortBehandlingForm>({
        mode: 'onSubmit',
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

    const customValidering = () => {
        if (tellDagerMedDeltattEllerFravær(formContext.getValues().dager) > antallDager) {
            setValideringsFeil(
                `For mange dager utfylt - Maks ${antallDager} dager med tiltak for denne perioden.`,
            );
            return false;
        }

        setValideringsFeil('');
        return true;
    };

    const forhåndsvisBrev = useFetchBlobFraApi<ForhåndsvisMeldekortbehandlingBrevRequest>(
        `/sak/${sakId}/meldekortbehandling/${meldekortBehandling.id}/forhandsvis`,
        'POST',
    );

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
            <form>
                <VStack gap={'5'}>
                    <MeldekortUker dager={formContext.getValues().dager} underBehandling={true} />
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
                                        console.log(blob);
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
                        {valideringsFeil && (
                            <Alert variant={'error'} size={'small'}>
                                <BodyShort weight={'semibold'} size={'small'}>
                                    {'Feil i utfyllingen'}
                                </BodyShort>
                                <BodyShort size={'small'}>{valideringsFeil}</BodyShort>
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
                                    customValidering={customValidering}
                                />
                                <MeldekortSendTilBeslutning
                                    meldekortId={meldekortBehandling.id}
                                    sakId={sakId}
                                    hentMeldekortUtfylling={hentMeldekortUtfylling}
                                    customValidering={customValidering}
                                    saksnummer={saksnummer}
                                />
                            </HStack>
                        </HStack>
                    </VStack>
                </VStack>
            </form>
        </FormProvider>
    );
};
