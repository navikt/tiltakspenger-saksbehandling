import { BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { UtbetalingBeløp } from '~/lib/_felles/utbetaling/beløp/UtbetalingBeløp';
import {
    SimuleringResultat,
    SimulertBeregning,
} from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { OppdaterSimuleringKnapp } from '~/lib/beregning-og-simulering/oppdater-simulering/OppdaterSimuleringKnapp';
import { SimuleringsflaggVarsler } from '~/lib/beregning-og-simulering/flagg/SimuleringsflaggVarsler';
import { BehandlingId } from '~/lib/behandling-felles/typer/BehandlingFelles';

import style from './SimuleringOppsummering.module.css';

type Props = {
    simulertBeregning: SimulertBeregning;
    visOppdaterKnapp: boolean;
    behandlingId: BehandlingId;
};

export const SimuleringOppsummering = ({
    simulertBeregning,
    visOppdaterKnapp,
    behandlingId,
}: Props) => {
    const { simuleringResultat, simulerteBeløp } = simulertBeregning;

    const oppdaterKnapp = visOppdaterKnapp && (
        <OppdaterSimuleringKnapp behandlingId={behandlingId} />
    );

    if (simuleringResultat === SimuleringResultat.IKKE_SIMULERT) {
        return (
            <Infokort variant={'advarsel'} className={style.varsel}>
                <BodyShort>{'Simulering mangler!'}</BodyShort>
                {oppdaterKnapp}
            </Infokort>
        );
    }

    if (simuleringResultat === SimuleringResultat.INGEN_ENDRING) {
        return (
            <Infokort variant={'info'} className={style.varsel}>
                <BodyShort>{'Simulering viser ingen endring i utbetalingen'}</BodyShort>
                {oppdaterKnapp}
            </Infokort>
        );
    }

    if (!simulerteBeløp) {
        return (
            <Infokort variant={'advarsel'} className={style.varsel}>
                <BodyShort>{'Simuleringen har ingen simulerte beløp'}</BodyShort>
                {oppdaterKnapp}
            </Infokort>
        );
    }

    const {
        tidligereUtbetaling,
        nyUtbetaling,
        etterbetaling,
        feilutbetaling,
        totalJustering,
        totalTrekk,
    } = simulerteBeløp;

    return (
        <VStack gap={'space-4'}>
            <HStack gap={'space-20'} justify={'space-between'}>
                <Heading size={'xsmall'} level={'4'} spacing={true}>
                    {'Simulering oppsummert'}
                </Heading>
                {oppdaterKnapp}
            </HStack>
            <SimuleringsflaggVarsler
                flagg={simulertBeregning.meldeperioder.map((meldeperiode) => meldeperiode.flagg)}
            />
            <UtbetalingBeløp
                tekst={'Nytt beløp for endrede dager'}
                beløp={nyUtbetaling}
                beløpForrige={tidligereUtbetaling}
            />
            <UtbetalingBeløp
                tekst={'Tidligere utbetalt for endrede dager'}
                beløp={tidligereUtbetaling}
            />
            {feilutbetaling !== 0 && (
                <UtbetalingBeløp tekst={'Feilutbetaling'} beløp={feilutbetaling} />
            )}
            {etterbetaling !== 0 && (
                <UtbetalingBeløp tekst={'Etterbetaling'} beløp={etterbetaling} />
            )}
            {totalJustering !== 0 && <UtbetalingBeløp tekst={'Justering'} beløp={totalJustering} />}
            {totalTrekk !== 0 && <UtbetalingBeløp tekst={'Trekk'} beløp={totalTrekk} />}
        </VStack>
    );
};
