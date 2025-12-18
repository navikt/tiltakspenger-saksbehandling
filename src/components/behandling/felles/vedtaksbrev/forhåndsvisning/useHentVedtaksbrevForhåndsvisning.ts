import { useFetchBlobFraApi } from '~/utils/fetch/useFetchFraApi';
import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { Rammebehandling, RammebehandlingResultat } from '~/types/Rammebehandling';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { Avslagsgrunn } from '~/types/Søknadsbehandling';
import { RevurderingResultat } from '~/types/Revurdering';
import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';

export type SøknadsbehandlingBrevForhåndsvisningDTO = {
    resultat: RammebehandlingResultat;
    fritekst: Nullable<string>;
    vedtaksperiode?: Periode;
    barnetillegg?: BarnetilleggPeriode[];
    avslagsgrunner?: Avslagsgrunn[];
    innvilgelsesperioder?: Innvilgelsesperiode[];
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
    fritekst: Nullable<string>;
    valgteHjemler: string[];
    resultat: RevurderingResultat.STANS;
} & StansFraOgMed &
    StansTilOgMed;

export type RevurderingInnvilgelseBrevForhåndsvisningDTO = {
    fritekst: Nullable<string>;
    vedtaksperiode: Periode;
    resultat: RevurderingResultat.INNVILGELSE;
    barnetillegg: Nullable<BarnetilleggPeriode[]>;
    innvilgelsesperioder: Nullable<Innvilgelsesperiode[]>;
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
