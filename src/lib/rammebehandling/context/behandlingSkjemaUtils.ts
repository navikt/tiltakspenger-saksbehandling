import {
    erOmgjøringResultat,
    erRammebehandlingInnvilgelseResultat,
    erSøknadsbehandlingResultat,
    hentTiltaksdeltakelserFraPeriode,
} from '~/lib/rammebehandling/rammebehandlingUtils';
import {
    InnvilgelseMedPerioderState,
    BehandlingMedInnvilgelseState,
    BehandlingMedInnvilgelsesperioderState,
} from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { SøknadsbehandlingState } from '~/lib/rammebehandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import {
    BehandlingSkjemaResultatState,
    BehandlingSkjemaState,
} from '~/lib/rammebehandling/context/behandlingSkjemaReducer';
import { krympPeriodisering, perioderOverlapper } from '~/utils/periode';
import { Periode } from '~/types/Periode';
import { Rammebehandling, SkalJournalføreNotat } from '~/lib/rammebehandling/typer/Rammebehandling';
import { BehandlingSkjemaContext } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { BarnetilleggPeriode } from '~/lib/rammebehandling/typer/Barnetillegg';
import { hentBarnetilleggForBehandling } from '~/lib/rammebehandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { OmgjøringContext } from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { hentRammevedtak } from '~/lib/sak/sakUtils';

export const ANTALL_DAGER_DEFAULT = 10;

export const erRammebehandlingInnvilgelseContext = (
    context: BehandlingSkjemaResultatState,
): context is BehandlingMedInnvilgelseState => {
    return erRammebehandlingInnvilgelseResultat(context.resultat);
};

export const erRammebehandlingInnvilgelseMedPerioderContext = (
    context: BehandlingSkjemaResultatState,
): context is BehandlingMedInnvilgelsesperioderState => {
    return erRammebehandlingInnvilgelseContext(context) && context.innvilgelse.harValgtPeriode;
};

export const erSøknadsbehandlingContext = (
    context: BehandlingSkjemaResultatState,
): context is SøknadsbehandlingState => {
    return erSøknadsbehandlingResultat(context.resultat);
};

export const erOmgjøringContext = (context: BehandlingSkjemaState): context is OmgjøringContext => {
    return erOmgjøringResultat(context.resultat);
};

export const skalJournalføreBarnetilleggNotat = (skjema: BehandlingSkjemaContext): boolean => {
    return (
        skjema.skalJournalføreNotat.barnetillegg &&
        erRammebehandlingInnvilgelseMedPerioderContext(skjema) &&
        skjema.innvilgelse.harBarnetillegg
    );
};

export const tilSkalJournalføreNotatDTO = (
    skjema: BehandlingSkjemaContext,
): SkalJournalføreNotat => {
    return {
        vilkårsvurdering: skjema.skalJournalføreNotat.vilkårsvurdering,
        barnetillegg: skalJournalføreBarnetilleggNotat(skjema),
    };
};

export enum BehandlingSkjemaType {
    Felles = 'Felles',
    Søknadsbehandling = 'Søknadsbehandling',
    RevurderingInnvilgelse = 'RevurderingInnvilgelse',
    RevurderingOmgjøring = 'RevurderingOmgjøring',
    RevurderingStans = 'RevurderingStans',
}

// Forhåndsutfyller andre perioder for en innvilgelse ut fra valgt innvilgelsesperiode
export const lagForhåndsutfyltInnvilgelse = (
    behandling: Rammebehandling,
    førsteInnvilgelsesperiode: Periode,
    sak: SakProps,
): InnvilgelseMedPerioderState => {
    const tiltak = hentTiltaksdeltakelserFraPeriode(behandling, førsteInnvilgelsesperiode);

    const innvilgelsesperioder: Innvilgelsesperiode[] = [
        {
            periode: førsteInnvilgelsesperiode,
            antallDagerPerMeldeperiode: antallDagerPerMeldeperiodeForPeriode(
                behandling,
                førsteInnvilgelsesperiode,
            ),
            internDeltakelseId: tiltak.atNonNull(
                0,
                'Fant ingen tiltaksdeltakelse som det kan innvilges for i valgt periode',
            ).internDeltakelseId,
        },
    ];

    const barnetilleggPerioder: BarnetilleggPeriode[] = hentBarnetilleggForBehandling(
        behandling,
        innvilgelsesperioder,
        sak,
    );

    return {
        harValgtPeriode: true,
        innvilgelsesperioder,
        harBarnetillegg: barnetilleggPerioder.length > 0,
        barnetilleggPerioder,
    };
};

// Henter det høyeste antall dager for en tiltaksdeltakelse fra saksopplysninger, eller default
// antall dager dersom ingen tiltak har satt antall dager
export const antallDagerPerMeldeperiodeForPeriode = (
    behandling: Rammebehandling,
    periode: Periode,
): number => {
    const dagerPerUke = hentTiltaksdeltakelserFraPeriode(behandling, periode).reduce((acc, td) => {
        const { antallDagerPerUke } = td;

        return antallDagerPerUke ? Math.max(antallDagerPerUke, acc) : acc;
    }, 0);

    return dagerPerUke === 0 ? ANTALL_DAGER_DEFAULT : dagerPerUke * 2;
};

export const finnGjeldendeInnvilgelserIPeriode = (sak: SakProps, periode: Periode): Periode[] => {
    return krympPeriodisering(sak.innvilgetTidslinje.elementer, periode)
        .flatMap((it) => hentRammevedtak(sak, it.rammevedtakId).gjeldendeInnvilgetPerioder)
        .filter((it) => perioderOverlapper(it, periode));
};
