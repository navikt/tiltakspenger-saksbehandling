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
    case 'ugyldig_kontornummer':
      return 'Navkontoret forventes å være fire siffer';
    case 'for_mange_dager_utfylt':
      return 'Det er fylt ut flere dager enn tillatt på dette meldekortet';
    case 'støtter_ikke_delvis_eller_avslag':
      return 'Vi støtter ikke å opprette en behandling som vil føre til delvis innvilgelse eller avslag';
    case 'støtter_ikke_barnetillegg':
      return 'Vi støtter ikke søknader om barnetillegg';
    case 'fant_ikke_tiltak':
      return 'Fant ikke tiltaket bruker har søkt på';
    default:
      'Noe har gått galt på serversiden';
  }
};
