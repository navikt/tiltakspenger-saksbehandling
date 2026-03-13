import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { SimuleringDetaljer } from '~/components/beregning-og-simulering/detaljer/SimuleringDetaljer';
import { Separator } from '~/components/separator/Separator';
import { SimuleringOppsummering } from '~/components/beregning-og-simulering/simulering-oppsummering/SimuleringOppsummering';
import { BeregningOppsummering } from '~/components/beregning-og-simulering/beregning-oppsummering/BeregningOppsummering';
import { BeregningOgSimuleringHeader } from '~/components/beregning-og-simulering/header/BeregningOgSimuleringHeader';
import { kanSaksbehandleForBehandling } from '~/utils/tilganger';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { Rammebehandling, Rammebehandlingsstatus } from '~/types/Rammebehandling';
import { formaterTidspunkt } from '~/utils/date';
import {
    BehandlingUtbetalingProps,
    UtbetalingskontrollMedEndring,
    UtbetalingskontrollStatus,
} from '~/types/Utbetaling';
import { PartialRecord } from '~/types/UtilTypes';
import { OppdaterSimuleringKnapp } from '~/components/beregning-og-simulering/oppdater-simulering/OppdaterSimuleringKnapp';
import { TilbakekrevingOppsummering } from '~/components/tilbakekreving/TilbakekrevingOppsummering';

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
            {utbetaling ? (
                <BeregningOgSimuleringSeksjon behandling={behandling} utbetaling={utbetaling} />
            ) : (
                <UtenBeregnetUtbetaling />
            )}
            <Separator />
            {harUtbetalingskontrollMedEndringer && (
                <>
                    <UtbetalingskontrollSeksjon
                        utbetalingskontroll={utbetalingskontroll}
                        behandlingsstatus={behandling.status}
                    />
                    <Separator />
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
    const { setBehandling } = useBehandling();
    const { innloggetSaksbehandler } = useSaksbehandler();

    const { status, utbetalingskontroll, tilbakekrevingId } = behandling;

    const {
        simulertBeregning,
        status: utbetalingsstatus,
        navkontor,
        navkontorNavn,
        kanIkkeIverksetteUtbetaling,
    } = utbetaling;

    const { beregning, simuleringstidspunkt } = simulertBeregning;

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
                        erOmberegning={true}
                    />

                    <BeregningOppsummering beregninger={beregning} />

                    <SimuleringOppsummering
                        simulertBeregning={simulertBeregning}
                        behandlingId={behandling.id}
                        oppdaterBehandlingEllerKjede={(behandling) =>
                            setBehandling(behandling as Rammebehandling)
                        }
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
                    <Alert variant={'info'} inline={true}>
                        {'Ikke simulert'}
                    </Alert>
                )}

                {utbetalingskontroll && (
                    <AlertMedTidspunkt
                        tekst={`Kontroll-simulering sist utført (${utbetalingskontrollStatusTekst[utbetalingskontroll.status]})`}
                        tidspunkt={utbetalingskontroll.tidspunkt}
                    />
                )}
            </VedtakSeksjon.Høyre>

            <VedtakSeksjon.FullBredde className={style.detaljer}>
                <SimuleringDetaljer simulertBeregning={simulertBeregning} />
            </VedtakSeksjon.FullBredde>
        </VedtakSeksjon>
    );
};

const UtenBeregnetUtbetaling = () => {
    const { behandling, setBehandling } = useBehandling();

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre gap={'space-16'}>
                <Alert variant={'info'} inline={true}>
                    {'Ingen beregning/simulering av utbetaling tilgjengelig'}
                </Alert>
                <OppdaterSimuleringKnapp
                    behandlingId={behandling.id}
                    oppdaterBehandlingEllerKjede={setBehandling}
                />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};

type KontrollProps = {
    utbetalingskontroll: UtbetalingskontrollMedEndring;
    behandlingsstatus: Rammebehandlingsstatus;
};

const UtbetalingskontrollSeksjon = ({ utbetalingskontroll, behandlingsstatus }: KontrollProps) => {
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
                />
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Høyre>
                <AlertMedTidspunkt
                    tekst={'Kontroll-simulering sist utført:'}
                    tidspunkt={tidspunkt}
                />
            </VedtakSeksjon.Høyre>

            <VedtakSeksjon.FullBredde className={style.detaljer}>
                <SimuleringDetaljer simulertBeregning={simulertBeregning} />
            </VedtakSeksjon.FullBredde>
        </VedtakSeksjon>
    );
};

type AlertMedTidspunktProps = {
    tekst: string;
    tidspunkt: string;
};

const AlertMedTidspunkt = ({ tekst, tidspunkt }: AlertMedTidspunktProps) => {
    return (
        <Alert variant={'info'} inline={true}>
            <BodyShort>{tekst}</BodyShort>
            <BodyShort weight={'semibold'}>{formaterTidspunkt(tidspunkt)}</BodyShort>
        </Alert>
    );
};

const behandlingsstatusTekst: PartialRecord<Rammebehandlingsstatus, string> = {
    [Rammebehandlingsstatus.UNDER_BEHANDLING]:
        'Behandlingen må simuleres på nytt og utbetalingen må vurderes på nytt før den sendes til beslutning.',
    [Rammebehandlingsstatus.UNDER_BESLUTNING]:
        'Behandlingen må underkjennes og saksbehandler må vurdere utbetalingen på nytt.',
} as const;

const utbetalingskontrollStatusTekst: Record<UtbetalingskontrollStatus, string> = {
    [UtbetalingskontrollStatus.ENDRET]: 'med endringer',
    [UtbetalingskontrollStatus.UENDRET]: 'uten endringer',
    [UtbetalingskontrollStatus.UTDATERT]: 'utdatert',
} as const;
