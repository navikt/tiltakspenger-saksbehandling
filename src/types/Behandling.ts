import Søknad, { RegistrertTiltak } from './Søknad';
import {Utfall} from "./Utfall";

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
  fom: string;
  tom: string;
  søknad: Søknad;
  registrerteTiltak: RegistrertTiltak[];
  saksopplysninger: Kategori[];
  personopplysninger: Personopplysninger;
  tilstand: string;
  status: string;
  endringslogg: Endring[];
  samletUtfall: Utfall
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
  id: string;
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

export interface Kategori {
  kategoriTittel: string;
  saksopplysninger: SaksopplysningInnDTO[];
  samletUtfall: string;
}

export interface SaksopplysningInnDTO {
  fom: string;
  tom: string;
  kilde: string;
  detaljer: string;
  typeSaksopplysning: string;
  vilkårTittel: string;
  vilkårFlateTittel: string;
  fakta: FaktaDTO;
  utfall: string;
}

export interface FaktaDTO {
  harYtelse: string;
  harIkkeYtelse: string;
}
