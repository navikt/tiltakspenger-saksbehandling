import { MeldekortKorrigertTilPåfølgendePerioder } from './korrigert-til-påfølgende/MeldekortKorrigertTilPåfølgendePerioder';
import { MeldekortBeløp } from '../beløp/MeldekortBeløp';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
} from '../../../../types/meldekort/MeldekortBehandling';
import { useMeldeperiodeKjede } from '../../MeldeperiodeKjedeContext';
import { VStack } from '@navikt/ds-react';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
    className?: string;
};

export const MeldekortBeregningOppsummering = ({ meldekortBehandling, className }: Props) => {
    const { finnForrigeMeldekortBehandling } = useMeldeperiodeKjede();
    const { beregning, utbetalingsstatus, navkontor, navkontorNavn } = meldekortBehandling;

    if (!beregning) {
        return null;
    }

    const forrigeBeregning = finnForrigeMeldekortBehandling(meldekortBehandling.id)?.beregning;

    return (
        <VStack gap={'5'} className={className}>
            <MeldekortKorrigertTilPåfølgendePerioder
                beregninger={beregning.beregningerForPåfølgendePerioder}
            />
            <MeldekortBeløp
                beløp={beregning.beregningForMeldekortetsPeriode.beløp}
                forrigeBeløp={forrigeBeregning?.beregningForMeldekortetsPeriode.beløp}
                totalBeløp={beregning.totalBeløp}
                utbetalingsstatus={
                    meldekortBehandling.status === MeldekortBehandlingStatus.GODKJENT
                        ? utbetalingsstatus
                        : undefined
                }
                navkontorForUtbetaling={
                    navkontorNavn ? `${navkontorNavn} (${navkontor})` : navkontor
                }
            />
        </VStack>
    );
};
