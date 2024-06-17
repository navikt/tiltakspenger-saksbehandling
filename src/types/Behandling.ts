import Søknad, { RegistrertTiltak } from './Søknad';
import { Utfall } from './Utfall';
import { Vurdering } from './Vurdering';

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
  samletUtfall: Utfall;
  utfallsperioder: Utfallsperiode[];
  kravdatoSaksopplysninger: KravdatoSaksopplysninger;
}

interface KravdatoSaksopplysninger {
  opprinneligKravdato: KravdatoSaksopplysning;
  kravdatoFraSaksbehandler: KravdatoSaksopplysning;
  vurderinger: Vurdering[];
}

export interface KravdatoSaksopplysning {
  verdi: string;
  kilde: string;
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

export interface Kategori {
  kategoriTittel: string;
  saksopplysninger: SaksopplysningInnDTO[];
  samletUtfall: string;
  kategoriLovreferanse: LovreferenseDTO[];
}

export interface LovreferenseDTO {
  lovverk: string;
  paragraf: string;
  beskrivelse: string;
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
  vilkårLovReferense: LovreferenseDTO[];
}

export interface FaktaDTO {
  harYtelse: string;
  harIkkeYtelse: string;
}
