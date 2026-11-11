import {
    Barnetillegg,
    BarnetilleggBarnKilde,
    BarnetilleggV1,
    BarnetilleggVersjon,
    BarnMedBarnetillegg,
    ForhåndsvisningBarnetilleggDTO,
    OppdaterBarnetilleggBarnDTO,
    OppdaterBarnetilleggDTO,
} from '~/lib/rammebehandling/typer/Barnetillegg';
import { Søknad, SøknadBarn } from '~/lib/søknad/søknadTyper';
import { SakProps } from '~/lib/sak/SakTyper';
import { Rammebehandling, Rammebehandlingstype } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Søknadsbehandling } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { Nullable } from '~/types/UtilTypes';
import { rammebehandlingMedInnvilgelseEllerNull } from '~/lib/rammebehandling/rammebehandlingUtils';
import { hentRammevedtak, hentVedtatteSøknadsbehandlinger } from '~/lib/sak/sakUtils';
import { removeDuplicatesFilter } from '~/utils/array';
import { erSladdet, hentVerdi } from '~/utils/sladdetVerdi';
import { isNonNullish } from '~/utils/object';
import { overlappendePeriode, totalPeriode } from '~/utils/periode';
import {
    BarnetilleggBarnSkjema,
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
    opplysninger: Pick<SøknadBarn, 'oppholderSegIEØSSpm' | 'oppholdssted'>;
};

export type BarnetilleggKandidat = {
    barn: BarnetilleggBarnSkjema;
    erValgt: boolean;
    // Opplysninger om barnet fra søknaden, dersom barnet finnes i en av søknadene
    søknadsopplysninger: Nullable<BarnFraSøknad['opplysninger']>;
    // Barn saksbehandler har lagt til i denne behandlingen, og som ikke er lagret ennå
    kanFjernes: boolean;
};

const finnesIkkeFraFør = removeDuplicatesFilter<{ barn: BarnetilleggBarnSkjema }>((a, b) =>
    erSammeBarn(a.barn, b.barn),
);

export const hentBarnFraSøknad = (søknad: Søknad): BarnFraSøknad[] =>
    søknad.barnetillegg.map((barn, index) => ({
        barn: tilBarnetilleggBarnSkjema(
            {
                fnr: barn.fnr,
                fornavn: barn.fornavn,
                mellomnavn: barn.mellomnavn,
                etternavn: barn.etternavn,
                fødselsdato: barn.fødselsdato,
                kilde: BarnetilleggBarnKilde.SØKNAD,
                søknadId: søknad.id,
                perioder: null,
            },
            `${søknad.id}:${index}`,
        ),
        opplysninger: {
            oppholderSegIEØSSpm: barn.oppholderSegIEØSSpm,
            oppholdssted: barn.oppholdssted,
        },
    }));

/**
 * Søknadene fra innvilgede søknadsbehandlinger av tiltaksdeltakelsene det innvilges for, nyeste vedtak først.
 * Søknader som ikke er innvilget ennå, behandles i sin egen søknadsbehandling.
 */
export const hentInnvilgedeSøknaderForTiltaksdeltakelsene = (
    sak: SakProps,
    innvilgelsesperioder: Innvilgelsesperiode[],
): Søknad[] => {
    const internDeltakelseIder = new Set(innvilgelsesperioder.map((it) => it.internDeltakelseId));

    return hentVedtatteSøknadsbehandlinger(sak)
        .filter((behandling) =>
            behandling.innvilgelsesperioder.some((it) =>
                internDeltakelseIder.has(it.internDeltakelseId),
            ),
        )
        .map((behandling) => behandling.søknad)
        .filter(removeDuplicatesFilter((a, b) => a.id === b.id));
};

/**
 * Barna fra søknaden(e) for innvilgelsen. For søknadsbehandlinger er dette søknaden som behandles,
 * ellers søknadene fra innvilgede søknadsbehandlinger av tiltaksdeltakelsene det innvilges for.
 * Barn som finnes i flere søknader tas med én gang, fra den nyeste innvilgede søknaden.
 */
