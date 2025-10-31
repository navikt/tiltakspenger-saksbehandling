import {
    hentHeleTiltaksdeltagelsesperioden,
    hentTiltaksdeltagelseFraSøknad,
    hentTiltaksdeltakelserMedStartOgSluttdato,
    hentTiltaksperiodeFraSøknad,
} from '~/utils/behandling';
import {
    hentBarnetilleggForRevurdering,
    hentBarnetilleggForSøknadsbehandling,
} from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { BehandlingSkjemaState } from '~/components/behandling/context/BehandlingSkjemaReducer';
import { Periode } from '~/types/Periode';
import { SakProps } from '~/types/Sak';
import { erDatoIPeriode } from '~/utils/periode';
import { ANTALL_DAGER_DEFAULT } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import {
    Rammebehandlingstype,
    Rammebehandling,
    RammebehandlingMedInnvilgelse,
} from '~/types/Rammebehandling';
import { TiltaksdeltakelsePeriodeFormData } from './slices/TiltaksdeltagelseState';
import {
    Søknadsbehandling,
    SøknadsbehandlingAvslag,
    SøknadsbehandlingIkkeValgt,
    SøknadsbehandlingInnvilgelse,
    SøknadsbehandlingResultat,
} from '~/types/Søknadsbehandling';
import {
    Revurdering,
    RevurderingInnvilgelse,
    RevurderingOmgjøring,
    RevurderingResultat,
    RevurderingStans,
} from '~/types/Revurdering';
import { AntallDagerPerMeldeperiodeFormData } from '~/components/behandling/context/slices/AntallDagerPerMeldeperiodeState';
import { Nullable } from '~/types/UtilTypes';

export const behandlingSkjemaInitialValue = ({
    behandling,
    sak,
}: {
    behandling: Rammebehandling;
    sak: SakProps;
}): BehandlingSkjemaState => {
    const { type } = behandling;

    switch (type) {
        case Rammebehandlingstype.SØKNADSBEHANDLING: {
            return søknadsbehandlingInitialState(behandling);
        }
        case Rammebehandlingstype.REVURDERING: {
            return revurderingInitialState(behandling, sak);
        }
    }

    throw new Error(`Ukjent behandlingstype: ${type satisfies never}`);
};

const valgteTiltaksdeltakelserDefault = (
    behandling: Søknadsbehandling,
): TiltaksdeltakelsePeriodeFormData[] => {
    const tiltakFraSøknad = hentTiltaksdeltagelseFraSøknad(behandling);
    const behandlingsperiode =
        behandling.virkningsperiode ?? hentTiltaksperiodeFraSøknad(behandling);

    return tiltakFraSøknad
        ? [
              {
                  eksternDeltagelseId: tiltakFraSøknad.eksternDeltagelseId,
                  periode: {
                      fraOgMed: behandlingsperiode?.fraOgMed ?? null,
                      tilOgMed: behandlingsperiode?.tilOgMed ?? null,
                  },
              },
          ]
        : [];
};

const antallDagerDefault = (
    behandling: Søknadsbehandling,
): AntallDagerPerMeldeperiodeFormData[] => {
    const tiltaksperiode = hentTiltaksperiodeFraSøknad(behandling);

    return [
        {
            antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
            periode: behandling.virkningsperiode
                ? {
                      fraOgMed: behandling.virkningsperiode.fraOgMed,
                      tilOgMed: behandling.virkningsperiode.tilOgMed,
                  }
                : tiltaksperiode?.fraOgMed && tiltaksperiode?.tilOgMed
                  ? {
                        fraOgMed: tiltaksperiode.fraOgMed,
                        tilOgMed: tiltaksperiode.tilOgMed,
                    }
                  : { fraOgMed: null, tilOgMed: null },
        },
    ];
};

const hentBehandlingsperiode = (behandling: Søknadsbehandling): Nullable<Periode> => {
    return behandling.virkningsperiode ?? hentTiltaksperiodeFraSøknad(behandling);
};

const søknadsbehandlingInitialState = (behandling: Søknadsbehandling): BehandlingSkjemaState => {
    const { resultat } = behandling;

    switch (resultat) {
        case SøknadsbehandlingResultat.IKKE_VALGT: {
            return fraSøknadsbehandlingIkkeValgt(behandling);
        }
        case SøknadsbehandlingResultat.INNVILGELSE: {
            return fraSøknadsbehandlingInnvilgelse(behandling);
        }
        case SøknadsbehandlingResultat.AVSLAG: {
            return fraSøknadsbehandlingAvslag(behandling);
        }
    }

    throw new Error(`Ukjent søknadsbehandling resultat: ${resultat satisfies never}`);
};

