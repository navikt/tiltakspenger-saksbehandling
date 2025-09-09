import { HStack, VStack } from '@navikt/ds-react';
import { Simulering } from '~/types/Simulering';
import { BeløpProps } from '~/types/Beregning';
import {
    UtbetalingStatus,
    UtbetalingStatusProps,
} from '~/components/utbetaling/status/UtbetalingStatus';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';

import { Simuleringsknapp } from '~/components/behandling/felles/utbetaling/Simulering';
import { SakId } from '~/types/SakTypes';
import {
    MeldekortBehandlingId,
    MeldekortBehandlingStatus,
} from '~/types/meldekort/MeldekortBehandling';
import { OppdaterSimuleringKnapp } from '~/components/behandling/felles/utbetaling/OppdaterSimuleringKnapp';

type Props = {
    beløp: BeløpProps;
    forrigeBeløp?: BeløpProps;
    totalBeløp?: BeløpProps;
    simulering?: Simulering;
    utbetalingStatusProps?: UtbetalingStatusProps;
    sakId: SakId;
    meldekortbehandlingId: MeldekortBehandlingId;
    behandlingsstatus?: MeldekortBehandlingStatus;
};

export const MeldekortBeløp = ({
    beløp,
    forrigeBeløp,
    totalBeløp,
    simulering,
    utbetalingStatusProps,
    sakId,
    meldekortbehandlingId,
    behandlingsstatus,
}: Props) => {
    const harDiffPåTotalBeløp = totalBeløp && totalBeløp.totalt != beløp.totalt;

    return (
        <>
            <VStack gap={'1'}>
                <UtbetalingBeløp
                    tekst={'Ordinært beløp for perioden:'}
                    beløp={beløp.ordinært}
                    beløpForrige={forrigeBeløp?.ordinært}
                />
                <UtbetalingBeløp
                    tekst={'Barnetillegg beløp for perioden:'}
                    beløp={beløp.barnetillegg}
                    beløpForrige={forrigeBeløp?.barnetillegg}
                />
                <UtbetalingBeløp
                    tekst={'Totalt beløp for perioden:'}
                    beløp={beløp.totalt}
                    beløpForrige={forrigeBeløp?.totalt}
                />
                {harDiffPåTotalBeløp && (
                    <UtbetalingBeløp
                        tekst={'Totalt beløp beregnet for meldekortet:'}
                        beløp={totalBeløp.totalt}
                    />
                )}
            </VStack>
            <HStack>
                {simulering && <Simuleringsknapp simulering={simulering} />}
                {behandlingsstatus === MeldekortBehandlingStatus.UNDER_BEHANDLING && (
                    <OppdaterSimuleringKnapp sakId={sakId} behandlingId={meldekortbehandlingId} />
                )}
            </HStack>
            {utbetalingStatusProps && <UtbetalingStatus {...utbetalingStatusProps} />}
        </>
    );
};