export const hentBarnFraSøknader = (
    behandling: Rammebehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
    sak: SakProps,
): BarnFraSøknad[] => {
    const søknader =
        behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING
            ? [behandling.søknad]
            : hentInnvilgedeSøknaderForTiltaksdeltakelsene(sak, innvilgelsesperioder);

    return søknader.flatMap(hentBarnFraSøknad).filter(finnesIkkeFraFør);
};

const tilSkjemaBarn = (barn: BarnMedBarnetillegg[], kilde: string): BarnetilleggBarnSkjema[] =>
    barn
        .map((it, index) => tilBarnetilleggBarnSkjema(it, `${kilde}:${index}`))
        .filter(removeDuplicatesFilter(erSammeBarn));

export const hentLagretBarnetillegg = (behandling: Rammebehandling): Nullable<Barnetillegg> =>
    rammebehandlingMedInnvilgelseEllerNull(behandling)?.barnetillegg ?? null;

/**
 * Barnetillegget lagret som antall barn per periode (V1), dersom behandlingen ikke kan endres.
 * Det kan ikke vises med barn, og vises og forhåndsvises derfor som det er lagret.
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

/**
 * Barnetillegget som sendes til forhåndsvisning av brev.
 * Lagret V1 som ikke kan endres sendes som antall barn per periode, siden barna i skjemaet bare er forhåndsvalgt.
 */
export const tilForhåndsvisningBarnetilleggDTO = (
    behandling: Rammebehandling,
    innvilgelse: Pick<InnvilgelseMedPerioderState, 'harBarnetillegg' | 'valgteBarn'>,
    erReadonly: boolean,
    begrunnelse: Nullable<string>,
): ForhåndsvisningBarnetilleggDTO => {
    const lagretV1 = hentLagretV1SomIkkeKanEndres(behandling, erReadonly);

    if (lagretV1) {
        return {
            perioder: innvilgelse.harBarnetillegg ? lagretV1.perioder : [],
            begrunnelse: innvilgelse.harBarnetillegg ? begrunnelse : null,
        };
    }

    return tilOppdaterBarnetilleggDTO(innvilgelse, begrunnelse);
};

/** Barna som er lagret på behandlingen, dersom barnetillegget er lagret med barn (V2). */
export const hentLagredeBarn = (
    behandling: Rammebehandling,
): Nullable<BarnetilleggBarnSkjema[]> => {
    const lagret = hentLagretBarnetillegg(behandling);

    return lagret?.versjon === BarnetilleggVersjon.V2 ? tilSkjemaBarn(lagret.barn, 'lagret') : null;
};

/**
 * Barna fra gjeldende vedtak med barnetillegg lagret med barn (V2), nyeste vedtak først.
 * Periodene saksbehandler valgte i vedtaket gjelder ikke for denne innvilgelsen, så barna får hele innvilgelsesperioden.
 */
export const hentBarnFraGjeldendeVedtak = (sak: SakProps): BarnetilleggBarnSkjema[] =>
    sak.innvilgetTidslinje.elementer
        .map((it) => it.rammevedtakId)
        .filter(removeDuplicatesFilter())
        .map((vedtakId) => hentRammevedtak(sak, vedtakId))
        .toSorted((a, b) => (a.opprettet > b.opprettet ? -1 : a.opprettet < b.opprettet ? 1 : 0))
        .flatMap((vedtak) =>
            vedtak.barnetillegg?.versjon === BarnetilleggVersjon.V2
                ? tilSkjemaBarn(vedtak.barnetillegg.barn, vedtak.id)
                : [],
        )
        .map((barn) => ({ ...barn, perioder: null }))
        .filter(removeDuplicatesFilter(erSammeBarn));

/**
 * Barna saksbehandler kan velge å gi barnetillegg for, i en fast rekkefølge:
 * lagrede barn, barn fra søknadene, barn fra gjeldende vedtak, og barn lagt til av saksbehandler.
 * Valgte barn vises med valgene saksbehandler har gjort.
 */
