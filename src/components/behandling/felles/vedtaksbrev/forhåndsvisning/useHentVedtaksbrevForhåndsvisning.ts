import { useFetchBlobFraApi } from '~/utils/fetch/useFetchFraApi';

import { Periode } from '~/types/Periode';

import { Nullable } from '~/types/UtilTypes';
import { Rammebehandling, RammebehandlingResultatType } from '~/types/Behandling';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { Avslagsgrunn } from '~/types/Søknadsbehandling';

export type SøknadsbehandlingBrevForhåndsvisningDTO = {
    fritekst: string;
    virkningsperiode: Periode;
    barnetillegg: Nullable<BarnetilleggPeriode[]>;
    resultat: RammebehandlingResultatType;
    avslagsgrunner: Nullable<Avslagsgrunn[]>;
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
    resultat: RammebehandlingResultatType.STANS;
} & StansFraOgMed &
    StansTilOgMed;

export type RevurderingInnvilgelseBrevForhåndsvisningDTO = {
    fritekst: string;
    virkningsperiode: Periode;
    resultat: RammebehandlingResultatType.REVURDERING_INNVILGELSE;
    barnetillegg: Nullable<BarnetilleggPeriode[]>;
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
