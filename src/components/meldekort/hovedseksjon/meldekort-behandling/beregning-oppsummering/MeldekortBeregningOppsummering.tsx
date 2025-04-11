import { MeldekortKorrigertTilPåfølgendePerioder } from '../korrigert-til-påfølgende/MeldekortKorrigertTilPåfølgendePerioder';
import { MeldekortBeløp } from '../beløp/MeldekortBeløp';
import { MeldekortBehandlingProps } from '../../../../../types/meldekort/MeldekortBehandling';
import { useMeldeperiodeKjede } from '../../../context/MeldeperiodeKjedeContext';
import { VStack } from '@navikt/ds-react';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
    visUtbetalingsstatus?: boolean;
    className?: string;
};

export const MeldekortBeregningOppsummering = ({
    meldekortBehandling,
    visUtbetalingsstatus = true,
    className,
}: Props) => {
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
                utbetalingsstatus={visUtbetalingsstatus ? utbetalingsstatus : undefined}
                navkontorForUtbetaling={
                    navkontorNavn ? `${navkontorNavn} (${navkontor})` : navkontor
                }
            />
        </VStack>
    );
};
