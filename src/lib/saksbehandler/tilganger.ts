import { SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';

type MedGyldigeKommandoer = {
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
};

/** Den innloggede saksbehandleren er tildelt behandlingen, og kan behandle den. Regnes ut av backend. */
export const kanSaksbehandle = (behandling: MedGyldigeKommandoer): boolean =>
    behandling.gyldigeKommandoer.includes(SaksbehandlerBehandlingKommando.Saksbehandle);

/** Den innloggede beslutteren er tildelt behandlingen, og kan beslutte den. Regnes ut av backend. */
export const kanBeslutte = (behandling: MedGyldigeKommandoer): boolean =>
    behandling.gyldigeKommandoer.includes(SaksbehandlerBehandlingKommando.Beslutte);

export const kanFortsetteBehandling = (behandling: MedGyldigeKommandoer): boolean =>
    kanSaksbehandle(behandling) || kanBeslutte(behandling);

export const hentRolleForBehandling = (behandling: MedGyldigeKommandoer) => {
    return kanSaksbehandle(behandling)
        ? SaksbehandlerRolle.SAKSBEHANDLER
        : kanBeslutte(behandling)
          ? SaksbehandlerRolle.BESLUTTER
          : null;
};
