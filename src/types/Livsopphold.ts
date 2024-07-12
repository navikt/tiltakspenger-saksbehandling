import { Lovreferanse } from './Behandling';
import { SamletUtfall } from './Kvp';
import { NyPeriode } from './Periode';

export interface LivsoppholdVilkår {
    avklartSaksopplysning: LivsoppholdSaksopplysning;
    vurderingsperiode: NyPeriode;
    vilkårLovreferanse: Lovreferanse;
    samletUtfall: SamletUtfall;
}

interface LivsoppholdSaksopplysning {
    periodeMedDeltagelse: PeriodeMedDeltagelse;
    årsakTilEndring?: ÅrsakTilEndring;
}

enum ÅrsakTilEndring {
    FEIL_I_INNHENTET_DATA = 'FEIL_I_INNHENTET_DATA',
    ENDRING_ETTER_SØKNADSTIDSPUNKT = 'ENDRING_ETTER_SØKNADSTIDSPUNKT',
}

interface PeriodeMedDeltagelse {
    periode: NyPeriode;
    deltagelse: Deltagelse;
}

enum Deltagelse {
    DELTAR = 'DELTAR',
    DELTAR_IKKE = 'DELTAR_IKKE',
}
