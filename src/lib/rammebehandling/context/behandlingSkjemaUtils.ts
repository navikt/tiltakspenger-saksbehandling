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
import { BehandlingSkjemaState } from '~/lib/rammebehandling/context/behandlingSkjemaReducer';
import {
    inneholderHelePerioden,
    krympPeriodisering,
    perioderOverlapper,
    sorterPeriodisering,
} from '~/utils/periode';
import { datoMax, datoMin, forrigeDag, nesteDag } from '~/utils/date';
import { MedPeriode, Periode } from '~/types/Periode';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SakProps } from '~/lib/sak/SakTyper';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { BarnetilleggPeriode } from '~/lib/rammebehandling/typer/Barnetillegg';
import { hentBarnetilleggForBehandling } from '~/lib/rammebehandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { OmgjøringContext } from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';

export const ANTALL_DAGER_DEFAULT = 10;

export const erRammebehandlingInnvilgelseContext = (
    context: BehandlingSkjemaState,
): context is BehandlingMedInnvilgelseState => {
    return erRammebehandlingInnvilgelseResultat(context.resultat);
};

export const erRammebehandlingInnvilgelseMedPerioderContext = (
    context: BehandlingSkjemaState,
): context is BehandlingMedInnvilgelsesperioderState => {
    return erRammebehandlingInnvilgelseContext(context) && context.innvilgelse.harValgtPeriode;
};

export const erSøknadsbehandlingContext = (
    context: BehandlingSkjemaState,
): context is SøknadsbehandlingState => {
    return erSøknadsbehandlingResultat(context.resultat);
};

export const erOmgjøringContext = (context: BehandlingSkjemaState): context is OmgjøringContext => {
    return erOmgjøringResultat(context.resultat);
};

export enum BehandlingSkjemaType {
    Søknadsbehandling = 'Søknadsbehandling',
    RevurderingInnvilgelse = 'RevurderingInnvilgelse',
    RevurderingOmgjøring = 'RevurderingOmgjøring',
    RevurderingStans = 'RevurderingStans',
}

export const oppdaterPeriodiseringUtenOverlapp = <T extends MedPeriode>(
    listeMedPerioder: T[],
    oppdatertElement: T,
    oppdatertIndex: number,
): T[] => {
    return listeMedPerioder
        .toSpliced(oppdatertIndex, 1, oppdatertElement)
        .filter((it, index) => {
            if (index === oppdatertIndex) {
                return true;
            }

            return !inneholderHelePerioden(oppdatertElement.periode, it.periode);
        })
        .map((it) => {
            if (it === oppdatertElement) {
                return it;
            }

            const erTidligerePeriode = it.periode.fraOgMed < oppdatertElement.periode.fraOgMed;

            return {
                ...it,
                periode: erTidligerePeriode
                    ? {
                          fraOgMed: it.periode.fraOgMed,
                          tilOgMed: datoMin(
                              it.periode.tilOgMed,
                              forrigeDag(oppdatertElement.periode.fraOgMed),
                          ),
                      }
                    : {
                          fraOgMed: datoMax(
                              it.periode.fraOgMed,
                              nesteDag(oppdatertElement.periode.tilOgMed),
                          ),
                          tilOgMed: it.periode.tilOgMed,
                      },
            };
        })
        .toSorted(sorterPeriodisering());
};

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
            internDeltakelseId: tiltak.at(0)!.internDeltakelseId,
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
        skalSendeVedtaksbrev:
            behandling.resultat === RevurderingResultat.OMGJØRING
                ? behandling.skalSendeVedtaksbrev
                : true,
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
        .flatMap((it) => it.rammevedtak.gjeldendeInnvilgetPerioder)
        .filter((it) => perioderOverlapper(it, periode));
};
