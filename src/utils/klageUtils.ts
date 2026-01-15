import { Klagebehandling, KlagebehandlingResultat } from '~/types/Klage';

export const kanBehandleKlage = (k: Klagebehandling): boolean => {
    return k.status === 'KLAR_TIL_BEHANDLING' || k.status === 'UNDER_BEHANDLING';
};

export const finnUrlForKlageSteg = (k: Klagebehandling): string => {
    if (k.resultat === KlagebehandlingResultat.AVVIST) {
        return `/sak/${k.saksnummer}/klage/${k.id}/brev`;
    }

    return `/sak/${k.saksnummer}/klage/${k.id}/formkrav`;
};
