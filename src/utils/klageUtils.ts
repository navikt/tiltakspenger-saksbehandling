import { Klagebehandling, KlagebehandlingResultat, KlagefristUnntakSvarord } from '~/types/Klage';
import { Rammebehandling } from '~/types/Rammebehandling';
import { Nullable } from '~/types/UtilTypes';
import { erRammebehandlingUnderAktivOmgjøring } from './behandling';

/**
 *
 * en klage som fører til omgjøring og har kommet til det steget hvor en rammebehandling er opprettet - så vil rammebehandlingens status ha noe å si om klagen kan behandles videre.
 *
 * I alle andre tilfeller så vil klagens egen status gjelde.
 *
 * @param omgjøringsbehandling - burde sendes inn dersom klage er omgjøring og rammebehandling er opprettet - null ellers
 */
export const kanBehandleKlage = (
    k: Klagebehandling,
    omgjøringsbehandling: Nullable<Rammebehandling>,
): boolean => {
    if (k.status === 'KLAR_TIL_BEHANDLING' || k.status === 'UNDER_BEHANDLING') {
        if (k.resultat === KlagebehandlingResultat.OMGJØR && !!omgjøringsbehandling) {
            return erRammebehandlingUnderAktivOmgjøring(omgjøringsbehandling);
        }

        return true;
    }

    return false;
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

export const erKlageOmgjøring = (k: Klagebehandling): boolean => {
    return k.resultat === KlagebehandlingResultat.OMGJØR;
};

export const erKlageKnyttetTilRammebehandling = (k: Klagebehandling): boolean => {
    return k.rammebehandlingId !== null;
};

export const erKlageOpprettholdelse = (k: Klagebehandling): boolean =>
    k.resultat === KlagebehandlingResultat.OPPRETTHOLDT;

/**
 * En aktiv omgjøringsbehandling betyr at det finnes en rammebehandling som er opprettet for å omgjøre vedtaket som klages på.
 */
export const erKlageUnderAktivOmgjøring = (
    k: Klagebehandling,
): k is Klagebehandling & { rammebehandlingId: string } =>
    k.resultat === KlagebehandlingResultat.OMGJØR && !!k.rammebehandlingId;

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
            return `/sak/${k.saksnummer}/klage/${k.id}/vurdering`;
        }

        case KlagebehandlingResultat.OPPRETTHOLDT: {
            return `/sak/${k.saksnummer}/klage/${k.id}/brev`;
        }
    }

    //verifiserer at switch er exhaustive
    throw k.resultat satisfies never;
};
