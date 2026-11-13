import {
    Barnetillegg,
    BarnetilleggKandidatDTO,
    BarnetilleggV1,
    BarnetilleggVersjon,
    BarnMedBarnetillegg,
    OppdaterBarnetilleggBarnDTO,
    OppdaterBarnetilleggDTO,
} from '~/lib/rammebehandling/typer/Barnetillegg';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { Nullable } from '~/types/UtilTypes';
import {
    erAvsluttet,
    rammebehandlingMedInnvilgelseEllerNull,
} from '~/lib/rammebehandling/rammebehandlingUtils';
import { removeDuplicatesFilter } from '~/utils/array';
import { erSladdet, hentVerdi } from '~/utils/sladdetVerdi';
import { isNonNullish } from '~/utils/object';
import { overlappendePeriode, totalPeriode } from '~/utils/periode';
import {
    BarnetilleggBarnSkjema,
    erBarnFraSaksbehandler,
    erSammeBarn,
    harRettIInnvilgelsesperiodene,
    tilBarnetilleggBarnSkjema,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import { kunPerioderMedBarn } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggUtils';
import type { InnvilgelseMedPerioderState } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';

export type BarnetilleggSkjemaState = Pick<
    InnvilgelseMedPerioderState,
    'harBarnetillegg' | 'valgteBarn' | 'manueltLagtTilBarn'
>;

export type BarnFraSøknad = {
    barn: BarnetilleggBarnSkjema;
    opplysninger: NonNullable<BarnetilleggKandidatDTO['søknadsopplysninger']>;
};

export type BarnetilleggKandidat = {
    barn: BarnetilleggBarnSkjema;
    erValgt: boolean;
    // Opplysninger om barnet fra søknaden, dersom barnet finnes i en av søknadene
    søknadsopplysninger: BarnetilleggKandidatDTO['søknadsopplysninger'];
    // Barn saksbehandler har lagt til i denne behandlingen, og som ikke finnes i søknadene eller gjeldende vedtak
    kanFjernes: boolean;
};

type AktuellKandidat = Pick<
    BarnetilleggKandidatDTO,
    'søknadsopplysninger' | 'fraGjeldendeVedtak'
> & {
    barn: BarnetilleggBarnSkjema;
};

const finnesIkkeFraFør = removeDuplicatesFilter<{ barn: BarnetilleggBarnSkjema }>((a, b) =>
    erSammeBarn(a.barn, b.barn),
);

/**
 * Kandidatene fra backend som er aktuelle for tiltaksdeltakelsene det innvilges for, med hele innvilgelsesperioden.
 * Barn fra søknader i revurderinger er bare aktuelle når søknaden er innvilget for en av tiltaksdeltakelsene.
 */
const hentAktuelleKandidater = (
    behandling: Rammebehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
): AktuellKandidat[] => {
    const internDeltakelseIder = new Set(innvilgelsesperioder.map((it) => it.internDeltakelseId));

    return behandling.barnetilleggKandidater
        .filter(
            (it) =>
                it.internDeltakelseIder === null ||
                it.internDeltakelseIder.some((id) => internDeltakelseIder.has(id)),
        )
        .map((it, index) => ({
            barn: tilBarnetilleggBarnSkjema({ ...it, perioder: null }, `kandidat:${index}`),
            søknadsopplysninger: it.søknadsopplysninger,
            fraGjeldendeVedtak: it.fraGjeldendeVedtak,
        }));
};

/** Barna fra søknaden(e) som er aktuelle for tiltaksdeltakelsene det innvilges for. */
export const hentBarnFraSøknader = (
    behandling: Rammebehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
): BarnFraSøknad[] =>
    hentAktuelleKandidater(behandling, innvilgelsesperioder).flatMap(
        ({ barn, søknadsopplysninger }) =>
            søknadsopplysninger ? [{ barn, opplysninger: søknadsopplysninger }] : [],
    );

const tilSkjemaBarn = (barn: BarnMedBarnetillegg[], kilde: string): BarnetilleggBarnSkjema[] =>
    barn
        .map((it, index) => tilBarnetilleggBarnSkjema(it, `${kilde}:${index}`))
        .filter(removeDuplicatesFilter(erSammeBarn));

export const hentLagretBarnetillegg = (behandling: Rammebehandling): Nullable<Barnetillegg> =>
    rammebehandlingMedInnvilgelseEllerNull(behandling)?.barnetillegg ?? null;

/**
 * Barnetillegget lagret som antall barn per periode (V1), dersom behandlingen ikke kan endres.
 * Det kan ikke vises med barn, og vises derfor som det er lagret.
 * Backend forhåndsviser brevet med det lagrede barnetillegget når behandlingen ikke kan endres.
 */
export const hentLagretV1SomIkkeKanEndres = (
    behandling: Rammebehandling,
    erReadonly: boolean,
): Nullable<BarnetilleggV1> => {
    const lagret = hentLagretBarnetillegg(behandling);

    return erReadonly && lagret?.versjon === BarnetilleggVersjon.V1 ? lagret : null;
};

/**
 * Barnetillegg lagret som antall barn per periode (V1) med barn, forhåndsvelger barn i skjemaet når behandlingen kan endres.
 * Skjemaet viser da noe annet enn det som er lagret, og må lagres før behandlingen sendes til beslutning.
 */
export const harUlagretBarnetilleggFraV1 = (
    behandling: Rammebehandling,
    erReadonly: boolean,
): boolean => {
    const lagret = hentLagretBarnetillegg(behandling);

    return (
        !erReadonly &&
        lagret?.versjon === BarnetilleggVersjon.V1 &&
        lagret.perioder.some(kunPerioderMedBarn)
    );
};

/** Barna som er lagret på behandlingen, dersom barnetillegget er lagret med barn (V2). */
export const hentLagredeBarn = (
    behandling: Rammebehandling,
): Nullable<BarnetilleggBarnSkjema[]> => {
    const lagret = hentLagretBarnetillegg(behandling);

    return lagret?.versjon === BarnetilleggVersjon.V2 ? tilSkjemaBarn(lagret.barn, 'lagret') : null;
};

/**
 * Barna saksbehandler kan velge å gi barnetillegg for, sortert med eldste først.
 * Det er de aktuelle kandidatene fra backend, og barn lagt til av saksbehandler.
 * Lagrede barn lagt til av saksbehandler er med i [manueltLagtTilBarn] til de fjernes.
 * Valgte barn vises med valgene saksbehandler har gjort.
 * For avsluttede behandlinger vises bare de valgte barna.
 * Kandidatene utledes fra saken slik den er nå, og ville kunnet vise barn som ikke var aktuelle da behandlingen ble avsluttet.
 */
export const hentBarnetilleggKandidater = (
    behandling: Rammebehandling,
    innvilgelse: Pick<
        InnvilgelseMedPerioderState,
        'innvilgelsesperioder' | 'valgteBarn' | 'manueltLagtTilBarn'
    >,
): BarnetilleggKandidat[] => {
    const { innvilgelsesperioder, valgteBarn, manueltLagtTilBarn } = innvilgelse;

    const aktuelleKandidater = hentAktuelleKandidater(behandling, innvilgelsesperioder);

    const alleBarn = (
        erAvsluttet(behandling)
            ? valgteBarn
            : [...aktuelleKandidater.map((it) => it.barn), ...manueltLagtTilBarn, ...valgteBarn]
    )
        .map((barn) => ({ barn }))
        .filter(finnesIkkeFraFør);

    return alleBarn.toSorted(eldsteFørst).map(({ barn }) => {
        const valgtBarn = valgteBarn.find((it) => erSammeBarn(it, barn));
        const kandidat = aktuelleKandidater.find((it) => erSammeBarn(it.barn, barn));

        return {
            barn: valgtBarn ?? barn,
            erValgt: !!valgtBarn,
            søknadsopplysninger: kandidat?.søknadsopplysninger ?? null,
            kanFjernes: manueltLagtTilBarn.some((it) => it.key === barn.key) && !kandidat,
        };
    });
};

/** Sorterer eldste barn først, og barn med sladdet fødselsdato sist */
const eldsteFørst = (
    a: { barn: BarnetilleggBarnSkjema },
    b: { barn: BarnetilleggBarnSkjema },
): number => {
    const fødselsdatoA = hentVerdi(a.barn.fødselsdato);
    const fødselsdatoB = hentVerdi(b.barn.fødselsdato);

    if (!fødselsdatoA || !fødselsdatoB) {
        return Number(!fødselsdatoA) - Number(!fødselsdatoB);
    }

    return fødselsdatoA.localeCompare(fødselsdatoB);
};

const harRett = (barn: BarnetilleggBarnSkjema, innvilgelsesperioder: Innvilgelsesperiode[]) =>
    harRettIInnvilgelsesperiodene(
        barn,
        innvilgelsesperioder.map((it) => it.periode),
    );

/**
 * Barna som forhåndsvelges når saksbehandler ikke har valgt barn tidligere, med hele innvilgelsesperioden.
 * Ved revurdering brukes barna fra gjeldende vedtak dersom de er valgt med barn (V2).
 * Ellers velges barna fra søknaden(e) som oppholder seg i EØS. Bare barn som har rett i innvilgelsesperiodene velges.
 */
export const hentForhåndsvalgteBarn = (
    behandling: Rammebehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
): BarnetilleggBarnSkjema[] => {
    const kandidaterMedRett = hentAktuelleKandidater(behandling, innvilgelsesperioder).filter(
        (it) => harRett(it.barn, innvilgelsesperioder),
    );

    const barnFraVedtak = kandidaterMedRett.filter((it) => it.fraGjeldendeVedtak);

    return (
        barnFraVedtak.length > 0
            ? barnFraVedtak
            : kandidaterMedRett.filter(
                  (it) => it.søknadsopplysninger?.oppholderSegIEØSSpm.svar === 'JA',
              )
    ).map((it) => it.barn);
};

/**
 * Barnetillegget i skjemaet ved oppstart, eller når innvilgelsesperioden velges.
 * Lagrede barn brukes som de er, og de som er lagt til av saksbehandler kan fjernes igjen.
 * Er barnetillegget lagret som antall barn per periode (V1), eller ikke lagret, forhåndsvelges barn.
 * For V1 beholdes svaret på om det skal være barnetillegg.
 */
export const lagBarnetilleggSkjemaState = (
    behandling: Rammebehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
): BarnetilleggSkjemaState => {
    const lagret = hentLagretBarnetillegg(behandling);

    if (lagret?.versjon === BarnetilleggVersjon.V2) {
        const valgteBarn = tilpassBarnTilInnvilgelsesperiodene(
            hentLagredeBarn(behandling) ?? [],
            innvilgelsesperioder,
        );

        return {
            harBarnetillegg: valgteBarn.length > 0,
            valgteBarn,
            manueltLagtTilBarn: valgteBarn.filter(erBarnFraSaksbehandler),
        };
    }

    const forhåndsvalgteBarn = hentForhåndsvalgteBarn(behandling, innvilgelsesperioder);

    if (lagret) {
        const harBarnetillegg = lagret.perioder.some(kunPerioderMedBarn);

        return {
            harBarnetillegg,
            valgteBarn: harBarnetillegg ? forhåndsvalgteBarn : [],
            manueltLagtTilBarn: [],
        };
    }

    return {
        harBarnetillegg: forhåndsvalgteBarn.length > 0,
        valgteBarn: forhåndsvalgteBarn,
        manueltLagtTilBarn: [],
    };
};

/**
 * Tilpasser valgte perioder til nye innvilgelsesperioder.
 * Valgte perioder som ikke overlapper innvilgelsesperiodene lenger, fjernes.
 * Overlapper ingen av dem, får barnet hele innvilgelsesperioden.
 */
export const tilpassBarnTilInnvilgelsesperiodene = (
    barn: BarnetilleggBarnSkjema[],
    innvilgelsesperioder: Innvilgelsesperiode[],
): BarnetilleggBarnSkjema[] => {
    if (innvilgelsesperioder.length === 0) {
        return barn;
    }

    const total = totalPeriode(innvilgelsesperioder.map((it) => it.periode));

    return barn.map((it) => {
        if (!it.perioder) {
            return it;
        }

        const perioder = it.perioder
            .map((periode) => overlappendePeriode(periode, total))
            .filter(isNonNullish);

        return { ...it, perioder: perioder.length > 0 ? perioder : null };
    });
};

/**
 * Barnetillegget som sendes til backend. Ingen barnetillegg sendes som en tom liste med barn.
 * Barn med sladdet fødselsdato kan ikke sendes, men slike barn kan heller ikke velges av saksbehandlere
 * som får se sladdede verdier.
 */
export const tilOppdaterBarnetilleggDTO = (
    innvilgelse: Pick<InnvilgelseMedPerioderState, 'harBarnetillegg' | 'valgteBarn'>,
    begrunnelse: Nullable<string>,
): OppdaterBarnetilleggDTO => {
    if (!innvilgelse.harBarnetillegg) {
        return { barn: [], begrunnelse: null };
    }

    return {
        barn: innvilgelse.valgteBarn.flatMap((barn): OppdaterBarnetilleggBarnDTO[] =>
            erSladdet(barn.fødselsdato)
                ? []
                : [
                      {
                          fnr: tilTekstEllerNull(barn.fnr),
                          fornavn: tilTekstEllerNull(barn.fornavn),
                          mellomnavn: tilTekstEllerNull(barn.mellomnavn),
                          etternavn: tilTekstEllerNull(barn.etternavn),
                          fødselsdato: barn.fødselsdato.verdi,
                          kilde: barn.kilde,
                          søknadId: barn.søknadId,
                          perioder: barn.perioder,
                      },
                  ],
        ),
        begrunnelse,
    };
};

const tilTekstEllerNull = (verdi: BarnetilleggBarnSkjema['fnr']): Nullable<string> => {
    if (erSladdet(verdi)) {
        return null;
    }

    const tekst = verdi.verdi?.trim();

    return tekst ? tekst : null;
};