const fraSøknadsbehandlingIkkeValgt = (
    behandling: SøknadsbehandlingIkkeValgt,
): BehandlingSkjemaState => {
    const barnetilleggPerioder = hentBarnetilleggForSøknadsbehandling(behandling);

    return {
        resultat: behandling.resultat,
        behandlingsperiode: hentBehandlingsperiode(behandling),

        // Ikke i bruk for denne resultattypen, men det må populeres ettersom resultat kan endres
        // til innvilgelse, der disse feltene er påkrevd.
        harBarnetillegg: barnetilleggPerioder.length > 0,
        barnetilleggPerioder: barnetilleggPerioder,
        valgteTiltaksdeltakelser: valgteTiltaksdeltakelserDefault(behandling),
        antallDagerPerMeldeperiode: antallDagerDefault(behandling),

        // Ikke i bruk for denne behandlingstypen
        avslagsgrunner: [],
        harValgtStansFraFørsteDagSomGirRett: false,
        harValgtStansTilSisteDagSomGirRett: false,
        hjemlerForStans: [],
    };
};

const fraSøknadsbehandlingInnvilgelse = (
    behandling: SøknadsbehandlingInnvilgelse,
): BehandlingSkjemaState => {
    const barnetilleggPerioder = hentBarnetilleggForSøknadsbehandling(behandling);

    return {
        resultat: behandling.resultat,
        behandlingsperiode: hentBehandlingsperiode(behandling),
        harBarnetillegg: barnetilleggPerioder.length > 0,
        barnetilleggPerioder,
        valgteTiltaksdeltakelser: behandling.valgteTiltaksdeltakelser,
        antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode
            ? behandling.antallDagerPerMeldeperiode
            : antallDagerDefault(behandling),

        // Ikke i bruk for denne behandlingstypen
        avslagsgrunner: [],
        hjemlerForStans: [],
        // Kanskje disse burde vært Nullable<boolean> for søknadsbehandling. Må da skille stans-staten og søknadsbehandling staten (vi bruker felles behandling state)
        harValgtStansFraFørsteDagSomGirRett: false,
        harValgtStansTilSisteDagSomGirRett: false,
    };
};

const fraSøknadsbehandlingAvslag = (behandling: SøknadsbehandlingAvslag): BehandlingSkjemaState => {
    const barnetilleggPerioder = hentBarnetilleggForSøknadsbehandling(behandling);

    return {
        resultat: behandling.resultat,
        behandlingsperiode: hentBehandlingsperiode(behandling),
        avslagsgrunner: behandling.avslagsgrunner,

        // Ikke i bruk for denne resultattypen, men det må populeres ettersom resultat kan endres
        // til innvilgelse, der disse feltene er påkrevd.
        harBarnetillegg: barnetilleggPerioder.length > 0,
        barnetilleggPerioder: barnetilleggPerioder,
        valgteTiltaksdeltakelser: valgteTiltaksdeltakelserDefault(behandling),
        antallDagerPerMeldeperiode: antallDagerDefault(behandling),

        // Ikke i bruk for denne behandlingstypen
        hjemlerForStans: [],
        harValgtStansFraFørsteDagSomGirRett: false,
        harValgtStansTilSisteDagSomGirRett: false,
    };
};

const revurderingInitialState = (behandling: Revurdering, sak: SakProps): BehandlingSkjemaState => {
    const { resultat } = behandling;

    switch (resultat) {
        case RevurderingResultat.INNVILGELSE: {
            return fraRevurderingInnvilgelse(behandling, sak);
        }
        case RevurderingResultat.STANS: {
            return fraRevurderingStans(behandling);
        }
        case RevurderingResultat.OMGJØRING: {
            return fraRevurderingOmgjøring(behandling, sak);
        }
    }

    throw new Error(`Ukjent revurdering resultat: ${resultat satisfies never}`);
};

