import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/meldekortbehandling/layout/MeldekortbehandlingSeksjon';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
    MeldeperiodebehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { BeregningOppsummering } from '~/lib/beregning-og-simulering/beregning-oppsummering/BeregningOppsummering';
import { SimuleringOppsummering } from '~/lib/beregning-og-simulering/simulering-oppsummering/SimuleringOppsummering';
import { SimulertBeregningDetaljerTabell } from '~/lib/beregning-og-simulering/detaljer/SimulertBeregningDetaljer';
import { BeregningOgSimuleringHeader } from '~/lib/beregning-og-simulering/header/BeregningOgSimuleringHeader';
import { Alert, Heading, HStack, VStack } from '@navikt/ds-react';
import { OppdaterSimuleringKnapp } from '~/lib/beregning-og-simulering/oppdater-simulering/OppdaterSimuleringKnapp';
import { erMeldekortbehandlingGodkjent } from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { SimulertBeregning } from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { UtbetalingskontrollMedEndring, UtbetalingskontrollStatus } from '~/types/Utbetaling';
import { AlertMedTidspunkt } from '~/lib/beregning-og-simulering/utbetalingskontroll/AlertMedTidspunkt';
import { KontrollsimuleringUtførtAlert } from '~/lib/beregning-og-simulering/utbetalingskontroll/KontrollsimuleringUtførtAlert';
import { PartialRecord } from '~/types/UtilTypes';

import style from './MeldekortbehandlingBeregningOgSimulering.module.css';

export const MeldekortbehandlingBeregningOgSimulering = () => {
    const meldekortbehandling = useMeldekortbehandling();
    const { simulertBeregning, utbetalingskontroll, status, id } = meldekortbehandling;

    const harUtbetalingskontrollMedEndringer =
        utbetalingskontroll?.status === UtbetalingskontrollStatus.ENDRET;

    return (
        <VStack gap={'space-32'}>
            {simulertBeregning ? (
                <BeregningOgSimuleringSeksjon
                    meldekortbehandling={meldekortbehandling}
                    simulertBeregning={simulertBeregning}
                />
            ) : (
                <Infokort>
                    {'Beregning mangler. Behandlingen må lagres med gyldige data for å beregnes.'}
                </Infokort>
            )}

            {harUtbetalingskontrollMedEndringer && (
                <UtbetalingskontrollSeksjon
                    utbetalingskontroll={utbetalingskontroll}
                    behandlingsstatus={status}
                    behandlingId={id}
                />
            )}
        </VStack>
    );
};

type BeregningOgSimuleringSeksjonProps = {
    meldekortbehandling: MeldekortbehandlingProps;
    simulertBeregning: SimulertBeregning;
};

const BeregningOgSimuleringSeksjon = ({
    meldekortbehandling,
    simulertBeregning,
}: BeregningOgSimuleringSeksjonProps) => {
    const { erReadonly } = useMeldekortbehandlingSkjema();

    const {
        id,
        utbetalingsstatus,
        navkontorNavn,
        navkontor,
        kanIkkeIverksetteUtbetaling,
        kanIkkeIverksetteUtbetalingMelding,
        meldeperioder,
        utbetalingskontroll,
    } = meldekortbehandling;

    const { beregning } = simulertBeregning;

    const erIverksatt = erMeldekortbehandlingGodkjent(meldekortbehandling);

    const harKorrigering = meldeperioder.some(
        (it) => it.type === MeldeperiodebehandlingType.KORRIGERING,
    );

    return (
        <MeldekortbehandlingSeksjon gap={'space-24'}>
            <MeldekortbehandlingSeksjon.FullBredde className={style.heading}>
                <HStack justify={'space-between'}>
                    <Heading level={'2'} size={'medium'}>
                        {'Beregning og simulering'}
                    </Heading>
                    {!erReadonly && <OppdaterSimuleringKnapp behandlingId={id} />}
                </HStack>
            </MeldekortbehandlingSeksjon.FullBredde>

            <MeldekortbehandlingSeksjon.Venstre gap={'space-32'}>
                <BeregningOppsummering beregninger={beregning} />
                <SimuleringOppsummering
                    simulertBeregning={simulertBeregning}
                    behandlingId={id}
                    visOppdaterKnapp={false}
                />
            </MeldekortbehandlingSeksjon.Venstre>

            <MeldekortbehandlingSeksjon.Høyre gap={'space-24'}>
                <VStack gap={'space-16'}>
                    <BeregningOgSimuleringHeader
                        utbetalingsstatus={erIverksatt ? utbetalingsstatus : undefined}
                        navkontor={navkontor}
                        navkontorNavn={navkontorNavn}
                        simulertBeregning={simulertBeregning}
                        kanIkkeIverksetteUtbetaling={kanIkkeIverksetteUtbetaling}
                        kanIkkeIverksetteUtbetalingMelding={kanIkkeIverksetteUtbetalingMelding}
                        erOmberegning={harKorrigering}
                    />

                    {utbetalingskontroll && (
                        <KontrollsimuleringUtførtAlert utbetalingskontroll={utbetalingskontroll} />
                    )}
                </VStack>

                <VStack>
                    <Heading level={'4'} size={'small'} spacing={true}>
                        {'Detaljer'}
                    </Heading>

                    <SimulertBeregningDetaljerTabell simulertBeregning={simulertBeregning} />
                </VStack>
            </MeldekortbehandlingSeksjon.Høyre>
        </MeldekortbehandlingSeksjon>
    );
};

