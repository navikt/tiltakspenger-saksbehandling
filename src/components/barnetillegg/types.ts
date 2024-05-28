interface Barnetillegg {
  navn: string;
  fnr: string;
  fdato: string;
  alder: string;
  bosatt: string;
  opphold: string;
  opplysninger: barnOpplysning[];
}

interface barnOpplysning {
  fakta: string;
  periode: string;
  kilde: string;
  detaljer: string;
  utfall: string;
}
