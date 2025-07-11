import { Alert, BodyShort, HStack, VStack } from '@navikt/ds-react';
import { useSak } from '../../../../../context/sak/SakContext';
import {
    hentMeldekortForhåndsutfylling,
    MeldekortBehandlingForm,
    tellDagerMedDeltattEllerFravær,
} from './meldekortUtfyllingUtils';
import { FormProvider, useForm } from 'react-hook-form';
import { useMeldeperiodeKjede } from '../../../MeldeperiodeKjedeContext';
import {
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingDTO,
    MeldekortBehandlingProps,
} from '../../../../../types/meldekort/MeldekortBehandling';
import { MeldekortUker } from '../../../0-felles-komponenter/uker/MeldekortUker';
import { MeldekortUtfyllingLagre } from './lagre/MeldekortUtfyllingLagre';
import { MeldekortSendTilBeslutning } from '../beslutning/MeldekortSendTilBeslutning';
import React, { useEffect, useState } from 'react';
import { MeldekortBeregningOppsummering } from '../../../0-felles-komponenter/beregning-oppsummering/MeldekortBeregningOppsummering';
import { classNames } from '../../../../../utils/classNames';
import { MeldekortBegrunnelse } from '../../../0-felles-komponenter/begrunnelse/MeldekortBegrunnelse';
import AvsluttMeldekortBehandling from '../../../../saksoversikt/meldekort-oversikt/avsluttMeldekortBehandling/AvsluttMeldekortBehandling';
import { meldeperiodeUrl } from '../../../../../utils/urls';

import styles from './MeldekortUtfylling.module.css';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortUtfylling = ({ meldekortBehandling }: Props) => {
    const [valideringsFeil, setValideringsFeil] = useState('');

    const { meldeperiodeKjede, tidligereMeldekortBehandlinger, sisteMeldeperiode } =
        useMeldeperiodeKjede();
    const { sakId, saksnummer } = useSak().sak;
    const { brukersMeldekort } = meldeperiodeKjede;
    const { antallDager } = sisteMeldeperiode;

    const formContext = useForm<MeldekortBehandlingForm>({
        mode: 'onSubmit',
        defaultValues: {
            dager: hentMeldekortForhåndsutfylling(
                meldekortBehandling,
                tidligereMeldekortBehandlinger,
                sisteMeldeperiode,
                brukersMeldekort,
            ),
            begrunnelse: meldekortBehandling.begrunnelse,
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

    useEffect(() => {
        formContext.reset({
            dager: hentMeldekortForhåndsutfylling(
                meldekortBehandling,
                tidligereMeldekortBehandlinger,
                sisteMeldeperiode,
                brukersMeldekort,
            ),
            begrunnelse: meldekortBehandling.begrunnelse,
        });
    }, [meldekortBehandling, tidligereMeldekortBehandlinger, brukersMeldekort]);

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
                    <MeldekortBeregningOppsummering
                        meldekortBehandling={meldekortBehandling}
                        className={classNames(skjemaErEndret && styles.utdatertBeregning)}
                    />
                    <MeldekortBegrunnelse
                        defaultValue={meldekortBehandling.begrunnelse}
                        onChange={(event) => {
                            formContext.setValue('begrunnelse', event.target.value);
                        }}
                    />
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
                            />
                            <AvsluttMeldekortBehandling
                                sakId={sakId}
                                meldekortBehandlingId={meldekortBehandling.id}
                                saksoversiktUrl={meldeperiodeUrl(
                                    saksnummer,
                                    meldekortBehandling.periode,
                                )}
                            />
                        </HStack>
                    </VStack>
                </VStack>
            </form>
        </FormProvider>
    );
};
