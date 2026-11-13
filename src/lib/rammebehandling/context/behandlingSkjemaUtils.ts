import {
    erOmgjøringResultat,
    erRammebehandlingInnvilgelseResultat,
    erSøknadsbehandlingResultat,
} from '~/lib/rammebehandling/rammebehandlingUtils';
import {
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
import { SkalJournalføreNotat } from '~/lib/rammebehandling/typer/Rammebehandling';
import { BehandlingSkjemaContext } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { OmgjøringContext } from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { hentRammevedtak } from '~/lib/sak/sakUtils';

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
    RevurderingForlengelse = 'RevurderingForlengelse',
    RevurderingOmgjøring = 'RevurderingOmgjøring',
    RevurderingStans = 'RevurderingStans',
}

export const finnGjeldendeInnvilgelserIPeriode = (sak: SakProps, periode: Periode): Periode[] => {
    return krympPeriodisering(sak.innvilgetTidslinje.elementer, periode)
        .flatMap((it) => hentRammevedtak(sak, it.rammevedtakId).gjeldendeInnvilgetPerioder)
        .filter((it) => perioderOverlapper(it, periode));
};