const fraRevurderingInnvilgelse = (
    behandling: RevurderingInnvilgelse,
    sak: SakProps,
): BehandlingSkjemaState => {
    const tiltaksperiode = hentHeleTiltaksdeltagelsesperioden(behandling);

    const behandlingsperiode = behandling.virkningsperiode ?? tiltaksperiode;

    const barnetilleggPerioder = hentBarnetilleggForRevurdering(
        behandlingsperiode,
        behandling,
        sak,
    );

    return {
        resultat: RevurderingResultat.INNVILGELSE,
        behandlingsperiode,
        harBarnetillegg: barnetilleggPerioder.length > 0,
        barnetilleggPerioder,
        valgteTiltaksdeltakelser: tilValgteTiltaksdeltakelser(behandling, behandlingsperiode),
        antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode ?? [
            {
                antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
                periode: {
                    fraOgMed: behandlingsperiode.fraOgMed,
                    tilOgMed: behandlingsperiode.tilOgMed,
                },
            },
        ],

        // Ikke i bruk for denne behandlingstypen
        avslagsgrunner: [],
        hjemlerForStans: [],

        //Kanskje disse burde vært Nullable<boolean> for revurdering innvilgelse - vi bruker felles behandling state
        harValgtStansFraFørsteDagSomGirRett: false,
        harValgtStansTilSisteDagSomGirRett: false,
    };
};

const fraRevurderingStans = (behandling: RevurderingStans): BehandlingSkjemaState => {
    return {
        resultat: RevurderingResultat.STANS,
        behandlingsperiode: behandling.virkningsperiode ?? {},
        hjemlerForStans: behandling.valgtHjemmelHarIkkeRettighet ?? [],
        harValgtStansFraFørsteDagSomGirRett:
            behandling.harValgtStansFraFørsteDagSomGirRett ?? false,
        harValgtStansTilSisteDagSomGirRett: behandling.harValgtStansTilSisteDagSomGirRett ?? false,

        // Ikke i bruk for denne behandlingstypen
        harBarnetillegg: false,
        barnetilleggPerioder: [],
        valgteTiltaksdeltakelser: [],
        antallDagerPerMeldeperiode: [],
        avslagsgrunner: [],
    };
};

/*
 * Ved en omgjøring så skal all informasjon i behandlingen allerede være utfyllt fra før av.
 */
const fraRevurderingOmgjøring = (
    behandling: RevurderingOmgjøring,
    sak: SakProps,
): BehandlingSkjemaState => {
    const behandlingsperiode = behandling.innvilgelsesperiode;

    const barnetilleggPerioder = hentBarnetilleggForRevurdering(
        behandlingsperiode,
        behandling,
        sak,
    );

    return {
        resultat: RevurderingResultat.OMGJØRING,
        behandlingsperiode,
        harBarnetillegg: barnetilleggPerioder.length > 0,
        barnetilleggPerioder,
        valgteTiltaksdeltakelser: tilValgteTiltaksdeltakelser(behandling, behandlingsperiode),
        antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode,

        // Ikke i bruk for denne behandlingstypen
        avslagsgrunner: [],
        hjemlerForStans: [],

        //Kanskje disse burde vært Nullable<boolean> for revurdering omgjøring - vi bruker felles behandling state
        harValgtStansFraFørsteDagSomGirRett: false,
        harValgtStansTilSisteDagSomGirRett: false,
    };
};

const tilValgteTiltaksdeltakelser = (
    behandling: RammebehandlingMedInnvilgelse,
    behandlingsperiode: Periode,
): TiltaksdeltakelsePeriodeFormData[] => {
    if (behandling.valgteTiltaksdeltakelser) {
        return behandling.valgteTiltaksdeltakelser;
    }

    const overlappendeDeltakelser: TiltaksdeltakelsePeriodeFormData[] = [];

    const tiltak = hentTiltaksdeltakelserMedStartOgSluttdato(behandling).map(
        (tiltaksdeltagelse) => ({
            eksternDeltagelseId: tiltaksdeltagelse.eksternDeltagelseId,
            periode: {
                fraOgMed: tiltaksdeltagelse.deltagelseFraOgMed,
                tilOgMed: tiltaksdeltagelse.deltagelseTilOgMed,
            },
        }),
    );

    // finner tiltaksdeltakelsene som overlapper med innvilgelsesperioden for at det skal bli riktig når man har flere tiltak, men bare et av dem gjelder valgt periode
    tiltak.forEach((tiltaksdeltagelse) => {
        if (
            erDatoIPeriode(behandlingsperiode.fraOgMed, tiltaksdeltagelse.periode) ||
            erDatoIPeriode(behandlingsperiode.tilOgMed, tiltaksdeltagelse.periode)
        ) {
            overlappendeDeltakelser.push(tiltaksdeltagelse);
        }
    });
    return overlappendeDeltakelser;
};
