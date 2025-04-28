import { MeldekortKorrigertTilPåfølgendePerioder } from './korrigert-til-påfølgende/MeldekortKorrigertTilPåfølgendePerioder';
import { MeldekortBeløp } from '../beløp/MeldekortBeløp';
import { MeldekortBehandlingProps } from '../../../../types/meldekort/MeldekortBehandling';
import { useMeldeperiodeKjede } from '../../MeldeperiodeKjedeContext';
import { Alert, VStack } from '@navikt/ds-react';
import { useSaksbehandler } from '../../../../context/saksbehandler/SaksbehandlerContext';
import { kanBehandle } from '../../../../utils/tilganger';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
    className?: string;
};

export const MeldekortBeregningOppsummering = ({ meldekortBehandling, className }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { finnForrigeMeldekortBehandling, sisteMeldekortBehandling } = useMeldeperiodeKjede();
    const { beregning, utbetalingsstatus, navkontor, navkontorNavn, saksbehandler } =
        meldekortBehandling;

    if (!beregning) {
        return null;
    }

    const forrigeBeregning = finnForrigeMeldekortBehandling(meldekortBehandling.id)?.beregning;

    const totalBeløp = beregning.totalBeløp.totalt;
    const forrigeTotalBeløp = forrigeBeregning?.totalBeløp.totalt;
    const totalBeløpDiff = forrigeTotalBeløp ? totalBeløp - forrigeTotalBeløp : 0;

    const skalViseUtfallVarsel =
        kanBehandle(innloggetSaksbehandler, saksbehandler) &&
        sisteMeldekortBehandling === meldekortBehandling;

    return (
        <VStack gap={'5'} className={className}>
            <MeldekortKorrigertTilPåfølgendePerioder
                beregninger={beregning.beregningerForPåfølgendePerioder}
            />
            <MeldekortBeløp
                beløp={beregning.beregningForMeldekortetsPeriode.beløp}
                forrigeBeløp={forrigeBeregning?.beregningForMeldekortetsPeriode.beløp}
                totalBeløp={beregning.totalBeløp}
                utbetalingsstatus={meldekortBehandling.erAvsluttet ? utbetalingsstatus : undefined}
                navkontorForUtbetaling={
                    navkontorNavn ? `${navkontorNavn} (${navkontor})` : navkontor
                }
            />
            {skalViseUtfallVarsel && (
                <Alert variant={totalBeløpDiff < 0 ? 'warning' : 'info'} size={'small'}>
                    {utfallTekst(totalBeløpDiff)}
                </Alert>
            )}
        </VStack>
    );
};

const utfallTekst = (beløpDiff: number) => {
    if (beløpDiff < 0) {
        return 'Vurder å sende forhåndsvarsling til bruker om mulig tilbakebetaling i tilbakekrevingsløsningen eller via brevløsningen i Gosys.';
    }

    if (beløpDiff > 0) {
        return 'Husk å informere bruker om etterbetalingen og konsekvensene av det i Modia.';
    }

    return 'Husk å informere bruker om utfallet av korrigeringen i Modia selv om det ikke vil ha en praktisk betydning for utbetalingen.';
};
