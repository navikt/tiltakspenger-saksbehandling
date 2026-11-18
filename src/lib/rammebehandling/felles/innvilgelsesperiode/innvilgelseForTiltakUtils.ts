import { Rammebehandling, Rammebehandlingstype } from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    AntallDagerForPeriode,
    InnvilgelseForTiltak,
    InnvilgelsesperiodeForTiltak,
    Innvilgelsesperioder,
} from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { Periode } from '~/types/Periode';
import {
    hentInnvilgbarePerioder,
    hentTiltaksdeltakelser,
} from '~/lib/rammebehandling/rammebehandlingUtils';
import {
    hentPerioderForReversertOpphørForDeltakelse,
    hentPerioderForReversertOpphørIVedtaksperioden,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/reversertOpphør/reversertOpphørUtils';
import { erFullstendigPeriode, overlappendePeriode, perioderOverlapper } from '~/utils/periode';
import { isNonNullish } from '~/utils/object';
import { forrigeDag, formaterPeriode, nesteDag } from '~/utils/date';
import { removeDuplicatesFilter } from '~/utils/array';
import { Dato } from '~/types/DatoTid';
import { delOppTiltaksdeltakelser } from '~/lib/rammebehandling/saksopplysninger/tiltak/tiltaksdeltakelseVisning';

export const ANTALL_DAGER_DEFAULT = 10;
export const MAKS_ANTALL_DAGER_PER_MELDEPERIODE = 14;
// Uten helg kan det meldes for maks 10 dager per meldeperiode
const MAKS_ANTALL_DAGER_PER_MELDEPERIODE_UTEN_HELG = 10;

/** Identifiserer et tiltak i innvilgelsen. Samme tiltaksdeltakelse kan velges både som vanlig tiltak og som reversert opphør. */
export type TiltakNøkkel = Pick<InnvilgelseForTiltak, 'internDeltakelseId' | 'erReversertOpphør'>;

export const erSammeTiltak = (a: TiltakNøkkel, b: TiltakNøkkel): boolean =>
    a.internDeltakelseId === b.internDeltakelseId && a.erReversertOpphør === b.erReversertOpphør;

export const tiltakNøkkelTekst = ({ internDeltakelseId, erReversertOpphør }: TiltakNøkkel) =>
    `${erReversertOpphør ? 'reversert-opphor:' : ''}${internDeltakelseId}`;

/**
 * Et tiltak som kan velges for innvilgelse, med periodene det kan innvilges for.
 * Et tidligere valgt tiltak som ikke lenger kan innvilges, tas med som ugyldig, slik at det kan velges bort.
 */
export type TiltakSomKanVelges = TiltakNøkkel & {
    typeNavn: string;
    innvilgbarePerioder: Periode[];
    erGyldig: boolean;
};

/**
 * Tiltakene saksbehandler kan velge å innvilge for, i fast rekkefølge.
 * Vanlige tiltak kommer først, i samme rekkefølge som i saksopplysningene, deretter reverserte opphør, og til slutt valgte tiltak som ikke lenger kan innvilges.
 * Reversert opphør kan bare velges ved omgjøring, for perioder innenfor vedtaksperioden.
 */
export const hentTiltakSomKanVelges = (
    behandling: Rammebehandling,
    valgte: TiltakNøkkel[],
    vedtaksperiode?: Partial<Periode>,
): TiltakSomKanVelges[] => {
    const innvilgbare = hentInnvilgbarePerioder(behandling);

    const { aktuelle, historiske } = delOppTiltaksdeltakelser(
        hentTiltaksdeltakelser(behandling),
        behandling.saksopplysninger.periode,
    );
    const rekkefølge = [...aktuelle, ...historiske].map((it) => it.internDeltakelseId);
    const indeks = (internDeltakelseId: string) => {
        const i = rekkefølge.indexOf(internDeltakelseId);
        return i === -1 ? rekkefølge.length : i;
    };

    const vanlige: TiltakSomKanVelges[] = innvilgbare
        .toSorted((a, b) => indeks(a.internDeltakelseId) - indeks(b.internDeltakelseId))
        .map((it) => ({
            internDeltakelseId: it.internDeltakelseId,
            erReversertOpphør: false,
            typeNavn: tiltakVisningsnavn(it.typeNavn, it.periode, innvilgbare),
            innvilgbarePerioder: [it.periode],
            erGyldig: true,
        }));

    const reversertOpphørIder = [
        ...(vedtaksperiode
            ? hentPerioderForReversertOpphørIVedtaksperioden(behandling, vedtaksperiode)
            : []
        ).map((it) => it.internDeltakelseId),
        ...valgte.filter((it) => it.erReversertOpphør).map((it) => it.internDeltakelseId),
    ].filter(removeDuplicatesFilter());

    const reverserteOpphør: TiltakSomKanVelges[] = reversertOpphørIder
        .map((internDeltakelseId) => {
            const perioder = hentPerioderForReversertOpphørForDeltakelse(
                behandling,
                internDeltakelseId,
            );

            const første = perioder.at(0);

            return første
                ? {
                      internDeltakelseId,
                      erReversertOpphør: true,
                      typeNavn: første.typeNavn,
                      innvilgbarePerioder: perioder.map((it) => it.periode),
                      erGyldig: true,
                  }
                : null;
        })
        .filter(isNonNullish);

    const gyldige = [...vanlige, ...reverserteOpphør];

    const ugyldige: TiltakSomKanVelges[] = valgte
        .filter((valgt) => !gyldige.some((it) => erSammeTiltak(it, valgt)))
        .map((valgt) => ({
            ...valgt,
            typeNavn: `Tiltak med id ${valgt.internDeltakelseId}`,
            innvilgbarePerioder: [],
            erGyldig: false,
        }));

    return [...gyldige, ...ugyldige];
};

// Skiller tiltak av samme type med periodene deres
const tiltakVisningsnavn = (
    typeNavn: string,
    periode: Periode,
    innvilgbare: { typeNavn: string }[],
): string =>
    innvilgbare.filter((it) => it.typeNavn === typeNavn).length > 1
        ? `${typeNavn} (${formaterPeriode(periode)})`
        : typeNavn;

/** Sorterer valgte tiltak i samme rekkefølge som de vises. Det første tiltaket bestemmer tiltakstypen ved overlapp. */
export const sorterTiltak = <T extends TiltakNøkkel>(
    tiltak: T[],
    rekkefølge: TiltakNøkkel[],
): T[] => {
    const indeks = (it: TiltakNøkkel) => {
        const i = rekkefølge.findIndex((r) => erSammeTiltak(r, it));
        return i === -1 ? rekkefølge.length : i;
    };

    return tiltak.toSorted((a, b) => indeks(a) - indeks(b));
};

/** Antall dager per meldeperiode fra tiltaksdeltakelsen i saksopplysningene, eller default. */
export const antallDagerForTiltak = (
    behandling: Rammebehandling,
    internDeltakelseId: string,
): number => {
    const antallDagerPerUke = hentTiltaksdeltakelser(behandling).find(
        (it) => it.internDeltakelseId === internDeltakelseId,
    )?.antallDagerPerUke;

    return antallDagerPerUke
        ? Math.min(antallDagerPerUke * 2, MAKS_ANTALL_DAGER_PER_MELDEPERIODE)
        : ANTALL_DAGER_DEFAULT;
};

/**
 * Forhåndsutfyller et nytt valgt tiltak med periodene det kan innvilges for, avgrenset til en eventuell periode.
 * Overlapper ingen av periodene avgrensningen, brukes periodene uten avgrensning.
 */
export const lagInnvilgelseForTiltak = (
    tiltak: TiltakSomKanVelges,
    avgrensning?: Periode,
): InnvilgelseForTiltak => {
    const avgrensede = avgrensning
        ? tiltak.innvilgbarePerioder
              .map((it) => overlappendePeriode(it, avgrensning))
              .filter(isNonNullish)
        : tiltak.innvilgbarePerioder;

    const perioder = avgrensede.length > 0 ? avgrensede : tiltak.innvilgbarePerioder;

    return {
        internDeltakelseId: tiltak.internDeltakelseId,
        erReversertOpphør: tiltak.erReversertOpphør,
        perioder: perioder.map((periode) => ({ periode })),
    };
};

/**
 * Perioden et nytt valgt tiltak forhåndsutfylles innenfor.
 * Omgjøringer avgrenses til vedtaksperioden.
 * I søknadsbehandlinger avgrenses bare tiltaket det er søkt om, til søknadsperioden.
 */
export const hentAvgrensningForNyttTiltak = (
    behandling: Rammebehandling,
    tiltak: TiltakNøkkel,
    vedtaksperiode?: Partial<Periode>,
): Periode | undefined => {
    if (vedtaksperiode) {
        return erFullstendigPeriode(vedtaksperiode) ? vedtaksperiode : undefined;
    }

    if (behandling.type !== Rammebehandlingstype.SØKNADSBEHANDLING || tiltak.erReversertOpphør) {
        return undefined;
    }

    const { søknad } = behandling;
    const erSøktOm = hentTiltaksdeltakelser(behandling).some(
        (it) =>
            it.internDeltakelseId === tiltak.internDeltakelseId &&
            it.eksternDeltagelseId === søknad.tiltak?.id,
    );

    return erSøktOm ? (søknad.tiltaksdeltakelseperiodeDetErSøktOm ?? undefined) : undefined;
};

/** Ny periode etter den siste, til og med slutten av perioden tiltaket kan innvilges for. */
export const lagNyPeriodeForTiltak = (
    perioder: InnvilgelsesperiodeForTiltak[],
    innvilgbarePerioder: Periode[],
): InnvilgelsesperiodeForTiltak | null => {
    const siste = perioder.at(-1);
    const sisteInnvilgbare = innvilgbarePerioder.at(-1);

    if (!siste) {
        return null;
    }

    const fraOgMed = nesteDag(siste.periode.tilOgMed);
    const tilOgMed =
        sisteInnvilgbare && sisteInnvilgbare.tilOgMed > fraOgMed
            ? sisteInnvilgbare.tilOgMed
            : fraOgMed;

    return { periode: { fraOgMed, tilOgMed } };
};

/** En periode der de samme periodene for de valgte tiltakene overlapper, med tiltakene i samme rekkefølge som de er valgt. */
export type Delperiode = {
    periode: Periode;
    tiltak: TiltakNøkkel[];
};

/**
 * Deler periodene for de valgte tiltakene opp der noen av dem starter eller slutter.
 * Hver delperiode får sitt eget antall dager per meldeperiode, og hull mellom periodene er ikke med.
 * Backend deler opp på samme måte.
 */
export const hentDelperioder = (tiltak: InnvilgelseForTiltak[]): Delperiode[] => {
    const perioder = tiltak.flatMap((it) =>
        it.perioder.map(({ periode }) => ({
            periode,
            tiltak: {
                internDeltakelseId: it.internDeltakelseId,
                erReversertOpphør: it.erReversertOpphør,
            },
        })),
    );

    const bruddpunkter: Dato[] = perioder
        .flatMap(({ periode }) => [periode.fraOgMed, nesteDag(periode.tilOgMed)])
        .filter(removeDuplicatesFilter())
        .toSorted();

    return bruddpunkter.slice(0, -1).reduce<Delperiode[]>((acc, fraOgMed, index) => {
        const periode: Periode = {
            fraOgMed,
            tilOgMed: forrigeDag(bruddpunkter.atNonNull(index + 1)),
        };

        const overlappende = perioder.filter((it) => perioderOverlapper(it.periode, periode));

        if (overlappende.length > 0) {
            acc.push({ periode, tiltak: overlappende.map((it) => it.tiltak) });
        }

        return acc;
    }, []);
};

const harSammeTiltak = (a: TiltakNøkkel[], b: TiltakNøkkel[]) =>
    a.length === b.length && a.every((it) => b.some((annen) => erSammeTiltak(it, annen)));

/**
 * Summen av antall dager for tiltakene, eller maks antall dager per meldeperiode dersom summen er høyere.
 * Maks er 10 dager når det ikke kan meldes for helg.
 */
const antallDagerForTiltakene = (
    behandling: Rammebehandling,
    tiltak: TiltakNøkkel[],
    kanMeldeHelg: boolean,
): number =>
    Math.min(
        tiltak.reduce(
            (sum, it) => sum + antallDagerForTiltak(behandling, it.internDeltakelseId),
            0,
        ),
        kanMeldeHelg
            ? MAKS_ANTALL_DAGER_PER_MELDEPERIODE
            : MAKS_ANTALL_DAGER_PER_MELDEPERIODE_UTEN_HELG,
    );

/**
 * Deler opp antall dager per meldeperiode slik at hver delperiode får sin egen verdi, se hentDelperioder.
 * Backend slår sammen tilstøtende perioder med likt antall dager, men skjemaet har én verdi per delperiode.
 */
export const tilInnvilgelsesperioderSkjema = ({
    tiltak,
    antallDagerPerMeldeperiode,
}: Innvilgelsesperioder): Innvilgelsesperioder => ({
    tiltak,
    antallDagerPerMeldeperiode: hentDelperioder(tiltak).map(({ periode }) => ({
        periode,
        antallDagerPerMeldeperiode:
            antallDagerPerMeldeperiode.find((it) => perioderOverlapper(it.periode, periode))
                ?.antallDagerPerMeldeperiode ?? ANTALL_DAGER_DEFAULT,
    })),
});

/**
 * Antall dager per meldeperiode for hver delperiode av [tiltak], se hentDelperioder.
 * En delperiode beholder antall dager fra en overlappende delperiode i [forrige] med de samme tiltakene.
 * Ellers forhåndsutfylles den med summen av antall dager fra tiltaksdeltakelsene i saksopplysningene,
 * maks 14, eller 10 dersom det ikke kan meldes for helg.
 */
export const tilpassAntallDager = (
    behandling: Rammebehandling,
    tiltak: InnvilgelseForTiltak[],
    forrige: Innvilgelsesperioder,
    kanMeldeHelg: boolean,
): AntallDagerForPeriode[] => {
    const forrigeDelperioder = hentDelperioder(forrige.tiltak);
    const forrigeAntallDager = tilInnvilgelsesperioderSkjema(forrige).antallDagerPerMeldeperiode;

    return hentDelperioder(tiltak).map(({ periode, tiltak: tiltakIPerioden }) => {
        const forrigeIndex = forrigeDelperioder.findIndex(
            (it) =>
                harSammeTiltak(it.tiltak, tiltakIPerioden) &&
                perioderOverlapper(it.periode, periode),
        );

        return {
            periode,
            antallDagerPerMeldeperiode:
                forrigeIndex >= 0
                    ? forrigeAntallDager.atNonNull(forrigeIndex).antallDagerPerMeldeperiode
                    : antallDagerForTiltakene(behandling, tiltakIPerioden, kanMeldeHelg),
        };
    });
};
