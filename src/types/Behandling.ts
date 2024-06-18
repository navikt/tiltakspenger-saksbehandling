import { Periode } from './Periode';
import { RegistrertTiltak } from './Søknad';
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
  vurderingsperiode: Periode;
  søknadsdato: Date;
  tiltaksdeltagelsesaksopplysninger: TiltaksdeltagelsesaksopplysningerDTO;
  stønadsdager: StønadsdagerSaksopplysning[];
  alderssaksopplysning: Aldersaksopplysning;
  ytelsessaksopplysninger: Ytelsessaksopplysninger;
  personopplysninger: Personopplysninger;
  behandlingsteg: string;
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

export interface Ytelsessaksopplysninger {
  vilkår: string;
  saksopplysninger: SaksopplysningInnDTO[];
  samletUtfall: string;
  vilkårLovreferanse: LovreferanseDTO;
}

export interface TiltaksdeltagelsesaksopplysningerDTO {
  vilkår: string;
  saksopplysninger: RegistrertTiltak[];
  vilkårLovreferanse: LovreferanseDTO;
}

export interface StønadsdagerSaksopplysning {
  tiltakId: string;
  tiltak: string;
  arrangør: string;
  avklartAntallDager: Stønadsdager[];
  antallDagerSaksopplysningerFraRegister: Stønadsdager;
}

export interface Stønadsdager {
  periode: Periode;
  antallDager: number;
  kilde: string;
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
  vilkårLovreferanse: LovreferanseDTO[];
  grunnlag: Date;
}
