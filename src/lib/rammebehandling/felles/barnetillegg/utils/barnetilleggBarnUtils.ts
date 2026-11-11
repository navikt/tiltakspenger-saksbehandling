import {
    BarnetilleggBarn,
    BarnetilleggBarnKilde,
    BarnetilleggPeriode,
} from '~/lib/rammebehandling/typer/Barnetillegg';
import { Periode } from '~/types/Periode';
import { Dato } from '~/types/DatoTid';
import { Nullable } from '~/types/UtilTypes';
import { finn16årsdag, forrigeDag, nesteDag } from '~/utils/date';
import { erDatoIPeriode, overlappendePeriode, totalPeriode } from '~/utils/periode';
import { removeDuplicatesFilter } from '~/utils/array';
import { isNonNullish } from '~/utils/object';
import { erSladdet, hentVerdi, sladdbarTekst } from '~/utils/sladdetVerdi';
import {
    kunPerioderMedBarn,
    slåSammenBarnetillegg,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggUtils';
import { SladdbarVerdi } from '~/types/SladdetVerdi';

/** Et barn i barnetilleggskjemaet. `key` identifiserer barnet på tvers av kildene barnet kan hentes fra. */
export type BarnetilleggBarnSkjema = BarnetilleggBarn & {
    key: string;
};

type BarnIdentitet = Pick<
    BarnetilleggBarn,
    'fnr' | 'fornavn' | 'mellomnavn' | 'etternavn' | 'fødselsdato'
>;

const normaliser = (verdi: SladdbarVerdi<Nullable<string>>) =>
    (hentVerdi(verdi) ?? '').trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * Lager en nøkkel som identifiserer barnet: fnr dersom det finnes, ellers fødselsdato og navn.
 * Dersom identiteten er sladdet brukes `reserveKey`, som må være unik for barnet i kilden det hentes fra.
 */
export const lagBarnKey = (barn: BarnIdentitet, reserveKey: string): string => {
    const fnr = hentVerdi(barn.fnr);

    if (fnr) {
        return `fnr:${fnr}`;
    }

    if (harSladdetIdentitet(barn)) {
        return `sladdet:${reserveKey}`;
    }

    return lagNavnOgFødselsdatoKey(barn);
};

const harSladdetIdentitet = (barn: BarnIdentitet): boolean =>
    erSladdet(barn.fnr) ||
    erSladdet(barn.fødselsdato) ||
    erSladdet(barn.fornavn) ||
    erSladdet(barn.mellomnavn) ||
    erSladdet(barn.etternavn);

const lagNavnOgFødselsdatoKey = (barn: BarnIdentitet): string => {
    const navn = [barn.fornavn, barn.mellomnavn, barn.etternavn].map(normaliser).join('|');

    return `navn:${hentVerdi(barn.fødselsdato)}:${navn}`;
};

/**
 * Om to barn er samme barn, slik backend vurderer det.
 * Barna er samme barn når fnr er likt, eller når fødselsdato og navn er like.
 * Det siste gjelder også når barna har ulikt fnr, men da må de ha fornavn og etternavn, så f.eks. tvillinger uten navn ikke regnes som samme barn.
 * Samme barn kan dermed ha ulik `key`, f.eks. når det er oppgitt uten fnr i søknaden og lagt til med fnr av saksbehandler.
 */
export const erSammeBarn = (a: BarnetilleggBarnSkjema, b: BarnetilleggBarnSkjema): boolean => {
    const fnrA = hentVerdi(a.fnr)?.trim();
    const fnrB = hentVerdi(b.fnr)?.trim();

    if (fnrA && fnrA === fnrB) {
        return true;
    }

    if (a.key === b.key) {
        return true;
    }

    if (harSladdetIdentitet(a) || harSladdetIdentitet(b)) {
        return false;
    }

    if (lagNavnOgFødselsdatoKey(a) !== lagNavnOgFødselsdatoKey(b)) {
        return false;
    }

    return !fnrA || !fnrB || (!!normaliser(a.fornavn) && !!normaliser(a.etternavn));
};

export const tilBarnetilleggBarnSkjema = (
    barn: BarnetilleggBarn,
    reserveKey: string,
): BarnetilleggBarnSkjema => ({
    fnr: barn.fnr,
    fornavn: barn.fornavn,
    mellomnavn: barn.mellomnavn,
    etternavn: barn.etternavn,
    fødselsdato: barn.fødselsdato,
    kilde: barn.kilde,
    søknadId: barn.søknadId,
    periode: barn.periode,
    key: lagBarnKey(barn, reserveKey),
});

export const formaterBarnNavn = (barn: BarnIdentitet): string => {
    if (erSladdet(barn.fornavn) || erSladdet(barn.etternavn)) {
        return sladdbarTekst(barn.fornavn);
    }

    return [barn.fornavn, barn.mellomnavn, barn.etternavn]
        .map((navn) => sladdbarTekst(navn))
        .filter((navn) => navn.trim() !== '')
        .join(' ');
};

export const erBarnFraSaksbehandler = (barn: Pick<BarnetilleggBarn, 'kilde'>) =>
    barn.kilde === BarnetilleggBarnKilde.SAKSBEHANDLER;

/** Perioden barnet har rett til barnetillegg: fra fødselsdatoen til og med dagen før barnet fyller 16 år. */
export const rettTilBarnetilleggPeriode = (fødselsdato: Dato): Periode => ({
    fraOgMed: fødselsdato,
    tilOgMed: forrigeDag(finn16årsdag(fødselsdato)),
});

/**
 * Periodene barnet gir barnetillegg for: den valgte perioden (eller hele innvilgelsesperioden),
 * avgrenset til perioden barnet har rett og til innvilgelsesperiodene.
 */
export const effektivePerioderForBarn = (
    barn: { fødselsdato: Dato; periode: Nullable<Periode> },
    innvilgelsesperioder: Periode[],
): Periode[] => {
    if (innvilgelsesperioder.length === 0) {
        return [];
    }

    const basis = barn.periode ?? totalPeriode(innvilgelsesperioder);
    const basisMedRett = overlappendePeriode(basis, rettTilBarnetilleggPeriode(barn.fødselsdato));

    if (!basisMedRett) {
        return [];
    }

    return innvilgelsesperioder
        .toSorted((a, b) => (a.fraOgMed < b.fraOgMed ? -1 : 1))
        .map((innvilgelsesperiode) => overlappendePeriode(basisMedRett, innvilgelsesperiode))
        .filter(isNonNullish);
};

/** Effektive perioder for et barn i skjemaet. Barn med sladdet fødselsdato kan ikke periodiseres. */
export const effektivePerioderForSkjemaBarn = (
    barn: Pick<BarnetilleggBarn, 'fødselsdato' | 'periode'>,
    innvilgelsesperioder: Periode[],
): Periode[] => {
    if (erSladdet(barn.fødselsdato)) {
        return [];
    }

    return effektivePerioderForBarn(
        { fødselsdato: barn.fødselsdato.verdi, periode: barn.periode },
        innvilgelsesperioder,
    );
};

/** Antall barn per periode, ut fra periodene hvert barn gir barnetillegg for. Perioder uten barn utelates. */
export const periodiserAntallBarn = (perioderPerBarn: Periode[][]): BarnetilleggPeriode[] => {
    const allePerioder = perioderPerBarn.flat();

    const avgrensningsdatoer = allePerioder
        .flatMap((periode) => [periode.fraOgMed, nesteDag(periode.tilOgMed)])
        .filter(removeDuplicatesFilter())
        .toSorted();

    const barnetillegg = avgrensningsdatoer
        .slice(0, -1)
        .map((fraOgMed, index) => ({
            antallBarn: perioderPerBarn.filter((perioder) =>
                perioder.some((periode) => erDatoIPeriode(fraOgMed, periode)),
            ).length,
            periode: {
                fraOgMed,
                tilOgMed: forrigeDag(avgrensningsdatoer.atNonNull(index + 1)),
            },
        }))
        .filter(kunPerioderMedBarn);

    return slåSammenBarnetillegg(barnetillegg);
};

/** Antall barn per periode for de valgte barna. Tilsvarer periodiseringen backenden gjør. */
export const periodiserBarnetilleggFraBarn = (
    barn: Array<Pick<BarnetilleggBarn, 'fødselsdato' | 'periode'>>,
    innvilgelsesperioder: Periode[],
): BarnetilleggPeriode[] =>
    periodiserAntallBarn(
        barn.map((it) => effektivePerioderForSkjemaBarn(it, innvilgelsesperioder)),
    );

/** Om barnet har rett til barnetillegg (er født og under 16 år) på minst én dag i innvilgelsesperiodene. */
export const harRettIInnvilgelsesperiodene = (
    barn: Pick<BarnetilleggBarn, 'fødselsdato'>,
    innvilgelsesperioder: Periode[],
): boolean =>
    effektivePerioderForSkjemaBarn(
        { fødselsdato: barn.fødselsdato, periode: null },
        innvilgelsesperioder,
    ).length > 0;

/**
 * Perioden saksbehandler kan velge for barnet: innvilgelsesperioden, avgrenset til perioden barnet har rett.
 * Null dersom barnet ikke har rett i innvilgelsesperioden, eller fødselsdatoen er sladdet.
 */
export const gyldigPeriodeForBarn = (
    barn: Pick<BarnetilleggBarn, 'fødselsdato'>,
    innvilgelsesperioder: Periode[],
): Nullable<Periode> => {
    if (erSladdet(barn.fødselsdato) || innvilgelsesperioder.length === 0) {
        return null;
    }

    return overlappendePeriode(
        totalPeriode(innvilgelsesperioder),
        rettTilBarnetilleggPeriode(barn.fødselsdato.verdi),
    );
};
