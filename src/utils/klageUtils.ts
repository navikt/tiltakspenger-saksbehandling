import { Klagebehandling, KlagebehandlingResultat } from '~/types/Klage';

export const kanBehandleKlage = (k: Klagebehandling): boolean => {
    return k.status === 'KLAR_TIL_BEHANDLING' || k.status === 'UNDER_BEHANDLING';
};

export const finnUrlForKlageSteg = (k: Klagebehandling): string => {
    switch (k.resultat) {
        case KlagebehandlingResultat.AVVIST: {
            return `/sak/${k.saksnummer}/klage/${k.id}/brev`;
        }

        case null: {
            throw new Error(`Kunne ikke finne url for klagebehandling ${k.id} uten resultat`);
        }
    }
};
