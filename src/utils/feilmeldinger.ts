export const finnFeilmelding = (errorkode: string, melding: string) => {
    switch (errorkode) {
        case 'fant_ikke_fnr':
            return 'Fant ikke fødselsnummeret';
        case 'fant_ikke_sak':
            return 'Fant ikke saken';
        case 'fant_ikke_meldekort':
            return 'Fant ikke meldekortet';
        case 'fant_ikke_tiltak':
            return 'Fant ikke tiltak';
        case 'må_ha_beslutter_rolle':
            return 'Beslutterrolle mangler for innlogget saksbehandler';
        case 'beslutter_og_saksbehandler_kan_ikke_være_lik':
            'Saksbehandler og beslutter kan ikke være samme person';
        case 'ugyldig_kontornummer':
            return 'Navkontoret forventes å være fire siffer';
        case 'må_være_beslutter_eller_saksbehandler':
            return 'Ingen tilgang. Har ikke påkrevd rolle for å kunne gjennomføre handlingen';
        case 'må_ha_beslutter_rolle':
            return 'Ingen tilgang. Må ha beslutter-rolle for å kunne gjennomføre handlingen';
        case 'ugyldig_fnr':
            return 'Fødselsnummeret er ugyldig';
        case 'for_mange_dager_utfylt':
            return 'Det er fylt ut flere dager enn tillatt på dette meldekortet';
        case 'støtter_ikke_delvis_innvilgelse_eller_avslag':
            return 'Vi støtter ikke å opprette en behandling som vil føre til delvis innvilgelse eller avslag';
        case 'beslutter_og_saksbehandler_kan_ikke_være_lik':
            return 'Beslutter kan ikke være den samme som saksbehandler';
        case 'støtter_ikke_barnetillegg':
            return 'Vi støtter ikke søknader om barnetillegg';
        case 'fant_ikke_tiltak':
            return 'Fant ikke tiltaket bruker har søkt på';
        case 'server_feil':
            return 'Noe gikk galt på serversiden';
        case 'saksopplysningsperiode_må_være_lik':
            return 'Perioden til saksopplysningen er forskjellig fra vurderingsperioden';
        case 'server_feil':
            return 'Noe gikk galt på serversiden';
        case 'ikke_tilgang':
            return 'Bruker har ikke tilgang';
        case 'ugyldig_request':
            return 'Noe gikk galt under prossessering av data på serversiden.';
        case 'ikke_funnet':
            return 'Finner ikke resursen handlingen ber om';
        case 'ikke_implementert':
            return 'Vi mangler en implementasjon for å gjennomføre denne handlingen';
        case 'kan_ikke_stanse_utbetalt_dag':
            return 'Kan ikke stanse utbetalt dag';
        default:
            return melding;
    }
};
