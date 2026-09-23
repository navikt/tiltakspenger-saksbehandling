import { ReactNode } from 'react';
import { Nullable } from '~/types/UtilTypes';
import {
    BenkBehandling,
    BenkBehandlingMedTilgang,
    BenkFellesKolonne,
    benkFellesKolonner,
} from '../../typer/felles';
import { BenkSøknadsbehandling } from '../../typer/søknader';
import { BenkRevurdering } from '../../typer/revurderinger';
import { benkBehandlingHarTilgang } from '../../utils/benkRad';
import { BenkTabsMedBatchTildeling } from '../filter/BenkVisningContext';
import { BenkTildelFlere } from '../tildel-flere/BenkTildelFlere';
import { BenkKolonne } from './BenkKolonne';
import { BenkTabellCelle } from './BenkTabellCelle';

/**
 * Kolonnene som går igjen på tvers av fanene. Kolonnenavn og sortKey defineres én gang her,
 * slik at fanene ikke kommer i utakt. Radtypen er det minste kolonnen trenger, så typesjekken
 * sier fra hvis en fane bruker en kolonne den ikke har felter eller sortKey for.
 */

const fnr: BenkKolonne<BenkBehandling, BenkFellesKolonne> = {
    id: 'fnr',
    tittel: 'Fødselsnr',
    sortKey: benkFellesKolonner.fnr,
    erRadoverskrift: true,
    celle: (rad) => <BenkTabellCelle.Fnr behandling={rad} />,
};

const resultat: BenkKolonne<BenkBehandling, 'resultat'> = {
    id: 'resultat',
    tittel: 'Resultat',
    sortKey: 'resultat',
    celle: (rad) => <BenkTabellCelle.Resultat behandling={rad} />,
};

const status: BenkKolonne<BenkBehandling, BenkFellesKolonne> = {
    id: 'status',
    tittel: 'Status',
    sortKey: benkFellesKolonner.status,
    celle: (rad) => <BenkTabellCelle.Status behandling={rad} />,
};

const ventestatus: BenkKolonne<BenkBehandling, BenkFellesKolonne> = {
    id: 'ventestatus',
    tittel: 'Ventestatus',
    sortKey: benkFellesKolonner.ventestatusFrist,
    skjulesNårPåVentErSkjult: true,
    celle: (rad) => <BenkTabellCelle.Ventestatus behandling={rad} />,
};

const kravtidspunkt: BenkKolonne<{ kravtidspunkt: string }, 'kravtidspunkt'> = {
    id: 'kravtidspunkt',
    tittel: 'Kravtidspunkt',
    sortKey: 'kravtidspunkt',
    align: 'right',
    celle: (rad) => <BenkTabellCelle.Tidspunkt tidspunkt={rad.kravtidspunkt} />,
};

const startet: BenkKolonne<BenkBehandling, 'startet'> = {
    id: 'startet',
    tittel: 'Startet',
    sortKey: 'startet',
    align: 'right',
    celle: (rad) => <BenkTabellCelle.Tidspunkt tidspunkt={rad.startet} />,
};

const sistEndret: BenkKolonne<BenkBehandling, BenkFellesKolonne> = {
    id: 'sistEndret',
    tittel: 'Sist endret',
    sortKey: benkFellesKolonner.sistEndret,
    align: 'right',
    celle: (rad) => <BenkTabellCelle.Tidspunkt tidspunkt={rad.sistEndret} />,
};

const saksbehandler: BenkKolonne<BenkBehandling, BenkFellesKolonne> = {
    id: 'saksbehandler',
    tittel: 'Saksbehandler',
    sortKey: benkFellesKolonner.saksbehandler,
    celle: (rad) => <BenkTabellCelle.Tildelt ident={rad.saksbehandler} />,
};

const beslutter: BenkKolonne<BenkBehandling, 'beslutter'> = {
    id: 'beslutter',
    tittel: 'Beslutter',
    sortKey: 'beslutter',
    celle: (rad) => <BenkTabellCelle.Tildelt ident={rad.beslutter} />,
};

const beløp: BenkKolonne<{ beløp: Nullable<number> }, 'beløp'> = {
    id: 'beløp',
    tittel: 'Beløp',
    sortKey: 'beløp',
    align: 'right',
    celle: (rad) => <BenkTabellCelle.Beløp beløp={rad.beløp} />,
};

/**
 * Den høyre kolonnen med lenker og meny. Handlingene vises bare på rader med tilgang,
 * så `celle` får raden med de usladdede feltene.
 */
const handlinger = <Rad extends BenkBehandling>(
    celle: (rad: Rad & BenkBehandlingMedTilgang) => ReactNode,
    tittel: BenkKolonne<Rad, never>['tittel'] = null,
): BenkKolonne<Rad, never> => ({
    id: 'handlinger',
    tittel,
    align: 'right',
    celle: (rad) => (benkBehandlingHarTilgang(rad) ? celle(rad) : null),
});

/** Handlingene for søknadsbehandlinger og revurderinger, med «Tildel flere» i overskriften */
const rammebehandlingHandlinger = (tab: BenkTabsMedBatchTildeling) =>
    handlinger<BenkSøknadsbehandling | BenkRevurdering>(
        (rad) => <BenkTabellCelle.RammebehandlingHandlinger behandling={rad} />,
        (rader) => <BenkTildelFlere behandlinger={rader} tab={tab} />,
    );

export const benkKolonner = {
    fnr,
    resultat,
    status,
    ventestatus,
    kravtidspunkt,
    startet,
    sistEndret,
    saksbehandler,
    beslutter,
    beløp,
    handlinger,
    rammebehandlingHandlinger,
};
