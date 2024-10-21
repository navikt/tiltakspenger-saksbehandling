export const finnFeilmelding = (errorkode: string) => {
  switch (errorkode) {
    case 'fant_ikke_fnr':
      return 'Fant ikke fødselsnummeret';
    case 'fant_ikke_sak':
      return 'Fant ikke saken';
    case 'fant_ikke_meldekort':
      return 'Fant ikke meldekortet';
    case 'må_ha_beslutter_rolle':
      return 'Beslutterrolle mangler for innlogget saksbehandler';
    case 'beslutter_og_saksbehandler_kan_ikke_være_lik':
      'Saksbehandler og beslutter kan ikke være samme person';
    default:
      '';
  }
};
