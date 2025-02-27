import { FetcherError } from './fetch/fetch';

const feilmeldinger: Record<string, string> = {
    fant_ikke_fnr: 'Fant ikke fødselsnummeret',
    fant_ikke_sak: 'Fant ikke saken',
    fant_ikke_meldekort: 'Fant ikke meldekortet',
    må_være_beslutter_eller_saksbehandler:
        'Ingen tilgang. Har ikke påkrevd rolle for å kunne gjennomføre handlingen',
    må_ha_beslutter_rolle:
        'Ingen tilgang. Må ha beslutter-rolle for å kunne gjennomføre handlingen',
    ugyldig_fnr: 'Fødselsnummeret er ugyldig',
    for_mange_dager_utfylt: 'Det er fylt ut flere dager enn tillatt på dette meldekortet',
    støtter_ikke_delvis_innvilgelse_eller_avslag:
        'Vi støtter ikke å opprette en behandling som vil føre til delvis innvilgelse eller avslag',
    beslutter_og_saksbehandler_kan_ikke_være_lik:
        'Beslutter kan ikke være den samme som saksbehandler',
    støtter_ikke_barnetillegg: 'Vi støtter ikke søknader om barnetillegg',
    fant_ikke_tiltak: 'Fant ikke tiltaket bruker har søkt på',
    saksopplysningsperiode_må_være_lik:
        'Perioden til saksopplysningen er forskjellig fra vurderingsperioden',
    server_feil: 'Noe gikk galt på serversiden',
    ikke_tilgang: 'Bruker har ikke tilgang',
    ugyldig_request: 'Noe gikk galt under prossessering av data på serversiden.',
    ikke_funnet: 'Finner ikke resursen handlingen ber om',
    ikke_implementert: 'Vi mangler en implementasjon for å gjennomføre denne handlingen',
    kan_ikke_stanse_utbetalt_dag: 'Kan ikke stanse utbetalt dag',
    meldeperioden_er_utdatert: 'Meldeperioden er utdatert',
} as const;

export const finnFetchFeilmelding = (error: FetcherError): string => {
    return error.info
        ? (feilmeldinger[error.info.kode] ?? error.info.melding)
        : feilmeldinger.server_feil;
};
