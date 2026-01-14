import { MedPeriode, Periode } from '~/types/Periode';
import dayjs from 'dayjs';
import { datoMax, datoMin, forrigeDag, nesteDag } from '~/utils/date';

export const validerPeriodisering = (periodisering: MedPeriode[], tillatHull: boolean) => {
    return periodisering
        .map((it) => it.periode)
        .every((periode, index, array) => {
            if (index === 0) {
                return true;
            }

            const forrigePeriode = array[index - 1];

            return tillatHull
                ? dayjs(periode.fraOgMed).isAfter(forrigePeriode.tilOgMed)
                : dayjs(periode.fraOgMed).subtract(1, 'day').isSame(forrigePeriode.tilOgMed);
        });
};

export const joinPerioder = (perioder: Periode[]): Periode => {
    if (perioder.length === 0) {
        throw Error('Må ha minst en periode');
    }

    const førsteFraOgMed = perioder
        .map((periode) => periode.fraOgMed)
        .toSorted()
        .at(0)!;
    const sisteTilOgMed = perioder
        .map((periode) => periode.tilOgMed)
        .toSorted()
        .at(-1)!;

    return { fraOgMed: førsteFraOgMed, tilOgMed: sisteTilOgMed };
};

export const erDatoIPeriode = (dato: string, periode: Periode) => {
    return dato >= periode.fraOgMed && dato <= periode.tilOgMed;
};

export const perioderOverlapper = (a: Periode, b: Periode) => {
    return (
        erDatoIPeriode(a.fraOgMed, b) ||
        erDatoIPeriode(a.tilOgMed, b) ||
        erDatoIPeriode(b.fraOgMed, a) ||
        erDatoIPeriode(b.tilOgMed, a)
    );
};

export const inneholderHelePerioden = (a: Periode, b: Periode) => {
    return erDatoIPeriode(b.fraOgMed, a) && erDatoIPeriode(b.tilOgMed, a);
};

export const erFullstendigPeriode = (periode: Partial<Periode>): periode is Periode => {
    return !!periode.fraOgMed && !!periode.tilOgMed;
};

export const perioderErLike = (periode1: Periode, periode2: Periode) =>
    periode1.fraOgMed === periode2.fraOgMed && periode1.tilOgMed == periode2.tilOgMed;

export const perioderErSammenhengende = (periode1: Periode, periode2: Periode) => {
    return nesteDag(periode1.tilOgMed) === periode2.fraOgMed;
};

export const periodiseringerErLike = <T>(
    perioder1: MedPeriode<T>[],
    perioder2: MedPeriode<T>[],
    sammenlignVerdi: (p1: T, p2: T) => boolean,
) => {
    return (
        perioder1.length === perioder2.length &&
        perioder1.every((periode, index) => {
            const periode2 = perioder2.at(index)!;

            return (
                perioderErLike(periode.periode, periode2.periode) &&
                sammenlignVerdi(periode, periode2)
            );
        })
    );
};

export const periodiseringTotalPeriode = (periodisering: MedPeriode[]): Periode => {
    return joinPerioder(periodisering.map((it) => it.periode));
};

// Returnerer elementer med perioder som overlapper den angitte perioden, krympet til den angitte perioden
// Returnerer tomt array hvis ingen elementer har perioder som overlapper med den angitte
export const krympPeriodisering = <T>(
    periodisering: MedPeriode<T>[],
    krympTil: Periode,
): MedPeriode<T>[] => {
    const overlappendePerioder = periodisering.filter((p) =>
        perioderOverlapper(p.periode, krympTil),
    );

    if (overlappendePerioder.length === 0) {
        return [];
    }

    const førsteElement = overlappendePerioder.at(0)!;

    if (overlappendePerioder.length === 1) {
        return [
            {
                ...førsteElement,
                periode: {
                    fraOgMed: datoMax(førsteElement.periode.fraOgMed, krympTil.fraOgMed),
                    tilOgMed: datoMin(førsteElement.periode.tilOgMed, krympTil.tilOgMed),
                },
            },
        ];
    }

    const sisteElement = overlappendePerioder.at(-1)!;

    return overlappendePerioder
        .with(0, {
            ...førsteElement,
            periode: {
                ...førsteElement.periode,
                fraOgMed: datoMax(førsteElement.periode.fraOgMed, krympTil.fraOgMed),
            },
        })
        .with(-1, {
            ...sisteElement,
            periode: {
                ...sisteElement.periode,
                tilOgMed: datoMin(sisteElement.periode.tilOgMed, krympTil.tilOgMed),
            },
        });
};

