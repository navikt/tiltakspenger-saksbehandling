import {
    Revurdering,
    RevurderingInnvilgelse,
    RevurderingOmgjøring,
    RevurderingResultat,
    RevurderingStans,
} from '~/types/Revurdering';
import { SakProps } from '~/types/Sak';
import { RevurderingStansState } from '~/components/behandling/context/revurdering/revurderingStansSkjemaContext';
import {
    hentHeleTiltaksdeltagelsesperioden,
    hentTiltaksdeltakelserMedStartOgSluttdato,
} from '~/utils/behandling';
import { hentBarnetilleggForRevurdering } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { ANTALL_DAGER_DEFAULT } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { RevurderingOmgjøringState } from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { RevurderingInnvilgelseState } from '~/components/behandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { RammebehandlingMedInnvilgelse } from '~/types/Rammebehandling';
import { Periode } from '~/types/Periode';
import { TiltaksdeltakelsePeriodeFormData } from '~/components/behandling/context/innvilgelse/slices/tiltaksdeltagelseContext';
import { erDatoIPeriode } from '~/utils/periode';

type RevurderingState =
    | RevurderingInnvilgelseState
    | RevurderingOmgjøringState
    | RevurderingStansState;

export const revurderingInitialState = (
    behandling: Revurdering,
    sak: SakProps,
): RevurderingState => {
    const { resultat } = behandling;

    switch (resultat) {
        case RevurderingResultat.INNVILGELSE: {
            return innvilgelseInitialState(behandling, sak);
        }
        case RevurderingResultat.STANS: {
            return stansInitialState(behandling);
        }
        case RevurderingResultat.OMGJØRING: {
            return omgjøringInitialState(behandling, sak);
        }
    }

    throw new Error(`Ukjent revurdering resultat: ${resultat satisfies never}`);
};

const stansInitialState = (behandling: RevurderingStans): RevurderingStansState => {
    return {
        resultat: RevurderingResultat.STANS,
        fraDato: behandling.virkningsperiode?.fraOgMed,
        hjemlerForStans: behandling.valgtHjemmelHarIkkeRettighet ?? [],
        harValgtStansFraFørsteDagSomGirRett:
            behandling.harValgtStansFraFørsteDagSomGirRett ?? false,
    };
};

const innvilgelseInitialState = (
    behandling: RevurderingInnvilgelse,
    sak: SakProps,
): RevurderingInnvilgelseState => {
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
        valgteTiltaksdeltakelser: valgteTiltaksdeltakelserInitialState(
            behandling,
            behandlingsperiode,
        ),
        antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode ?? [
            {
                antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
                periode: {
                    fraOgMed: behandlingsperiode.fraOgMed,
                    tilOgMed: behandlingsperiode.tilOgMed,
                },
            },
        ],
    };
};

/*
 * Ved en omgjøring så skal all informasjon i behandlingen allerede være utfyllt fra før av.
 */
const omgjøringInitialState = (
    behandling: RevurderingOmgjøring,
    sak: SakProps,
): RevurderingOmgjøringState => {
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
        valgteTiltaksdeltakelser: valgteTiltaksdeltakelserInitialState(
            behandling,
            behandlingsperiode,
        ),
        antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode,
    };
};

const valgteTiltaksdeltakelserInitialState = (
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
