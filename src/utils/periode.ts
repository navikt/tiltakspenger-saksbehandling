import { MedPeriode, Periode } from '~/types/Periode';
import { datoMax, datoMin, forrigeDag, nesteDag } from '~/utils/date';

// Sjekker at periodiseringen er i kronologisk rekkefølge uten overlapp
export const validerPeriodisering = (periodisering: MedPeriode[], tillatHull: boolean): boolean => {
    return periodisering
        .map((it) => it.periode)
        .every((periode, index, array) => {
            if (index === 0) {
                return true;
            }

            const forrigePeriode = array[index - 1];

            return tillatHull
                ? periode.fraOgMed > forrigePeriode.tilOgMed
                : forrigeDag(periode.fraOgMed) === forrigePeriode.tilOgMed;
        });
};

// Returnerer en ny periode med tidligste fraOgMed og seneste tilOgMed fra de angitte periodene
export const totalPeriode = (perioder: Periode[]): Periode => {
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

export const overlappendePeriode = (periode1: Periode, periode2: Periode): Periode | null => {
    return perioderOverlapper(periode1, periode2)
        ? {
              fraOgMed: datoMax(periode1.fraOgMed, periode2.fraOgMed),
              tilOgMed: datoMin(periode1.tilOgMed, periode2.tilOgMed),
          }
        : null;
};

export const erDatoIPeriode = (dato: string, periode: Periode): boolean => {
    return dato >= periode.fraOgMed && dato <= periode.tilOgMed;
};

export const perioderOverlapper = (a: Periode, b: Periode): boolean => {
    return (
        erDatoIPeriode(a.fraOgMed, b) ||
        erDatoIPeriode(a.tilOgMed, b) ||
        erDatoIPeriode(b.fraOgMed, a) ||
        erDatoIPeriode(b.tilOgMed, a)
    );
};

// Sjekker om den første perioden inneholder hele den andre perioden
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
        perioder1.every((periode1, index) => {
            const periode2 = perioder2.at(index)!;

            return (
                perioderErLike(periode1.periode, periode2.periode) &&
                sammenlignVerdi(periode1, periode2)
            );
        })
    );
};

export const periodiseringTotalPeriode = (periodisering: MedPeriode[]): Periode => {
    return totalPeriode(periodisering.map((it) => it.periode));
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
                periode: overlappendePeriode(førsteElement.periode, krympTil)!,
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
    const overlappendePerioder = periodisering.filter((p) =>
        perioderOverlapper(p.periode, utvidTil),
    );

    if (overlappendePerioder.length === 0) {
        return [];
    }

    const førsteElement = overlappendePerioder.at(0)!;

    if (overlappendePerioder.length === 1) {
        return [{ ...førsteElement, periode: utvidTil }];
    }

    const sisteElement = overlappendePerioder.at(-1)!;

    return overlappendePerioder
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

export const finnPeriodiseringHull = (periodisering: MedPeriode[]): Periode[] => {
    return finnPerioderHull(periodisering.map((it) => it.periode));
};

export const finnPerioderHull = (perioder: Periode[]): Periode[] => {
    return perioder.toSorted(sorterPerioder()).reduce<Periode[]>((acc, periode, index, array) => {
        const nesteDagEtterPerioden = nesteDag(periode.tilOgMed);
        const nestePeriode = array.at(index + 1);

        if (nestePeriode && !perioderErSammenhengende(periode, nestePeriode)) {
            acc.push({
                fraOgMed: nesteDagEtterPerioden,
                tilOgMed: forrigeDag(nestePeriode.fraOgMed),
            });
        }

        return acc;
    }, []);
};

// Slår sammen perioder dersom de tilstøter hverandre og har samme verdi (ut fra sammenlignVerdi predikatet)
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

// Slår sammen perioder dersom de tilstøter hverandre eller overlapper
export const slåSammenPerioder = (perioder: Periode[]): Periode[] => {
    return perioder.toSorted(sorterPerioder()).reduce<Periode[]>((acc, periode) => {
        if (acc.length === 0) {
            return [periode];
        }

        const forrige = acc.at(-1)!;

        if (perioderErSammenhengende(forrige, periode) || perioderOverlapper(forrige, periode)) {
            return acc.toSpliced(-1, 1, {
                fraOgMed: forrige.fraOgMed,
                tilOgMed: datoMax(periode.tilOgMed, forrige.tilOgMed),
            });
        }

        return [...acc, periode];
    }, []);
};

export const sorterPerioder =
    (order: 'asc' | 'desc' = 'asc') =>
    (a: Periode, b: Periode): number => {
        const unit = order === 'asc' ? 1 : -1;

        if (a.fraOgMed < b.fraOgMed) {
            return -unit;
        }
        if (a.fraOgMed > b.fraOgMed) {
            return unit;
        }
        return a.tilOgMed > b.tilOgMed ? unit : a.tilOgMed < b.tilOgMed ? -unit : 0;
    };

export const sorterPeriodisering =
    (order: 'asc' | 'desc' = 'asc') =>
    (a: MedPeriode, b: MedPeriode): number => {
        const unit = order === 'asc' ? 1 : -1;

        if (a.periode.fraOgMed < b.periode.fraOgMed) {
            return -unit;
        }
        if (a.periode.fraOgMed > b.periode.fraOgMed) {
            return unit;
        }
        return a.periode.tilOgMed > b.periode.tilOgMed
            ? unit
            : a.periode.tilOgMed < b.periode.tilOgMed
              ? -unit
              : 0;
    };

export const oppdaterPeriode = (periode: Periode, oppdatering: Partial<Periode>): Periode => {
    return {
        fraOgMed:
            oppdatering.fraOgMed ??
            (oppdatering.tilOgMed
                ? datoMin(periode.fraOgMed, oppdatering.tilOgMed)
                : periode.fraOgMed),
        tilOgMed:
            oppdatering.tilOgMed ??
            (oppdatering.fraOgMed
                ? datoMax(periode.tilOgMed, oppdatering.fraOgMed)
                : periode.tilOgMed),
    };
};

export const oppdaterPartialPeriode = (
    periode: Partial<Periode>,
    oppdatering: Partial<Periode>,
): Partial<Periode> => {
    return {
        fraOgMed:
            oppdatering.fraOgMed ??
            (oppdatering.tilOgMed && periode.fraOgMed
                ? datoMin(periode.fraOgMed, oppdatering.tilOgMed)
                : periode.fraOgMed),
        tilOgMed:
            oppdatering.tilOgMed ??
            (oppdatering.fraOgMed && periode.tilOgMed
                ? datoMax(periode.tilOgMed, oppdatering.fraOgMed)
                : periode.tilOgMed),
    };
};