export const hentBarnetilleggKandidater = (
    behandling: Rammebehandling,
    innvilgelse: Pick<
        InnvilgelseMedPerioderState,
        'innvilgelsesperioder' | 'valgteBarn' | 'manueltLagtTilBarn'
    >,
    sak: SakProps,
): BarnetilleggKandidat[] => {
    const { innvilgelsesperioder, valgteBarn, manueltLagtTilBarn } = innvilgelse;

    const barnFraSøknader = hentBarnFraSøknader(behandling, innvilgelsesperioder, sak);
    const barnFraVedtak =
        behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING
            ? []
            : hentBarnFraGjeldendeVedtak(sak);

    const alleBarn = [
        ...(hentLagredeBarn(behandling) ?? []),
        ...barnFraSøknader.map((it) => it.barn),
        ...barnFraVedtak,
        ...manueltLagtTilBarn,
        ...valgteBarn,
    ]
        .map((barn) => ({ barn }))
        .filter(finnesIkkeFraFør);

    return alleBarn.toSorted(eldsteFørst).map(({ barn }) => {
        const valgtBarn = valgteBarn.find((it) => erSammeBarn(it, barn));

        return {
            barn: valgtBarn ?? barn,
            erValgt: !!valgtBarn,
            søknadsopplysninger:
                barnFraSøknader.find((it) => erSammeBarn(it.barn, barn))?.opplysninger ?? null,
            kanFjernes: manueltLagtTilBarn.some((it) => it.key === barn.key),
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

/** Barna fra søknaden(e) som oppholder seg i EØS og har rett i innvilgelsesperiodene */
export const forhåndsvelgBarnFraSøknader = (
    barnFraSøknader: BarnFraSøknad[],
    innvilgelsesperioder: Innvilgelsesperiode[],
): BarnetilleggBarnSkjema[] =>
    barnFraSøknader
        .filter((it) => it.opplysninger.oppholderSegIEØSSpm.svar === 'JA')
        .map((it) => it.barn)
        .filter((barn) => harRett(barn, innvilgelsesperioder));

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
    sak: SakProps,
): BarnetilleggBarnSkjema[] => {
    if (behandling.type !== Rammebehandlingstype.SØKNADSBEHANDLING) {
        const barnFraVedtak = hentBarnFraGjeldendeVedtak(sak).filter((barn) =>
            harRett(barn, innvilgelsesperioder),
        );

        if (barnFraVedtak.length > 0) {
            return barnFraVedtak;
        }
    }

    return forhåndsvelgBarnFraSøknader(
        hentBarnFraSøknader(behandling, innvilgelsesperioder, sak),
        innvilgelsesperioder,
    );
};

/**
 * Barnetillegget i skjemaet ved oppstart, eller når innvilgelsesperioden velges.
 * Lagrede barn brukes som de er. Er barnetillegget lagret som antall barn per periode (V1),
 * eller ikke lagret, forhåndsvelges barn. For V1 beholdes svaret på om det skal være barnetillegg.
 */
export const lagBarnetilleggSkjemaState = (
    behandling: Rammebehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
    sak: SakProps,
): BarnetilleggSkjemaState =>
    lagSkjemaState(behandling, innvilgelsesperioder, () =>
        hentForhåndsvalgteBarn(behandling, innvilgelsesperioder, sak),
    );

// Søknadsbehandlinger henter barna kun fra søknaden som behandles, og trenger derfor ikke saken.
export const lagBarnetilleggSkjemaStateForSøknadsbehandling = (
    behandling: Søknadsbehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
): BarnetilleggSkjemaState =>
    lagSkjemaState(behandling, innvilgelsesperioder, () =>
        forhåndsvelgBarnFraSøknader(
            hentBarnFraSøknad(behandling.søknad).filter(finnesIkkeFraFør),
            innvilgelsesperioder,
        ),
    );

const lagSkjemaState = (
    behandling: Rammebehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
    hentForhåndsvalgte: () => BarnetilleggBarnSkjema[],
): BarnetilleggSkjemaState => {
    const lagret = hentLagretBarnetillegg(behandling);

    if (lagret?.versjon === BarnetilleggVersjon.V2) {
        const valgteBarn = tilpassBarnTilInnvilgelsesperiodene(
            hentLagredeBarn(behandling) ?? [],
            innvilgelsesperioder,
        );

        return { harBarnetillegg: valgteBarn.length > 0, valgteBarn, manueltLagtTilBarn: [] };
    }

    const forhåndsvalgteBarn = hentForhåndsvalgte();

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
