import { Periode } from './Periode';
import Søknad, { RegistrertTiltak } from './Søknad';
import { Utfall } from './Utfall';

interface Vilkår {
  lovreferanse: string;
  tittel: string;
}

export interface Saksopplysning {
  fom: string;
  tom: string;
  vilkår: Vilkår;
  kilde: string;
  detaljer: string;
  typeSaksopplysning: string;
}

export interface Behandling {
  behandlingId: string;
  saksbehandler: string;
  beslutter: string;
  vurderingsperiode: Periode;
  søknadsdato: Date;
  registrerteTiltak: RegistrertTiltak[];
  alderssaksopplysning: Aldersaksopplysning;
  ytelsessaksopplysninger: Ytelsessaksopplysninger;
  personopplysninger: Personopplysninger;
  behandlingsteg: string;
  status: string;
  endringslogg: Endring[];
  samletUtfall: Utfall;
  utfallsperioder: Utfallsperiode[];
}

export interface Utfallsperiode {
  fom: string;
  tom: string;
  antallBarn: number;
  utfall: string;
}

export interface Endring {
  type: string;
  begrunnelse: string;
  endretAv: string;
  endretTidspunkt: string;
}

export interface BehandlingForBenk {
  id: string;
  ident: string;
  typeBehandling: string;
  fom: string;
  tom: string;
  status: string;
  saksbehandler?: string;
  beslutter?: string;
}

export interface Sak {
  saksnummer: string;
  ident: string;
}

export interface Personopplysninger {
  ident: string;
  fornavn: string;
  etternavn: string;
  skjerming: boolean;
  strengtFortrolig: boolean;
  fortrolig: boolean;
}

export interface Ytelsessaksopplysninger {
  vilkår: string;
  saksopplysninger: SaksopplysningInnDTO[];
  samletUtfall: string;
  lovreferanse: LovreferanseDTO;
}

export interface LovreferanseDTO {
  lovverk: string;
  paragraf: string;
  beskrivelse: string;
}

export interface SaksopplysningInnDTO {
  periode: Periode;
  kilde: string;
  detaljer: string;
  saksopplysning: string;
  saksopplysningTittel: string;
  utfall: string;
}

export interface Aldersaksopplysning {
  periode: Periode;
  kilde: string;
  detaljer: string;
  vilkår: string;
  vilkårTittel: string;
  utfall: string;
  vilkårLovReferanse: LovreferanseDTO[];
  grunnlag: Date;
}
