import { useFetchBlobFraApi } from '~/utils/fetch/useFetchFraApi';
import {
    Avslagsgrunn,
    BehandlingData,
    RevurderingResultat,
    SøknadsbehandlingResultat,
} from '~/types/BehandlingTypes';
import { Periode } from '~/types/Periode';
import { VedtakBarnetilleggPeriode } from '~/types/VedtakTyper';
import { Nullable } from '~/types/UtilTypes';

export type SøknadsbehandlingBrevForhåndsvisningDTO = {
    fritekst: string;
    virkningsperiode: Periode;
    barnetillegg: Nullable<VedtakBarnetilleggPeriode[]>;
    resultat: SøknadsbehandlingResultat;
    avslagsgrunner: Nullable<Avslagsgrunn[]>;
};

export type RevurderingStansBrevForhåndsvisningDTO = {
    fritekst: string;
    stansDato: string;
    valgteHjemler: string[];
    resultat: RevurderingResultat.STANS;
};

export type RevurderingInnvilgelseBrevForhåndsvisningDTO = {
    fritekst: string;
    virkningsperiode: Periode;
    resultat: RevurderingResultat.REVURDERING_INNVILGELSE;
    barnetillegg: Nullable<VedtakBarnetilleggPeriode[]>;
};

export type BrevForhåndsvisningDTO =
    | SøknadsbehandlingBrevForhåndsvisningDTO
    | RevurderingStansBrevForhåndsvisningDTO
    | RevurderingInnvilgelseBrevForhåndsvisningDTO;

export const useHentVedtaksbrevForhåndsvisning = (behandling: BehandlingData) => {
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