type KontrollProps = {
    utbetalingskontroll: UtbetalingskontrollMedEndring;
    behandlingsstatus: MeldekortbehandlingStatus;
    behandlingId: MeldekortbehandlingId;
};

const UtbetalingskontrollSeksjon = ({
    utbetalingskontroll,
    behandlingsstatus,
    behandlingId,
}: KontrollProps) => {
    const { tidspunkt, simulertBeregning } = utbetalingskontroll;

    return (
        <MeldekortbehandlingSeksjon gap={'space-24'} className={style.kontrollMedEndring}>
            <MeldekortbehandlingSeksjon.FullBredde className={style.heading}>
                <Heading level={'2'} size={'medium'}>
                    {'Kontroll-simulering'}
                </Heading>
            </MeldekortbehandlingSeksjon.FullBredde>

            <MeldekortbehandlingSeksjon.Venstre gap={'space-32'}>
                <Alert variant={'error'} size={'small'}>
                    {'Kontroll-simuleringen viser endring i beregnet utbetaling for behandlingen. '}
                    {behandlingsstatusTekst[behandlingsstatus]}
                </Alert>

                <BeregningOppsummering beregninger={simulertBeregning.beregning} />

                <SimuleringOppsummering
                    simulertBeregning={simulertBeregning}
                    behandlingId={behandlingId}
                    visOppdaterKnapp={false}
                />
            </MeldekortbehandlingSeksjon.Venstre>

            <MeldekortbehandlingSeksjon.Høyre gap={'space-24'}>
                <AlertMedTidspunkt
                    tekst={'Kontroll-simulering sist utført:'}
                    tidspunkt={tidspunkt}
                />

                <VStack>
                    <Heading level={'4'} size={'small'} spacing={true}>
                        {'Detaljer'}
                    </Heading>

                    <SimulertBeregningDetaljerTabell simulertBeregning={simulertBeregning} />
                </VStack>
            </MeldekortbehandlingSeksjon.Høyre>
        </MeldekortbehandlingSeksjon>
    );
};

const behandlingsstatusTekst: PartialRecord<MeldekortbehandlingStatus, string> = {
    [MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING]:
        'Behandlingen må simuleres på nytt og utbetalingen må vurderes på nytt før den sendes til beslutning.',
    [MeldekortbehandlingStatus.UNDER_BEHANDLING]:
        'Behandlingen må simuleres på nytt og utbetalingen må vurderes på nytt før den sendes til beslutning.',
    [MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING]:
        'Behandlingen må underkjennes og saksbehandler må vurdere utbetalingen på nytt.',
    [MeldekortbehandlingStatus.UNDER_BESLUTNING]:
        'Behandlingen må underkjennes og saksbehandler må vurdere utbetalingen på nytt.',
} as const;
