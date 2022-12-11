import { Utfall } from './Utfall';
import { Vilkårsvurdering } from './Søknad';
import { ÅpenPeriode } from './Periode';

class TiltakspengerYtelser {
    samletUtfall: Utfall;
    perioder: Vilkårsvurdering[];

    constructor(tiltakspengerYtelser: any) {
        this.samletUtfall = tiltakspengerYtelser.samletUtfall;
        this.perioder = tiltakspengerYtelser.perioder;
    }

    finnPerioderTilManuellVurdering(): ÅpenPeriode[] {
        const defaultArray: ÅpenPeriode[] = [];
        const allePerioder = this.perioder.slice();
        return allePerioder.reduce((perioder, { utfall, periode }) => {
            if (Utfall.KreverManuellVurdering === utfall) {
                perioder.push(periode);
                return perioder;
            }
            return perioder;
        }, defaultArray);
    }
}

export default TiltakspengerYtelser;
