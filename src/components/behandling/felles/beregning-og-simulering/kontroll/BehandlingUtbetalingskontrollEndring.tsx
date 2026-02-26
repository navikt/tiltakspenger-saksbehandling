import { UtbetalingskontrollMedEndring } from '~/types/Utbetaling';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { SimuleringOppsummering } from '~/components/beregning-og-simulering/simulering-oppsummering/SimuleringOppsummering';
import { Alert, Heading } from '@navikt/ds-react';
import { formaterTidspunkt } from '~/utils/date';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';
import { PartialRecord } from '~/types/UtilTypes';

type Props = {
    utbetalingskontroll: UtbetalingskontrollMedEndring;
    behandlingsstatus: Rammebehandlingsstatus;
};

export const BehandlingUtbetalingskontrollEndring = ({
    utbetalingskontroll,
    behandlingsstatus,
}: Props) => {
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
