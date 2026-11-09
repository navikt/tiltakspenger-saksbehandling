import { Rammebehandling, Rammebehandlingstype } from '~/lib/rammebehandling/typer/Rammebehandling';
import { PeriodeForReversertOpphør } from '~/lib/rammebehandling/typer/ReversertOpphør';
import { InnvilgelsesperiodePartial } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { Periode } from '~/types/Periode';
import { erFullstendigPeriode, inneholderHelePerioden, perioderOverlapper } from '~/utils/periode';

/**
 * Perioder som kan innvilges på nytt som reversert opphør.
 * Backend fyller bare ut listen for omgjøringer, så den er alltid tom for andre behandlinger.
 */
export const hentPerioderForReversertOpphør = (
    behandling: Rammebehandling,
): PeriodeForReversertOpphør[] =>
    behandling.type === Rammebehandlingstype.REVURDERING
        ? behandling.perioderForReversertOpphør
        : [];

export const hentPerioderForReversertOpphørSomOverlapper = (
    behandling: Rammebehandling,
    periode: Periode,
): PeriodeForReversertOpphør[] =>
    hentPerioderForReversertOpphør(behandling).filter((it) =>
        perioderOverlapper(it.periode, periode),
    );

export const hentPerioderForReversertOpphørForDeltakelse = (
    behandling: Rammebehandling,
    internDeltakelseId: string | undefined,
): PeriodeForReversertOpphør[] =>
    hentPerioderForReversertOpphør(behandling).filter(
        (it) => it.internDeltakelseId === internDeltakelseId,
    );

/**
 * Et reversert opphør må ligge innenfor den opphørte eller stansede delen av den opprinnelige innvilgelsen av samme tiltaksdeltakelse.
 * Backend validerer det samme ved lagring.
 */
export const erInnenforPeriodeForReversertOpphør = (
    behandling: Rammebehandling,
    innvilgelsesperiode: InnvilgelsesperiodePartial,
): boolean => {
    const { periode, internDeltakelseId } = innvilgelsesperiode;

    return (
        erFullstendigPeriode(periode) &&
        hentPerioderForReversertOpphørForDeltakelse(behandling, internDeltakelseId).some((it) =>
            inneholderHelePerioden(it.periode, periode),
        )
    );
};
