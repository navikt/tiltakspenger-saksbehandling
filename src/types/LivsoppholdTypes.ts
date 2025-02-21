import { Periode } from './Periode';

export interface LivsoppholdSaksopplysningBody {
    ytelseForPeriode: {
        periode: Periode;
        harYtelse: boolean;
    };
}
