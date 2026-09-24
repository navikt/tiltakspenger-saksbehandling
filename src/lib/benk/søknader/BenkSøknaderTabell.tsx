import { BenkSøknaderKolonne, BenkSøknadsbehandling } from '../typer/søknader';
import { BenkTab } from '../typer/tabs';
import { søknadstypeTekst } from '~/lib/søknad/søknadTekster';
import { BenkFaneTabellProps, BenkTabell } from '../felles/tabell/BenkTabell';
import { BenkKolonne } from '../felles/tabell/BenkKolonne';
import { benkKolonner } from '../felles/tabell/benkKolonner';

const kolonner: BenkKolonne<BenkSøknadsbehandling, BenkSøknaderKolonne>[] = [
    benkKolonner.fnr,
    benkKolonner.resultat,
    benkKolonner.status,
    {
        id: 'søknadstype',
        tittel: 'Søknadstype',
        sortKey: BenkSøknaderKolonne.søknadstype,
        celle: (behandling) => søknadstypeTekst[behandling.søknadstype],
    },
    benkKolonner.ventestatus,
    benkKolonner.kravtidspunkt,
    benkKolonner.sistEndret,
    benkKolonner.saksbehandler,
    benkKolonner.beslutter,
    benkKolonner.rammebehandlingHandlinger,
];

export const BenkSøknaderTabell = (props: BenkFaneTabellProps<BenkTab.SØKNADER>) => (
    <BenkTabell kolonner={kolonner} {...props} />
);
