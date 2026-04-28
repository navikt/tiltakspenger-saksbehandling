import { useFetchBlobFraApi } from '~/utils/fetch/useFetchFraApi';
import { Nullable } from '~/types/UtilTypes';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { BarnetilleggPeriode } from '~/lib/rammebehandling/typer/Barnetillegg';
import {
    Avslagsgrunn,
    SøknadsbehandlingResultat,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';
import {
    HjemmelForOpphør,
    HjemmelForStans,
    RevurderingResultat,
} from '~/lib/rammebehandling/typer/Revurdering';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { Periode } from '~/types/Periode';

export type SøknadsbehandlingInnvilgelseBrevForhåndsvisningDTO = {
    resultat: SøknadsbehandlingResultat.INNVILGELSE;
    fritekst: Nullable<string>;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Nullable<BarnetilleggPeriode[]>;
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
    valgteHjemler: HjemmelForStans[];
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
    valgteHjemler: HjemmelForOpphør[];
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
