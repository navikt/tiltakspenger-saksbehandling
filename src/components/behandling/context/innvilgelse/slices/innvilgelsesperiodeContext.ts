import { Periode } from '~/types/Periode';
import {
    erFullstendigPeriode,
    joinPerioder,
    periodiseringerErLike,
    utvidPeriodisering,
} from '~/utils/periode';
import { InnvilgelseState } from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { Reducer } from 'react';
import { Rammebehandling, Rammebehandlingstype } from '~/types/Rammebehandling';
import { SakProps } from '~/types/Sak';
import { hentForhåndsutfyltInnvilgelse } from '~/components/behandling/context/behandlingSkjemaUtils';
import { hentVedtatteSøknadsbehandlinger } from '~/utils/sak';
import { periodiserBarnetilleggFraSøknad } from '~/components/behandling/felles/barnetillegg/utils/periodiserBarnetilleggFraSøknad';
import { Søknad } from '~/types/Søknad';
import { datoMax, datoMin } from '~/utils/date';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';

export type InnvilgelsesperiodeAction = {
    type: 'oppdaterInnvilgelsesperiode';
    payload: { periode: Partial<Periode>; behandling: Rammebehandling; sak: SakProps };
};

export const innvilgelsesperiodeReducer: Reducer<InnvilgelseState, InnvilgelsesperiodeAction> = (
    state,
    action,
) => {
    const { harValgtPeriode } = state;
    const { periode, behandling, sak } = action.payload;

    if (!harValgtPeriode) {
        const nyInnvilgelsesperiode = { ...state.innvilgelsesperiode, ...periode };

        if (erFullstendigPeriode(nyInnvilgelsesperiode)) {
            return hentForhåndsutfyltInnvilgelse(behandling, nyInnvilgelsesperiode, sak);
        }

        return {
            ...state,
            innvilgelsesperiode: nyInnvilgelsesperiode,
        };
    }

    const nyInnvilgelsesperiode = { ...state.innvilgelsesperiode, ...periode };

    const mestRelevanteSøknad =
        behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING
            ? behandling.søknad
            : hentVedtatteSøknadsbehandlinger(sak).at(0)!.søknad;

    return {
        ...state,
        innvilgelsesperiode: nyInnvilgelsesperiode,

        // Valgte tiltaksdeltagelser må alltid fylle hele innvilgelsesperioden
        valgteTiltaksdeltakelser: utvidPeriodisering(
            state.valgteTiltaksdeltakelser,
            nyInnvilgelsesperiode,
        ),

        // Antall dager per meldeperiode må alltid fylle hele innvilgelsesperioden
        antallDagerPerMeldeperiode: utvidPeriodisering(
            state.antallDagerPerMeldeperiode,
            nyInnvilgelsesperiode,
        ),

        barnetilleggPerioder: periodiserBarnetillegg(
            nyInnvilgelsesperiode,
            state.innvilgelsesperiode,
            state.barnetilleggPerioder,
            mestRelevanteSøknad,
        ),
    };
};

// Barnetillegg fyller ikke nødvendigvis hele innvilgelsesperioden, men vi forsøker å tilpasse for ny periode
// Vi har ikke alltid nok informasjon om barn til å gjøre dette perfekt, så det blir en en best-effort :|
const periodiserBarnetillegg = (
    nyPeriode: Periode,
    forrigePeriode: Periode,
    forrigeBarnetillegg: BarnetilleggPeriode[],
    søknad: Søknad,
) => {
    const barnetilleggFraSøknadForForrigePeriode = periodiserBarnetilleggFraSøknad(
        søknad.barnetillegg,
        forrigePeriode,
    );

    const harUendretPeriodisering = periodiseringerErLike(
        barnetilleggFraSøknadForForrigePeriode,
        forrigeBarnetillegg,
        (a, b) => a.antallBarn === b.antallBarn,
    );

    // Dersom periodiseringen fra søknaden er lik det saksbehandler hadde valgt, setter vi bare
    // en ny periodisering fra søknaden med den nye perioden.
    // Samme dersom saksbehandler ikke hadde valgt noen barnetilleggsperioder
    if (harUendretPeriodisering || forrigeBarnetillegg.length === 0) {
        return periodiserBarnetilleggFraSøknad(søknad.barnetillegg, nyPeriode);
    }

    const barnetilleggFraSøknad = periodiserBarnetilleggFraSøknad(
        søknad.barnetillegg,
        joinPerioder([nyPeriode, forrigePeriode]),
    );

    // Dersom det ikke finnes noen barn i søknaden for ny eller forrige periode, må vi anta at alle evt barn
    // har blitt lagt til manuelt av saksbehandler
    // Vi utvider bare eksisterende barnetillegg til ny periode
    if (barnetilleggFraSøknad.length === 0) {
        return utvidPeriodisering(forrigeBarnetillegg, nyPeriode);
    }

    const forrigeFraOgMed = forrigeBarnetillegg.at(0)!.periode.fraOgMed;
    const fraOgMedFraSøknad = barnetilleggFraSøknad.at(0)!.periode.fraOgMed;

    const forrigeTilOgMed = forrigeBarnetillegg.at(-1)!.periode.tilOgMed;
    const tilOgMedFraSøknad = barnetilleggFraSøknad.at(-1)!.periode.tilOgMed;

    // I alle andre tilfeller må saksbehandler ha gjort endringer ift den automatiske periodiseringen.
    // Vi oppdaterer den forrige periodiseringen med ny innvilgelsesperiode, men utvider ikke utenfor periodene vi får
    // fra søknaden, med mindre saksbehandler allerede hadde gjort nettopp det. Best-effort for å hindre at det innvilges
    // for barn <0 år eller >16 år
    return utvidPeriodisering(forrigeBarnetillegg, {
        fraOgMed:
            forrigeFraOgMed < fraOgMedFraSøknad
                ? nyPeriode.fraOgMed
                : datoMax(fraOgMedFraSøknad, nyPeriode.fraOgMed),
        tilOgMed:
            forrigeTilOgMed > tilOgMedFraSøknad
                ? nyPeriode.tilOgMed
                : datoMin(tilOgMedFraSøknad, nyPeriode.tilOgMed),
    });
};
