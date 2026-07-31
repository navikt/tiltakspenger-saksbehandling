import { Alert, Heading, VStack } from '@navikt/ds-react';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { SimulertBeregningDetaljer } from '~/lib/beregning-og-simulering/detaljer/SimulertBeregningDetaljer';
import { Separator } from '~/lib/_felles/separator/Separator';
import { SimuleringOppsummering } from '~/lib/beregning-og-simulering/simulering-oppsummering/SimuleringOppsummering';
import { BeregningOppsummering } from '~/lib/beregning-og-simulering/beregning-oppsummering/BeregningOppsummering';
import { BeregningOgSimuleringHeader } from '~/lib/beregning-og-simulering/header/BeregningOgSimuleringHeader';
import { kanSaksbehandleForBehandling } from '~/lib/saksbehandler/tilganger';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import {
    Rammebehandling,
    RammebehandlingId,
    Rammebehandlingsstatus,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    BehandlingUtbetalingProps,
    UtbetalingskontrollMedEndring,
    UtbetalingskontrollStatus,
} from '~/types/Utbetaling';
import { AlertMedTidspunkt } from '~/lib/beregning-og-simulering/utbetalingskontroll/AlertMedTidspunkt';
import { KontrollsimuleringUtførtAlert } from '~/lib/beregning-og-simulering/utbetalingskontroll/KontrollsimuleringUtførtAlert';
import { PartialRecord } from '~/types/UtilTypes';
import { OppdaterSimuleringKnapp } from '~/lib/beregning-og-simulering/oppdater-simulering/OppdaterSimuleringKnapp';
import { TilbakekrevingOppsummering } from '~/lib/tilbakekreving/TilbakekrevingOppsummering';

import style from './BehandlingBeregningOgSimulering.module.css';

export const BehandlingBeregningOgSimulering = () => {
    const { behandling } = useBehandling();
    const { utbetaling, utbetalingskontroll } = behandling;

    const harUtbetalingskontrollMedEndringer =
        utbetalingskontroll?.status === UtbetalingskontrollStatus.ENDRET;

    if (!utbetaling && !harUtbetalingskontrollMedEndringer) {
        return null;
    }

    return (
        <>
            <Separator />
            {utbetaling ? (
                <BeregningOgSimuleringSeksjon behandling={behandling} utbetaling={utbetaling} />
            ) : (
                <UtenBeregnetUtbetaling />
            )}
            {harUtbetalingskontrollMedEndringer && (
                <>
                    <Separator />
                    <UtbetalingskontrollSeksjon
                        utbetalingskontroll={utbetalingskontroll}
                        behandlingsstatus={behandling.status}
                        behandlingId={behandling.id}
                    />
                </>
            )}
        </>
    );
};

type BeregningOgSimuleringSeksjonProps = {
    behandling: Rammebehandling;
    utbetaling: BehandlingUtbetalingProps;
};

