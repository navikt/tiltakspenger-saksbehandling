import {
    RammebehandlingResultat,
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';

export const rammebehandlingstypeTekst: Record<Rammebehandlingstype, string> = {
    [Rammebehandlingstype.SØKNADSBEHANDLING]: 'Søknadsbehandling',
    [Rammebehandlingstype.REVURDERING]: 'Revurdering',
} as const;

export const søknadsbehandlingResultatTekst: Record<SøknadsbehandlingResultat, string> = {
    [SøknadsbehandlingResultat.AVSLAG]: 'Avslag',
    [SøknadsbehandlingResultat.INNVILGELSE]: 'Innvilgelse',
    [SøknadsbehandlingResultat.IKKE_VALGT]: 'Ikke valgt',
} as const;

export const rammebehandlingResultatTekst: Record<RammebehandlingResultat, string> = {
    [SøknadsbehandlingResultat.AVSLAG]: 'Avslag',
    [SøknadsbehandlingResultat.INNVILGELSE]: 'Innvilgelse',
    [SøknadsbehandlingResultat.IKKE_VALGT]: 'Ikke valgt',
    [RevurderingResultat.STANS]: 'Stans',
    [RevurderingResultat.INNVILGELSE]: 'Innvilgelse',
    [RevurderingResultat.OMGJØRING]: 'Omgjøring med innvilgelse',
    [RevurderingResultat.OMGJØRING_OPPHØR]: 'Opphør',
    [RevurderingResultat.OMGJØRING_IKKE_VALGT]: 'Ikke valgt',
} as const;
