import {
    Barnetillegg,
    BarnetilleggBarnKilde,
    BarnetilleggVersjon,
    BarnMedBarnetillegg,
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
import { hentRammevedtak } from '~/lib/sak/sakUtils';
import { removeDuplicatesFilter } from '~/utils/array';
import { erSladdet } from '~/utils/sladdetVerdi';
import { overlappendePeriode, totalPeriode } from '~/utils/periode';
import {
    BarnetilleggBarnSkjema,
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

const finnesIkkeFraFør = removeDuplicatesFilter<{ barn: BarnetilleggBarnSkjema }>(
    (a, b) => a.barn.key === b.barn.key,
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
                periode: null,
            },
            `${søknad.id}:${index}`,
        ),
        opplysninger: {
            oppholderSegIEØSSpm: barn.oppholderSegIEØSSpm,
            oppholdssted: barn.oppholdssted,
        },
    }));

/** Søknadene for tiltaksdeltakelsene det innvilges for, nyeste først. */
export const hentSøknaderForTiltaksdeltakelsene = (
    sak: SakProps,
    innvilgelsesperioder: Innvilgelsesperiode[],
): Søknad[] => {
    const internDeltakelseIder = new Set(innvilgelsesperioder.map((it) => it.internDeltakelseId));

    return sak.søknader
        .filter(
            (søknad) => søknad.tiltak && internDeltakelseIder.has(søknad.tiltak.internDeltakelseId),
        )
        .toSorted((a, b) => (a.mottatt > b.mottatt ? -1 : a.mottatt < b.mottatt ? 1 : 0));
};

/**
 * Barna fra søknaden(e) for innvilgelsen. For søknadsbehandlinger er dette søknaden som behandles,
 * ellers søknadene for tiltaksdeltakelsene det innvilges for. Barn som finnes i flere søknader tas med én gang,
 * fra den nyeste søknaden.
 */
export const hentBarnFraSøknader = (
    behandling: Rammebehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
    sak: SakProps,
): BarnFraSøknad[] => {
    const søknader =
        behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING
            ? [behandling.søknad]
            : hentSøknaderForTiltaksdeltakelsene(sak, innvilgelsesperioder);

    return søknader.flatMap(hentBarnFraSøknad).filter(finnesIkkeFraFør);
};

const tilSkjemaBarn = (barn: BarnMedBarnetillegg[], kilde: string): BarnetilleggBarnSkjema[] =>
    barn
        .map((it, index) => tilBarnetilleggBarnSkjema(it, `${kilde}:${index}`))
        .filter(removeDuplicatesFilter((a, b) => a.key === b.key));

export const hentLagretBarnetillegg = (behandling: Rammebehandling): Nullable<Barnetillegg> =>
    rammebehandlingMedInnvilgelseEllerNull(behandling)?.barnetillegg ?? null;

/** Barna som er lagret på behandlingen, dersom barnetillegget er lagret med barn (V2). */
export const hentLagredeBarn = (
    behandling: Rammebehandling,
): Nullable<BarnetilleggBarnSkjema[]> => {
    const lagret = hentLagretBarnetillegg(behandling);

    return lagret?.versjon === BarnetilleggVersjon.V2 ? tilSkjemaBarn(lagret.barn, 'lagret') : null;
};

/**
 * Barna fra gjeldende vedtak med barnetillegg lagret med barn (V2), nyeste vedtak først.
 * Perioden saksbehandler valgte i vedtaket gjelder ikke for denne innvilgelsen, så barna får hele innvilgelsesperioden.
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
        .map((barn) => ({ ...barn, periode: null }))
        .filter(removeDuplicatesFilter((a, b) => a.key === b.key));

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

    return alleBarn.map(({ barn }) => {
        const valgtBarn = valgteBarn.find((it) => it.key === barn.key);

        return {
            barn: valgtBarn ?? barn,
            erValgt: !!valgtBarn,
            søknadsopplysninger:
                barnFraSøknader.find((it) => it.barn.key === barn.key)?.opplysninger ?? null,
            kanFjernes: manueltLagtTilBarn.some((it) => it.key === barn.key),
        };
    });
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
 * En valgt periode som ikke overlapper innvilgelsesperiodene lenger, erstattes med hele innvilgelsesperioden.
 */
export const tilpassBarnTilInnvilgelsesperiodene = (
    barn: BarnetilleggBarnSkjema[],
    innvilgelsesperioder: Innvilgelsesperiode[],
): BarnetilleggBarnSkjema[] => {
    if (innvilgelsesperioder.length === 0) {
        return barn;
    }

    const total = totalPeriode(innvilgelsesperioder.map((it) => it.periode));

    return barn.map((it) =>
        it.periode ? { ...it, periode: overlappendePeriode(it.periode, total) } : it,
    );
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
                          periode: barn.periode,
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