// Returnerer elementer med perioder som overlapper den angitte perioden, og setter første fraOgMed og siste tilOgMed lik angitt periode
// Dersom ingen perioder overlapper med den angitte, returneres nærmeste element satt til angitt periode
export const utvidPeriodisering = <T>(
    periodisering: MedPeriode<T>[],
    utvidTil: Periode,
): MedPeriode<T>[] => {
    if (periodisering.length === 0) {
        return [];
    }

    const perioderSomSkalUtvides = finnOverlappendeEllerNærmestePeriode(periodisering, utvidTil);

    const førsteElement = perioderSomSkalUtvides.at(0)!;

    if (perioderSomSkalUtvides.length === 1) {
        return [{ ...førsteElement, periode: utvidTil }];
    }

    const sisteElement = perioderSomSkalUtvides.at(-1)!;

    return perioderSomSkalUtvides
        .with(0, {
            ...førsteElement,
            periode: {
                fraOgMed: utvidTil.fraOgMed,
                tilOgMed: førsteElement.periode.tilOgMed,
            },
        })
        .with(-1, {
            ...sisteElement,
            periode: {
                fraOgMed: sisteElement.periode.fraOgMed,
                tilOgMed: utvidTil.tilOgMed,
            },
        });
};

const finnOverlappendeEllerNærmestePeriode = <T>(
    periodisering: MedPeriode<T>[],
    skalOverlappeMed: Periode,
): MedPeriode<T>[] => {
    if (periodisering.length === 0) {
        return [];
    }

    const førstePeriodeIndex = periodisering.findIndex((p) => {
        return p.periode.tilOgMed >= skalOverlappeMed.fraOgMed;
    });

    // Dersom alle perioder er før den angitte perioden, er den siste perioden den nærmeste
    if (førstePeriodeIndex === -1) {
        return [periodisering.at(-1)!];
    }

    const sistePeriodeIndex = periodisering.findLastIndex((p) => {
        return p.periode.fraOgMed <= skalOverlappeMed.tilOgMed;
    });

    // Dersom alle perioder er etter den angitte perioden, er den første perioden den nærmeste
    if (sistePeriodeIndex === -1) {
        return [periodisering.at(0)!];
    }

    return periodisering.slice(førstePeriodeIndex, sistePeriodeIndex + 1);
};

export const finnPeriodiseringHull = (periodisering: MedPeriode[]): Periode[] => {
    return periodisering.reduce<Periode[]>((acc, { periode }, index, array) => {
        const nesteDagEtterPerioden = nesteDag(periode.tilOgMed);
        const nestePeriode = array.at(index + 1)?.periode;

        if (nestePeriode && !perioderErSammenhengende(periode, nestePeriode)) {
            acc.push({
                fraOgMed: nesteDagEtterPerioden,
                tilOgMed: forrigeDag(nestePeriode.fraOgMed),
            });
        }

        return acc;
    }, []);
};

export const slåSammenPeriodisering = <T>(
    periodisering: MedPeriode<T>[],
    sammenlignVerdi: (p1: T, p2: T) => boolean,
): MedPeriode<T>[] => {
    return periodisering.reduce<MedPeriode<T>[]>((acc, it) => {
        if (acc.length === 0) {
            return [it];
        }

        const forrige = acc.at(-1)!;

        if (perioderErSammenhengende(forrige.periode, it.periode) && sammenlignVerdi(forrige, it)) {
            return acc.toSpliced(-1, 1, {
                ...it,
                periode: {
                    fraOgMed: forrige.periode.fraOgMed,
                    tilOgMed: it.periode.tilOgMed,
                },
            });
        }

        return [...acc, it];
    }, []);
};
