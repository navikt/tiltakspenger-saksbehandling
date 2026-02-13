import { useFetchBlobFraApi } from '~/utils/fetch/useFetchFraApi';
import { Nullable } from '~/types/UtilTypes';
import { Rammebehandling } from '~/types/Rammebehandling';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { Avslagsgrunn, SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { HjemmelForStansEllerOpphør, RevurderingResultat } from '~/types/Revurdering';
import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';
import { Periode } from '~/types/Periode';

export type SøknadsbehandlingInnvilgelseBrevForhåndsvisningDTO = {
    resultat: SøknadsbehandlingResultat.INNVILGELSE;
    fritekst: Nullable<string>;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg?: BarnetilleggPeriode[];
};

export type SøknadsbehandlingAvslagBrevForhåndsvisningDTO = {
    resultat: SøknadsbehandlingResultat.AVSLAG;
    fritekst: Nullable<string>;
    avslagsgrunner: Avslagsgrunn[];
};

export type SøknadsbehandlingBrevForhåndsvisningDTO =
    | SøknadsbehandlingInnvilgelseBrevForhåndsvisningDTO
    | SøknadsbehandlingAvslagBrevForhåndsvisningDTO;

export type RevurderingStansBrevForhåndsvisningDTO = {
    resultat: RevurderingResultat.STANS;
    fritekst: Nullable<string>;
    valgteHjemler: HjemmelForStansEllerOpphør[];
} & (
    | {
          stansFraOgMed: null;
          harValgtStansFraFørsteDagSomGirRett: true;
      }
    | {
          stansFraOgMed: string;
          harValgtStansFraFørsteDagSomGirRett: false;
      }
);

export type RevurderingInnvilgelseBrevForhåndsvisningDTO = {
    resultat: RevurderingResultat.INNVILGELSE;
    fritekst: Nullable<string>;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Nullable<BarnetilleggPeriode[]>;
};

export type OmgjøringInnvilgelseBrevForhåndsvisningDTO = {
    resultat: RevurderingResultat.OMGJØRING;
    fritekst: Nullable<string>;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Nullable<BarnetilleggPeriode[]>;
};

export type OmgjøringOpphørBrevForhåndsvisningDTO = {
    resultat: RevurderingResultat.OMGJØRING_OPPHØR;
    fritekst: Nullable<string>;
    valgteHjemler: HjemmelForStansEllerOpphør[];
    vedtaksperiode: Periode;
};

export type OmgjøringBrevForhåndsvisningDTO =
    | OmgjøringInnvilgelseBrevForhåndsvisningDTO
    | OmgjøringOpphørBrevForhåndsvisningDTO;

export type BrevForhåndsvisningDTO =
    | SøknadsbehandlingInnvilgelseBrevForhåndsvisningDTO
    | SøknadsbehandlingAvslagBrevForhåndsvisningDTO
    | RevurderingStansBrevForhåndsvisningDTO
    | RevurderingInnvilgelseBrevForhåndsvisningDTO
    | OmgjøringBrevForhåndsvisningDTO;

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
