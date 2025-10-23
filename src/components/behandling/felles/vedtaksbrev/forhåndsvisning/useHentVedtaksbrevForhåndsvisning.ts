import { useFetchBlobFraApi } from '~/utils/fetch/useFetchFraApi';

import { Periode } from '~/types/Periode';

import { Nullable } from '~/types/UtilTypes';
import { Rammebehandling, BehandlingResultat } from '~/types/Behandling';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { Avslagsgrunn } from '~/types/Søknadsbehandling';

export type SøknadsbehandlingBrevForhåndsvisningDTO = {
    fritekst: string;
    virkningsperiode: Periode;
    barnetillegg: Nullable<BarnetilleggPeriode[]>;
    resultat: BehandlingResultat;
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
    resultat: BehandlingResultat.STANS;
} & StansFraOgMed &
    StansTilOgMed;

export type RevurderingInnvilgelseBrevForhåndsvisningDTO = {
    fritekst: string;
    virkningsperiode: Periode;
    resultat: BehandlingResultat.REVURDERING_INNVILGELSE;
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
