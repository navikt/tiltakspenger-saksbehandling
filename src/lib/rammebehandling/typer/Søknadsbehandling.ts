import { Barnetillegg, BarnetilleggDTO } from './Barnetillegg';
import {
    Rammebehandlingstype,
    OppdaterBehandlingBaseDTO,
    RammebehandlingBase,
} from './Rammebehandling';
import { InnvilgbarSøknad, Søknad } from '~/lib/søknad/søknadTyper';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';

type SøknadsbehandlingBase = RammebehandlingBase & {
    type: Rammebehandlingstype.SØKNADSBEHANDLING;
    resultat: SøknadsbehandlingResultat;
    søknad: Søknad;
    automatiskSaksbehandlet: boolean;
    kanInnvilges: boolean;
};

export type SøknadsbehandlingIkkeValgt = SøknadsbehandlingBase & {
    resultat: SøknadsbehandlingResultat.IKKE_VALGT;
};

export type SøknadsbehandlingInnvilgelse = SøknadsbehandlingBase & {
    resultat: SøknadsbehandlingResultat.INNVILGELSE;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Barnetillegg;
    søknad: InnvilgbarSøknad;
};

export type SøknadsbehandlingAvslag = SøknadsbehandlingBase & {
    resultat: SøknadsbehandlingResultat.AVSLAG;
    avslagsgrunner: Avslagsgrunn[];
};

export type Søknadsbehandling =
    SøknadsbehandlingInnvilgelse | SøknadsbehandlingAvslag | SøknadsbehandlingIkkeValgt;

export enum SøknadsbehandlingResultat {
    INNVILGELSE = 'INNVILGELSE',
    AVSLAG = 'AVSLAG',
    IKKE_VALGT = 'IKKE_VALGT',
}

export type OppdaterSøknadsbehandlingInnvilgelseDTO = OppdaterBehandlingBaseDTO & {
    resultat: SøknadsbehandlingResultat.INNVILGELSE;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: BarnetilleggDTO;
    skalSendeVedtaksbrev: boolean;
};

export type OppdaterSøknadsbehandlingAvslagDTO = OppdaterBehandlingBaseDTO & {
    resultat: SøknadsbehandlingResultat.AVSLAG;
    avslagsgrunner: Avslagsgrunn[];
    skalSendeVedtaksbrev: boolean;
};

export type OppdaterSøknadsbehandlingIkkeValgtDTO = OppdaterBehandlingBaseDTO & {
    resultat: SøknadsbehandlingResultat.IKKE_VALGT;
};

export type OppdaterSøknadsbehandlingDTO =
    | OppdaterSøknadsbehandlingInnvilgelseDTO
    | OppdaterSøknadsbehandlingAvslagDTO
    | OppdaterSøknadsbehandlingIkkeValgtDTO;

/**
 * https://confluence.adeo.no/pages/viewpage.action?pageId=679150248
 */
export enum Avslagsgrunn {
    DeltarIkkePåArbeidsmarkedstiltak = 'DeltarIkkePåArbeidsmarkedstiltak',
    Alder = 'Alder',
    Livsoppholdytelser = 'Livsoppholdytelser',
    Kvalifiseringsprogrammet = 'Kvalifiseringsprogrammet',
    Introduksjonsprogrammet = 'Introduksjonsprogrammet',
    LønnFraTiltaksarrangør = 'LønnFraTiltaksarrangør',
    LønnFraAndre = 'LønnFraAndre',
    Institusjonsopphold = 'Institusjonsopphold',
    FremmetForSent = 'FremmetForSent',
}
