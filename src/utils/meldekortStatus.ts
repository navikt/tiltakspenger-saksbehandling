export enum MeldekortStatus {
  Sperret = 'SPERRET',
  IkkeUtfylt = 'IKKE_UTFYLT',
  DeltattUtenLønnITiltaket = 'DELTATT_UTEN_LØNN_I_TILTAKET',
  DeltattMedLønnITiltaket = 'DELTATT_MED_LØNN_I_TILTAKET',
  IkkeDeltatt = 'IKKE_DELTATT',
  FraværSyk = 'FRAVÆR_SYK',
  FraværSyktBarn = 'FRAVÆR_SYKT_BARN',
  FraværVelferdGodkjentAvNav = 'FRAVÆR_VELFERD_GODKJENT_AV_NAV',
  FraværVelferdIkkeGodkjentAvNav = 'FRAVÆR_VELFERD_IKKE_GODKJENT_AV_NAV',
}

export const MeldekortStatusTekster = [
  'Deltatt med lønn i tiltaket',
  'Deltatt uten lønn i tiltaket',
  'Ikke deltatt i tiltaket',
  'Lønn for tid i arbeid',
  'Fravær - Syk',
  'Fravær - Sykt barn',
  'Fravær - Velferd. Godkjent av NAV',
  'Fravær - Velferd. Ikke godkjent av NAV',
];
