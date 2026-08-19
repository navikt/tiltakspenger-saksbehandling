import { Behandlingsårsak, JaNeiSvar, Søknadstype } from '~/lib/søknad/søknadTyper';
import {
    SøknadBehandlingsårsakManueltRegistrertSøknad,
    SøknadstypeManueltRegistrertSøknad,
} from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';

export const søknadstypeTekst: Record<Søknadstype | SøknadstypeManueltRegistrertSøknad, string> = {
    DIGITAL: 'Digital',
    PAPIR_SKJEMA: 'Papirsøknad (skjema)',
    PAPIR_FRIHAND: 'Papirsøknad (frihånd)',
    MODIA: 'Modia',
    ANNET: 'Annet',
} as const;

export const søknadBehandlingsårsakTekst: Record<
    Behandlingsårsak | SøknadBehandlingsårsakManueltRegistrertSøknad,
    string
> = {
    FORLENGELSE_FRA_ARENA: 'Forlengelse fra Arena',
    SOKNADSBEHANDLING_FRA_ARENA: 'Søknadsbehandling fra Arena',
    OVERLAPPENDE_TILTAK_I_ARENA: 'Overlappende tiltak i Arena',
    ANNET: 'Annet',
} as const;

const jaNeiSvarTekst: Record<JaNeiSvar, string> = {
    JA: 'Ja',
    NEI: 'Nei',
    IKKE_BESVART: 'Ikke besvart',
} as const;

const erJaNeiSvar = (verdi: string): verdi is JaNeiSvar => verdi in jaNeiSvarTekst;

/**
 * Svarene fra søknaden er ikke alltid ja/nei-spørsmål - andre verdier vises som de er.
 */
export const formaterSøknadsspørsmålSvar = (verdi: string | undefined): string => {
    if (verdi === undefined) {
        return '-';
    }

    return erJaNeiSvar(verdi) ? jaNeiSvarTekst[verdi] : verdi;
};
