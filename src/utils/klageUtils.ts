import { Klagebehandling, KlagebehandlingResultat, KlagefristUnntakSvarord } from '~/types/Klage';

export const kanBehandleKlage = (k: Klagebehandling): boolean => {
    return k.status === 'KLAR_TIL_BEHANDLING' || k.status === 'UNDER_BEHANDLING';
};

export const erKlageAvsluttet = (k: Klagebehandling): boolean => {
    return k.status === 'AVBRUTT' || k.status === 'IVERKSATT';
};

export const kanVurdereKlage = (k: Klagebehandling): boolean => {
    return (
        k.vedtakDetKlagesPå !== null &&
        k.erKlagerPartISaken &&
        k.klagesDetPåKonkreteElementerIVedtaket &&
        erKlagefristenOverholdt(k) &&
        k.erKlagenSignert
    );
};

export const erKlagefristenOverholdt = (k: Klagebehandling): boolean => {
    return (
        k.erKlagefristenOverholdt ||
        k.erUnntakForKlagefrist === KlagefristUnntakSvarord.JA_AV_SÆRLIGE_GRUNNER ||
        k.erUnntakForKlagefrist ===
            KlagefristUnntakSvarord.JA_KLAGER_KAN_IKKE_LASTES_FOR_Å_HA_SENDT_INN_ETTER_FRISTEN
    );
};

export const finnUrlForKlageSteg = (k: Klagebehandling): string => {
    switch (k.resultat) {
        case KlagebehandlingResultat.AVVIST: {
            return `/sak/${k.saksnummer}/klage/${k.id}/brev`;
        }

        case null: {
            if (kanVurdereKlage(k)) {
                return `/sak/${k.saksnummer}/klage/${k.id}/vurdering`;
            }

            throw new Error(`Kunne ikke finne url for klagebehandling ${k.id} uten resultat`);
        }

        case KlagebehandlingResultat.OMGJØR: {
            return `/sak/${k.saksnummer}/klage/${k.id}/resultat`;
        }
    }
};
