import {
    Innvilgelsesperiode,
    InnvilgelsesperiodeDTO,
    LagretInnvilgelsesperiode,
} from '~/lib/rammebehandling/typer/Innvilgelsesperiode';

const MAKS_DAGER_PER_MELDEPERIODE = 14;

// Skjemaet har foreløpig én tiltaksdeltakelse per innvilgelsesperiode, mens API-et har en liste.
// Disse funksjonene oversetter mellom de to modellene på API-grensen.

export const tilInnvilgelsesperiodeDTO = ({
    periode,
    internDeltakelseId,
    antallDagerPerMeldeperiode,
    erReversertOpphør,
}: Innvilgelsesperiode): InnvilgelsesperiodeDTO => ({
    periode,
    tiltaksdeltakelser: [{ internDeltakelseId, antallDagerPerMeldeperiode }],
    erReversertOpphør,
});

export const tilInnvilgelsesperioderDTO = (
    innvilgelsesperioder: Innvilgelsesperiode[],
): InnvilgelsesperiodeDTO[] => innvilgelsesperioder.map(tilInnvilgelsesperiodeDTO);

// Bruker den første tiltaksdeltakelsen i perioden, siden skjemaet ennå ikke støtter flere.
// TODO: Fjernes når skjemaet støtter flere tiltaksdeltakelser per innvilgelsesperiode.
export const fraLagretInnvilgelsesperiode = ({
    periode,
    tiltaksdeltakelser,
    erReversertOpphør,
}: LagretInnvilgelsesperiode): Innvilgelsesperiode => {
    const { internDeltakelseId, antallDagerPerMeldeperiode } = tiltaksdeltakelser.atNonNull(0);

    return {
        periode,
        internDeltakelseId,
        antallDagerPerMeldeperiode,
        erReversertOpphør,
    };
};

export const fraLagredeInnvilgelsesperioder = (
    innvilgelsesperioder: LagretInnvilgelsesperiode[],
): Innvilgelsesperiode[] => innvilgelsesperioder.map(fraLagretInnvilgelsesperiode);

// Summen av antall dager for alle tiltaksdeltakelsene i perioden, begrenset til dagene i en meldeperiode
export const antallDagerPerMeldeperiodeTotalt = (
    innvilgelsesperiode: LagretInnvilgelsesperiode,
): number =>
    Math.min(
        innvilgelsesperiode.tiltaksdeltakelser.reduce(
            (sum, it) => sum + it.antallDagerPerMeldeperiode,
            0,
        ),
        MAKS_DAGER_PER_MELDEPERIODE,
    );
