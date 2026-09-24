import { BenkRevurderingerKolonne, BenkRevurdering } from '../typer/revurderinger';
import { BenkTab } from '../typer/tabs';
import { BenkFaneTabellProps, BenkTabell } from '../felles/tabell/BenkTabell';
import { BenkKolonne } from '../felles/tabell/BenkKolonne';
import { benkKolonner } from '../felles/tabell/benkKolonner';

const kolonner: BenkKolonne<BenkRevurdering, BenkRevurderingerKolonne>[] = [
    benkKolonner.fnr,
    benkKolonner.resultat,
    benkKolonner.status,
    benkKolonner.ventestatus,
    benkKolonner.startet,
    benkKolonner.sistEndret,
    benkKolonner.saksbehandler,
    benkKolonner.beslutter,
    benkKolonner.rammebehandlingHandlinger,
];

export const BenkRevurderingerTabell = (props: BenkFaneTabellProps<BenkTab.REVURDERINGER>) => (
    <BenkTabell kolonner={kolonner} {...props} />
);
