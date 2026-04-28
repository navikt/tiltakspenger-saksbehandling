import { AvbruttBehandlingCellInfo } from './AvsluttedeBehandlingerUtils';
import { AvbrutteBehandlingerTabell } from './AvbrutteBehandlingerTabell';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Klagebehandling, KlagebehandlingResultat } from '~/lib/klage/typer/Klage';

export const AvsluttedeBehandlinger = (props: {
    saksnummer: string;
    avbrutteBehandlinger: Rammebehandling[];
    avbrutteKlageBehandlinger: Klagebehandling[];
}) => {
    const avbrutteRammebehandlinger = props.avbrutteBehandlinger.map(
        avbruttBehandlingToDataCellInfo,
    );

    const avbrutteKlagebehandlinger = props.avbrutteKlageBehandlinger.map(
        avbruttKlageToDataCellInfo,
    );

    const avbrutteBehandlinger = [
        ...avbrutteRammebehandlinger,
        ...avbrutteKlagebehandlinger,
    ].toSorted((a, b) => b.tidspunktAvsluttet.localeCompare(a.tidspunktAvsluttet));

    if (avbrutteBehandlinger.length === 0) {
        return null;
    }

    return (
        <AvbrutteBehandlingerTabell
            avbrutteBehandlinger={avbrutteBehandlinger}
            saksnummer={props.saksnummer}
        />
    );
};

const avbruttBehandlingToDataCellInfo = (
    behandling: Rammebehandling,
): AvbruttBehandlingCellInfo => {
    const tidspunktAvsluttet = behandling.avbrutt?.avbruttTidspunkt
        ? behandling.avbrutt.avbruttTidspunkt
        : behandling.iverksattTidspunkt!;

    return {
        id: behandling.id,
        behandlingsperiode: behandling.vedtaksperiode,
        resultat: behandling.resultat,
        behandlingstype: behandling.type,
        tidspunktAvsluttet: tidspunktAvsluttet,
        avsluttetPga: behandling.avbrutt ? 'avbrutt' : 'ferdigBehandlet',
        saksbehandler: behandling.saksbehandler,
        beslutter: behandling.beslutter,
    };
};

const avbruttKlageToDataCellInfo = (klage: Klagebehandling): AvbruttBehandlingCellInfo => {
    return {
        id: klage.id,
        behandlingsperiode: null,
        resultat: (klage.resultat?.type ??
            KlagebehandlingResultat.AVVIST) as KlagebehandlingResultat,
        behandlingstype: 'KLAGEBEHANDLING',
        tidspunktAvsluttet: klage.sistEndret,
        avsluttetPga: 'avbrutt',
        saksbehandler: klage.saksbehandler ?? 'Ukjent',
        beslutter: null,
    };
};
