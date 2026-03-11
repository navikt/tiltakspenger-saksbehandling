import {
    Klagebehandling,
    KlagebehandlingResultat,
    KlagebehandlingsresultatOmgjør,
    KlagebehandlingsresultatOpprettholdt,
    KlagebehandlingStatus,
    KlagefristUnntakSvarord,
} from '~/types/Klage';
import { BehandlingId, Rammebehandling } from '~/types/Rammebehandling';
import { Nullable } from '~/types/UtilTypes';
import { erRammebehandlingUnderAktivOmgjøring } from './behandling';
import { KlagehendelseUtfall } from '~/types/Klageinstanshendelse';
import {
    erKlageinstanshendelseAvsluttet,
    erKlageinstanshendelseFeilregistrert,
    erKlageinstanshendelseOmgjøringskravbehandlingAvsluttet,
} from './KlageinstanshendelseUtils';

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
        if (k.resultat?.type === KlagebehandlingResultat.OMGJØR && !!omgjøringsbehandling) {
            return erRammebehandlingUnderAktivOmgjøring(omgjøringsbehandling);
        }

        return true;
    }

    return false;
};

export const erKlageAvsluttet = (k: Klagebehandling): boolean =>
    k.status === 'AVBRUTT' ||
    k.status === KlagebehandlingStatus.VEDTATT ||
    k.status === 'FERDIGSTILT';

export const erKlageFerdigbehandlet = (k: Klagebehandling): boolean =>
    k.status === KlagebehandlingStatus.VEDTATT || k.status === 'FERDIGSTILT';

//Merk at en klage som er åpen betyr ikke nødvendigvis at den kan behandles.
export const erKlageÅpen = (k: Klagebehandling): boolean =>
    k.status === KlagebehandlingStatus.KLAR_TIL_BEHANDLING ||
    k.status === KlagebehandlingStatus.UNDER_BEHANDLING ||
    k.status === KlagebehandlingStatus.OPPRETTHOLDT ||
    k.status === KlagebehandlingStatus.OVERSENDT;

export const kanVurdereKlage = (k: Klagebehandling): boolean =>
    k.formkrav.vedtakDetKlagesPå !== null &&
    k.formkrav.erKlagerPartISaken &&
    k.formkrav.klagesDetPåKonkreteElementerIVedtaket &&
    erKlagefristenOverholdt(k) &&
    k.formkrav.erKlagenSignert;

export const erKlagefristenOverholdt = (k: Klagebehandling): boolean => {
    return (
        k.formkrav.erKlagefristenOverholdt ||
        k.formkrav.erUnntakForKlagefrist === KlagefristUnntakSvarord.JA_AV_SÆRLIGE_GRUNNER ||
        k.formkrav.erUnntakForKlagefrist ===
            KlagefristUnntakSvarord.JA_KLAGER_KAN_IKKE_LASTES_FOR_Å_HA_SENDT_INN_ETTER_FRISTEN
    );
};

export const erKlageOmgjøring = (
    k: Klagebehandling,
): k is Klagebehandling & { resultat: KlagebehandlingsresultatOmgjør } => {
    return k.resultat?.type === KlagebehandlingResultat.OMGJØR;
};

export const erKlageKnyttetTilRammebehandling = (k: Klagebehandling): boolean => {
    return (
        (k.resultat?.type === KlagebehandlingResultat.OMGJØR ||
            k.resultat?.type === KlagebehandlingResultat.OPPRETTHOLDT) &&
        k.resultat.rammebehandlingId !== null
    );
};

export const erKlageOpprettholdelse = (
    k: Klagebehandling,
): k is Klagebehandling & { resultat: KlagebehandlingsresultatOpprettholdt } =>
    k.resultat?.type === KlagebehandlingResultat.OPPRETTHOLDT;

/**
 * En aktiv omgjøringsbehandling betyr at det finnes en rammebehandling som er opprettet for å omgjøre vedtaket som klages på.
 */
export const erKlageUnderAktivOmgjøring = (
    k: Klagebehandling,
): k is Klagebehandling & {
    resultat: KlagebehandlingsresultatOmgjør & { rammebehandlingId: BehandlingId };
} => k.resultat?.type === KlagebehandlingResultat.OMGJØR && !!k.resultat.rammebehandlingId;

export const finnSisteGyldigeStegForKlage = (k: Klagebehandling): string => {
    switch (k.resultat?.type) {
        case KlagebehandlingResultat.AVVIST: {
            return `/sak/${k.saksnummer}/klage/${k.id}/brev`;
        }
        case undefined: {
            if (kanVurdereKlage(k)) {
                return `/sak/${k.saksnummer}/klage/${k.id}/vurdering`;
            }
            throw new Error(`Kunne ikke finne url for klagebehandling ${k.id} uten resultat`);
        }
        case KlagebehandlingResultat.OMGJØR: {
            return `/sak/${k.saksnummer}/klage/${k.id}/resultat`;
        }
        case KlagebehandlingResultat.OPPRETTHOLDT: {
            if (
                k.status === KlagebehandlingStatus.OPPRETTHOLDT ||
                k.status === KlagebehandlingStatus.OVERSENDT ||
                k.status === KlagebehandlingStatus.MOTTATT_FRA_KLAGEINSTANS ||
                k.status === KlagebehandlingStatus.FERDIGSTILT
            ) {
                return `/sak/${k.saksnummer}/klage/${k.id}/resultat`;
            }
            return `/sak/${k.saksnummer}/klage/${k.id}/brev`;
        }
    }
    throw new Error(`Safe guard for making the switch exhaustive`, k.resultat satisfies never);
};

export const erKlageOpprettholdtEllerEtter = (k: Klagebehandling) =>
    k.status === KlagebehandlingStatus.OPPRETTHOLDT ||
    k.status === KlagebehandlingStatus.OVERSENDT ||
    erKlageMottattFraKAEllerEtter(k);

export const erKlageMottattFraKAEllerEtter = (k: Klagebehandling) =>
    k.status === KlagebehandlingStatus.MOTTATT_FRA_KLAGEINSTANS ||
    k.status === KlagebehandlingStatus.FERDIGSTILT;

export const hentSisteKlagehendelseUtfallFraKlagebehandling = (
    k: Klagebehandling,
): Nullable<KlagehendelseUtfall> => {
    const sisteKlagehendelse =
        erKlageOpprettholdelse(k) && k.resultat.klageinstanshendelser.length > 0
            ? k.resultat.klageinstanshendelser.at(-1)
            : null;

    const utfall =
        sisteKlagehendelse &&
        (erKlageinstanshendelseAvsluttet(sisteKlagehendelse) ||
            erKlageinstanshendelseOmgjøringskravbehandlingAvsluttet(sisteKlagehendelse))
            ? sisteKlagehendelse.utfall
            : sisteKlagehendelse && erKlageinstanshendelseFeilregistrert(sisteKlagehendelse)
              ? sisteKlagehendelse.type
              : null;

    return utfall;
};
