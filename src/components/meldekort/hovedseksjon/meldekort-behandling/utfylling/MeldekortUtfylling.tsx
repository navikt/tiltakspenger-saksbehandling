import { Alert, BodyShort, HStack, VStack } from '@navikt/ds-react';
import { useSak } from '../../../../../context/sak/SakContext';
import {
    hentMeldekortForhåndsutfylling,
    MeldekortBehandlingForm,
    tellDagerMedDeltattEllerFravær,
} from './meldekortUtfyllingUtils';
import { FormProvider, useForm } from 'react-hook-form';
import { useMeldeperiodeKjede } from '../../../context/MeldeperiodeKjedeContext';
import {
    MeldekortBehandlingDTO,
    MeldekortBehandlingProps,
} from '../../../../../types/meldekort/MeldekortBehandling';
import { MeldekortUker } from '../../uker/MeldekortUker';
import { MeldekortLagreOgBeregn } from '../lagre-og-beregn/MeldekortLagreOgBeregn';
import { MeldekortSendTilBeslutning } from '../beslutning/MeldekortSendTilBeslutning';
import { useEffect, useState } from 'react';
import { MeldekortBeregningOppsummering } from '../beregning-oppsummering/MeldekortBeregningOppsummering';
import { classNames } from '../../../../../utils/classNames';
import { MeldekortBegrunnelse } from '../begrunnelse/MeldekortBegrunnelse';

import styles from './MeldekortUtfylling.module.css';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortUtfylling = ({ meldekortBehandling }: Props) => {
    const [valideringsFeil, setValideringsFeil] = useState('');

    const { meldeperiodeKjede, tidligereMeldekortBehandlinger, sisteMeldeperiode } =
        useMeldeperiodeKjede();
    const { sakId } = useSak().sak;
    const { brukersMeldekort } = meldeperiodeKjede;
    const { antallDager } = sisteMeldeperiode;

    const formContext = useForm<MeldekortBehandlingForm>({
        mode: 'onSubmit',
        defaultValues: {
            dager: hentMeldekortForhåndsutfylling(
                meldekortBehandling,
                tidligereMeldekortBehandlinger,
                brukersMeldekort,
            ),
            begrunnelse: meldekortBehandling.begrunnelse,
        },
    });

    const skjemaErIkkeBeregnet = formContext.formState.isDirty;

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
                brukersMeldekort,
            ),
            begrunnelse: meldekortBehandling.begrunnelse,
        });
    }, [meldekortBehandling]);

    return (
        <FormProvider {...formContext}>
            <form>
                <VStack gap={'5'}>
                    <MeldekortUker dager={formContext.getValues().dager} underBehandling={true} />
                    {skjemaErIkkeBeregnet && (
                        <Alert inline={true} variant={'warning'}>
                            {'Beregningen er utdatert - trykk lagre for å oppdatere'}
                        </Alert>
                    )}
                    <MeldekortBeregningOppsummering
                        meldekortBehandling={meldekortBehandling}
                        visUtbetalingsstatus={false}
                        className={classNames(skjemaErIkkeBeregnet && styles.utdatertBeregning)}
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
                        <HStack justify={'space-between'} className={styles.knapper}>
                            <MeldekortLagreOgBeregn
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
                        </HStack>
                    </VStack>
                </VStack>
            </form>
        </FormProvider>
    );
};
