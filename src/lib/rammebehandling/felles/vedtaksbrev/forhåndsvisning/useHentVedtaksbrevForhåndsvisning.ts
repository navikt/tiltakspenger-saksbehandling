import { Nullable } from '~/types/UtilTypes';
import { ForhåndsvisningBarnetilleggDTO } from '~/lib/rammebehandling/typer/Barnetillegg';
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
import { Dato } from '~/types/DatoTid';

export type SøknadsbehandlingInnvilgelseBrevForhåndsvisningDTO = {
    resultat: SøknadsbehandlingResultat.INNVILGELSE;
    fritekst: Nullable<string>;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Nullable<ForhåndsvisningBarnetilleggDTO>;
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
          stansFraOgMed: Dato;
          harValgtStansFraFørsteDagSomGirRett: false;
      }
);

export type RevurderingInnvilgelseBrevForhåndsvisningDTO = {
    resultat: RevurderingResultat.INNVILGELSE;
    fritekst: Nullable<string>;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Nullable<ForhåndsvisningBarnetilleggDTO>;
};

export type RevurderingForlengelseBrevForhåndsvisningDTO = {
    resultat: RevurderingResultat.FORLENGELSE;
    fritekst: Nullable<string>;
    tilOgMed: Dato;
    internDeltakelseId: string;
    // Null betyr at barnetillegget utledes fra vedtaket som forlenges.
    barnetillegg: Nullable<ForhåndsvisningBarnetilleggDTO>;
};

export type OmgjøringInnvilgelseBrevForhåndsvisningDTO = {
    resultat: RevurderingResultat.OMGJØRING;
    fritekst: Nullable<string>;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Nullable<ForhåndsvisningBarnetilleggDTO>;
};

export type OmgjøringOpphørBrevForhåndsvisningDTO = {
    resultat: RevurderingResultat.OMGJØRING_OPPHØR;
    fritekst: Nullable<string>;
    valgteHjemler: HjemmelForOpphør[];
    vedtaksperiode: Periode;
};

export type OmgjøringBrevForhåndsvisningDTO =
    OmgjøringInnvilgelseBrevForhåndsvisningDTO | OmgjøringOpphørBrevForhåndsvisningDTO;

export type BrevForhåndsvisningDTO =
    | SøknadsbehandlingInnvilgelseBrevForhåndsvisningDTO
    | SøknadsbehandlingAvslagBrevForhåndsvisningDTO
    | RevurderingStansBrevForhåndsvisningDTO
    | RevurderingInnvilgelseBrevForhåndsvisningDTO
    | RevurderingForlengelseBrevForhåndsvisningDTO
    | OmgjøringBrevForhåndsvisningDTO;
