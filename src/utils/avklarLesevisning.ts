import {Saksbehandler} from "../types/Saksbehandler";

export interface Lesevisning {
    kanEndre: boolean;
    knappAvbrytBehandling: boolean;
    knappOppdater: boolean;
    knappSendTilBeslutter: boolean;
    knappGodkjennVis: boolean;
    knappGodkjennTillatt: boolean
    knappSendTilbake: boolean;
    kanIkkeGodkjennes: boolean;
}

export const avklarLesevisning = (
    innloggetSaksbehandler: Saksbehandler,
    saksbehandlerPåSaken: string,
    beslutterPåSaken: string,
    tilstand: string,
    girInnvilget: boolean
): Lesevisning => {
    const redigerbarTilstand = (tilstand === "opprettet" || tilstand === "vilkårsvurdert");
    const erAdministrator = innloggetSaksbehandler.roller.includes("ADMINISTRATOR");
    const kanBeslutte =
        innloggetSaksbehandler.navIdent === beslutterPåSaken &&
        innloggetSaksbehandler.roller.includes("BESLUTTER");
    console.log("Roller: " + innloggetSaksbehandler.roller)
    return {
        kanEndre: redigerbarTilstand && innloggetSaksbehandler.navIdent === saksbehandlerPåSaken,
        knappAvbrytBehandling: redigerbarTilstand && (innloggetSaksbehandler.navIdent === saksbehandlerPåSaken || (erAdministrator && !!saksbehandlerPåSaken)),
        knappOppdater: (redigerbarTilstand || (tilstand === "tilBeslutter")) && innloggetSaksbehandler.navIdent === saksbehandlerPåSaken, //Om det også skal være i "tilBeslutter" avhengig av avklaring
        knappSendTilBeslutter: redigerbarTilstand && innloggetSaksbehandler.navIdent === saksbehandlerPåSaken,
        knappGodkjennVis: tilstand === "tilBeslutter" && kanBeslutte,
        knappGodkjennTillatt: tilstand === "tilBeslutter" && girInnvilget && kanBeslutte, //Skal drift eller admin kunne "lage" avslag?
        knappSendTilbake: tilstand === "tilBeslutter" && (kanBeslutte || (erAdministrator && !!beslutterPåSaken)),
        kanIkkeGodkjennes: !girInnvilget,
    }
}