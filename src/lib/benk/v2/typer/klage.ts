import { Nullable } from '~/types/UtilTypes';
import { KlagebehandlingResultat } from '~/lib/klage/typer/Klage';
import { BenkV2BehandlingBase, BenkV2Behandlingsstatus, BenkV2Request } from './felles';

export type BenkKlagebehandling = BenkV2BehandlingBase & {
    status: BenkV2Behandlingsstatus;
    kravtidspunkt: string;
    resultat: Nullable<KlagebehandlingResultat>;
};

export enum BenkKlageKolonne {
    fnr = 'fnr',
    resultat = 'resultat',
    status = 'status',
    kravtidspunkt = 'kravtidspunkt',
    sistEndret = 'sist_endret',
    saksbehandler = 'saksbehandler',
    beslutter = 'beslutter',
}

export type BenkKlageFilter = {
    status: Nullable<BenkV2Behandlingsstatus>;
    resultat: Nullable<KlagebehandlingResultat>;
    saksbehandler: Nullable<string | 'IKKE_TILDELT'>;
};

export type BenkKlageRequest = BenkV2Request<BenkKlageFilter, BenkKlageKolonne>;
