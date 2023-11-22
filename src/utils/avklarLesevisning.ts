import {Saksbehandler} from "../types/Saksbehandler";
import {red} from "next/dist/lib/picocolors";

export interface Lesevisning {
    kanEndre: boolean;
    knappAvbrytBehandling: boolean;
    knappOppdater: boolean;
    knappSendTilBeslutter: boolean;
    knappGodkjennVis: boolean;
    knappGodkjennTillatt: boolean
    knappSendTilbake: boolean;
}

export const avklarLesevisning = (
    innloggetSaksbehandler: Saksbehandler,
    saksbehandlerPåSaken: string,
    beslutterPåSaken: string,
    tilstand: string,
    girInnvilget: boolean
): Lesevisning => {
    const redigerbarTilstand = (tilstand === "opprettet" || tilstand === "vilkårsvurdert");
    console.log(redigerbarTilstand);
    return {
        kanEndre: redigerbarTilstand && innloggetSaksbehandler.navIdent === saksbehandlerPåSaken,
        knappAvbrytBehandling: redigerbarTilstand && innloggetSaksbehandler.navIdent === saksbehandlerPåSaken,
        knappOppdater: (redigerbarTilstand || (tilstand === "tilBeslutter")) && innloggetSaksbehandler.navIdent === saksbehandlerPåSaken, //Om det også skal være i "tilBeslutter" avhengig av avklaring
        knappSendTilBeslutter: redigerbarTilstand && innloggetSaksbehandler.navIdent === saksbehandlerPåSaken,
        knappGodkjennVis: tilstand === "tilBeslutter",
        knappGodkjennTillatt: tilstand === "tilBeslutter" && girInnvilget && innloggetSaksbehandler.navIdent === beslutterPåSaken,
        knappSendTilbake: tilstand === "tilBeslutter" && innloggetSaksbehandler.navIdent === beslutterPåSaken,
    }
}