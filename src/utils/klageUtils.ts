import { Klagebehandling, KlagebehandlingResultat } from '~/types/Klage';

export const finnUrlForKlageSteg = (k: Klagebehandling): string => {
    if (k.resultat === KlagebehandlingResultat.AVVIST) {
        return `/sak/${k.saksnummer}/klage/${k.id}/brev`;
    }

    return `/sak/${k.saksnummer}/klage/${k.id}/formkrav`;
};
