import { useFetchBlobFraApi } from '~/utils/fetch/useFetchFraApi';
import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { Rammebehandling, RammebehandlingResultat } from '~/types/Rammebehandling';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { Avslagsgrunn } from '~/types/Søknadsbehandling';
import { RevurderingResultat } from '~/types/Revurdering';
import { AntallDagerPerMeldeperiode } from '~/types/AntallDagerPerMeldeperiode';

export type SøknadsbehandlingBrevForhåndsvisningDTO = {
    resultat: RammebehandlingResultat;
    fritekst: string;
    virkningsperiode?: Periode;
    barnetillegg?: BarnetilleggPeriode[];
    avslagsgrunner?: Avslagsgrunn[];
    antallDagerPerMeldeperiodeForPerioder?: AntallDagerPerMeldeperiode[];
};

type StansFraOgMed =
    | {
          stansFraOgMed?: null;
          harValgtStansFraFørsteDagSomGirRett: true;
      }
    | {
          stansFraOgMed: string;
          harValgtStansFraFørsteDagSomGirRett: false;
      };

type StansTilOgMed =
    | {
          stansTilOgMed?: null;
          harValgtStansTilSisteDagSomGirRett: true;
      }
    | {
          stansTilOgMed: string;
          harValgtStansTilSisteDagSomGirRett: false;
      };

export type RevurderingStansBrevForhåndsvisningDTO = {
    fritekst: string;
    valgteHjemler: string[];
    resultat: RevurderingResultat.STANS;
} & StansFraOgMed &
    StansTilOgMed;

export type RevurderingInnvilgelseBrevForhåndsvisningDTO = {
    fritekst: string;
    virkningsperiode: Periode;
    resultat: RevurderingResultat.INNVILGELSE;
    barnetillegg: Nullable<BarnetilleggPeriode[]>;
    antallDagerPerMeldeperiodeForPerioder: Nullable<AntallDagerPerMeldeperiode[]>;
};

export type BrevForhåndsvisningDTO =
    | SøknadsbehandlingBrevForhåndsvisningDTO
    | RevurderingStansBrevForhåndsvisningDTO
    | RevurderingInnvilgelseBrevForhåndsvisningDTO;

export const useHentVedtaksbrevForhåndsvisning = (behandling: Rammebehandling) => {
    const { trigger, error, isMutating } = useFetchBlobFraApi<BrevForhåndsvisningDTO>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/forhandsvis`,
        'POST',
    );

    return {
        hentForhåndsvisning: trigger,
        forhåndsvisningError: error,
        forhåndsvisningLaster: isMutating,
    };
};
