import { Lovreferanse } from './Behandling';
import { SamletUtfall } from './Kvp';
import { NyPeriode } from './Periode';
import { Saksbehandler } from './Saksbehandler';

export interface LivsoppholdVilkår {
    avklartSaksopplysning: LivsoppholdSaksopplysning;
    vurderingsPeriode: NyPeriode;
    vilkårLovreferanse: Lovreferanse;
    samletUtfall: SamletUtfall;
}

interface LivsoppholdSaksopplysning {
    harLivsoppholdYtelser: Boolean;
    vurderingsPeriode: NyPeriode;
    saksbehandler?: Saksbehandler;
    årsakTilEndring?: ÅrsakTilEndring;
    tidspunkt: string;
}

enum ÅrsakTilEndring {
    FEIL_I_INNHENTET_DATA = 'FEIL_I_INNHENTET_DATA',
    ENDRING_ETTER_SØKNADSTIDSPUNKT = 'ENDRING_ETTER_SØKNADSTIDSPUNKT',
}
