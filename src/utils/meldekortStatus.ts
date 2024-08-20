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

// Denne er kanskje ikke så frontendete.. BENNY! HALP!!
export const meldekortStatusTilTekst: Record<MeldekortStatus, string> = {
  [MeldekortStatus.Sperret]: 'sperret',
  [MeldekortStatus.IkkeUtfylt]: 'Ikke utfylt',
  [MeldekortStatus.DeltattUtenLønnITiltaket]: 'Deltatt uten lønn i tiltaket',
  [MeldekortStatus.DeltattMedLønnITiltaket]: 'Deltatt med lønn i tiltaket',
  [MeldekortStatus.IkkeDeltatt]: 'Ikke deltatt i tiltaket',
  [MeldekortStatus.FraværSyk]: 'Fravær - Syk',
  [MeldekortStatus.FraværSyktBarn]: 'Fravær - Sykt barn',
  [MeldekortStatus.FraværVelferdGodkjentAvNav]: 'Fravær - Velferd. Godkjent av NAV',
  [MeldekortStatus.FraværVelferdIkkeGodkjentAvNav]: 'Fravær - Velferd. Ikke godkjent av NAV'
};

// Denne er kanskje ikke så frontendete.. BENNY! HALP!!
export const tekstTilMeldekortStatus: Record<string, MeldekortStatus> = Object.fromEntries(
  Object.entries(meldekortStatusTilTekst).map(([key, value]) => [value, key])
) as Record<string, MeldekortStatus>;
