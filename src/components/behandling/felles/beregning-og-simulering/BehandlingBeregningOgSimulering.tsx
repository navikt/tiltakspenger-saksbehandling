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
import {
    BehandlingUtbetalingProps,
    Rammebehandling,
    Rammebehandlingsstatus,
} from '~/types/Rammebehandling';
import { formaterTidspunkt } from '~/utils/date';
import { UtbetalingskontrollMedEndring } from '~/types/Utbetaling';
import { PartialRecord } from '~/types/UtilTypes';

import style from './BehandlingBeregningOgSimulering.module.css';

export const BehandlingBeregningOgSimulering = () => {
    const { behandling } = useBehandling();
    const { utbetaling, utbetalingskontroll } = behandling;

    if (!utbetaling && !utbetalingskontroll?.harEndringer) {
        return null;
    }

    return (
        <>
            {utbetaling && (
                <BeregningOgSimuleringSeksjon behandling={behandling} utbetaling={utbetaling} />
            )}
            {utbetalingskontroll?.harEndringer && (
                <UtbetalingskontrollEndring
                    utbetalingskontroll={utbetalingskontroll}
                    behandlingsstatus={behandling.status}
                />
            )}
            <Separator />
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

    const { status, utbetalingskontroll } = behandling;

    const { simulertBeregning, status: utbetalingsstatus, navkontor, navkontorNavn } = utbetaling;
    const { beregning, simuleringstidspunkt } = simulertBeregning;

    return (
        <VedtakSeksjon>
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
                <Alert variant={'info'} inline={true}>
                    <BodyShort>{`Simulering sist utført`}</BodyShort>
                    <BodyShort weight={'semibold'}>
                        {simuleringstidspunkt
                            ? formaterTidspunkt(simuleringstidspunkt)
                            : 'ikke simulert'}
                    </BodyShort>
                </Alert>

                {utbetalingskontroll && (
                    <Alert variant={'info'} inline={true}>
                        <BodyShort>{`Kontroll-simulering sist utført (${utbetalingskontroll.harEndringer ? 'med' : 'uten'} endring)`}</BodyShort>
                        <BodyShort weight={'semibold'}>
                            {formaterTidspunkt(utbetalingskontroll.tidspunkt)}
                        </BodyShort>
                    </Alert>
                )}
            </VedtakSeksjon.Høyre>

            <VedtakSeksjon.FullBredde className={style.detaljer}>
                <SimuleringDetaljer simulertBeregning={simulertBeregning} />
            </VedtakSeksjon.FullBredde>
        </VedtakSeksjon>
    );
};

type KontrollProps = {
    utbetalingskontroll: UtbetalingskontrollMedEndring;
    behandlingsstatus: Rammebehandlingsstatus;
};

const UtbetalingskontrollEndring = ({
    utbetalingskontroll,
    behandlingsstatus,
}: KontrollProps) => {
    const { tidspunkt, simulertBeregning } = utbetalingskontroll;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre gap={'space-16'}>
                <Heading size={'small'} level={'4'}>
                    {'Kontroll-simuleringen'}
                </Heading>

                <Alert variant={'error'} size={'small'}>
                    {'Kontroll-simuleringen viser endring i beregnet utbetaling for behandlingen. '}
                    {behandlingsstatusTekst[behandlingsstatus]}
                </Alert>

                <SimuleringOppsummering
                    simulertBeregning={simulertBeregning}
                    visOppdaterKnapp={false}
                />
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Høyre>
                <Alert
                    variant={'info'}
                    inline={true}
                >{`Kontroll-simulering utført: ${formaterTidspunkt(tidspunkt)}`}</Alert>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};

const behandlingsstatusTekst: PartialRecord<Rammebehandlingsstatus, string> = {
    [Rammebehandlingsstatus.UNDER_BEHANDLING]:
        'Behandlingen må simuleres på nytt og utbetalingen må vurderes på nytt før den sendes til beslutning.',
    [Rammebehandlingsstatus.UNDER_BESLUTNING]:
        'Behandlingen må underkjennes og saksbehandler må vurdere utbetalingen på nytt.',
};