const BeregningOgSimuleringSeksjon = ({
    behandling,
    utbetaling,
}: BeregningOgSimuleringSeksjonProps) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    const { status, utbetalingskontroll, tilbakekrevingId } = behandling;

    const {
        simulertBeregning,
        status: utbetalingsstatus,
        navkontor,
        navkontorNavn,
        kanIkkeIverksetteUtbetaling,
        kanIkkeIverksetteUtbetalingMelding,
    } = utbetaling;

    const { beregning, simuleringstidspunkt, beregningstidspunkt } = simulertBeregning;

    return (
        <VedtakSeksjon>
            {tilbakekrevingId && (
                <VedtakSeksjon.Venstre className={style.tilbakekreving}>
                    <TilbakekrevingOppsummering tilbakekrevingId={tilbakekrevingId} />
                </VedtakSeksjon.Venstre>
            )}

            <VedtakSeksjon.Venstre>
                <VStack gap={'space-20'}>
                    <BeregningOgSimuleringHeader
                        simulertBeregning={simulertBeregning}
                        navkontor={navkontor}
                        navkontorNavn={navkontorNavn}
                        utbetalingsstatus={
                            status === Rammebehandlingsstatus.VEDTATT
                                ? utbetalingsstatus
                                : undefined
                        }
                        kanIkkeIverksetteUtbetaling={kanIkkeIverksetteUtbetaling}
                        kanIkkeIverksetteUtbetalingMelding={kanIkkeIverksetteUtbetalingMelding}
                        erOmberegning={true}
                    />

                    <BeregningOppsummering beregninger={beregning} />

                    <SimuleringOppsummering
                        simulertBeregning={simulertBeregning}
                        behandlingId={behandling.id}
                        visOppdaterKnapp={kanSaksbehandleForBehandling(
                            behandling,
                            innloggetSaksbehandler,
                        )}
                    />
                </VStack>
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Høyre gap={'space-16'}>
                {simuleringstidspunkt ? (
                    <AlertMedTidspunkt
                        tekst={'Simulering sist utført'}
                        tidspunkt={simuleringstidspunkt}
                    />
                ) : (
                    <AlertMedTidspunkt
                        tekst={'Beregning sist utført (ikke simulert)'}
                        tidspunkt={beregningstidspunkt}
                    />
                )}

                {utbetalingskontroll && (
                    <KontrollsimuleringUtførtAlert utbetalingskontroll={utbetalingskontroll} />
                )}
            </VedtakSeksjon.Høyre>

            <VedtakSeksjon.FullBredde className={style.detaljer}>
                <SimulertBeregningDetaljer simulertBeregning={simulertBeregning} />
            </VedtakSeksjon.FullBredde>
        </VedtakSeksjon>
    );
};

const UtenBeregnetUtbetaling = () => {
    const { behandling } = useBehandling();

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre gap={'space-16'}>
                <Alert variant={'info'} inline={true}>
                    {'Ingen beregning/simulering av utbetaling tilgjengelig'}
                </Alert>
                <OppdaterSimuleringKnapp behandlingId={behandling.id} />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};

type KontrollProps = {
    utbetalingskontroll: UtbetalingskontrollMedEndring;
    behandlingsstatus: Rammebehandlingsstatus;
    behandlingId: RammebehandlingId;
};

const UtbetalingskontrollSeksjon = ({
    utbetalingskontroll,
    behandlingsstatus,
    behandlingId,
}: KontrollProps) => {
    const { tidspunkt, simulertBeregning } = utbetalingskontroll;

    return (
        <VedtakSeksjon className={style.kontrollMedEndring}>
            <VedtakSeksjon.Venstre gap={'space-16'}>
                <Heading size={'small'} level={'4'}>
                    {'Kontroll-simulering'}
                </Heading>

                <Alert variant={'error'} size={'small'}>
                    {'Kontroll-simuleringen viser endring i beregnet utbetaling for behandlingen. '}
                    {behandlingsstatusTekst[behandlingsstatus]}
                </Alert>

                <BeregningOppsummering beregninger={simulertBeregning.beregning} />

                <SimuleringOppsummering
                    simulertBeregning={simulertBeregning}
                    visOppdaterKnapp={false}
                    behandlingId={behandlingId}
                />
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Høyre>
                <AlertMedTidspunkt
                    tekst={'Kontroll-simulering sist utført:'}
                    tidspunkt={tidspunkt}
                />
            </VedtakSeksjon.Høyre>

            <VedtakSeksjon.FullBredde className={style.detaljer}>
                <SimulertBeregningDetaljer simulertBeregning={simulertBeregning} />
            </VedtakSeksjon.FullBredde>
        </VedtakSeksjon>
    );
};

const behandlingsstatusTekst: PartialRecord<Rammebehandlingsstatus, string> = {
    [Rammebehandlingsstatus.UNDER_BEHANDLING]:
        'Behandlingen må simuleres på nytt og utbetalingen må vurderes på nytt før den sendes til beslutning.',
    [Rammebehandlingsstatus.UNDER_BESLUTNING]:
        'Behandlingen må underkjennes og saksbehandler må vurdere utbetalingen på nytt.',
} as const;
