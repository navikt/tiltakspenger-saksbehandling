import { Utfall } from './Utfall';
import { Vilkårsvurdering } from './Søknad';
import { ÅpenPeriode } from './Periode';

class KommunaleYtelser {
    samletUtfall: Utfall;
    kvp: Vilkårsvurdering[];
    introProgrammet: Vilkårsvurdering[];

    constructor(kommunaleYtelser: any) {
        this.samletUtfall = kommunaleYtelser.samletUtfall;
        this.kvp = kommunaleYtelser.kvp;
        this.introProgrammet = kommunaleYtelser.introProgrammet;
    }

    finnPerioderFraSøknaden(vilkårsvurderinger: Vilkårsvurdering[]): ÅpenPeriode[] {
        const defaultArray: ÅpenPeriode[] = [];
        return vilkårsvurderinger.reduce((perioder, { utfall, periode, kilde }) => {
            if (Utfall.KreverManuellVurdering === utfall && kilde?.toLowerCase() === 'søknad') {
                perioder.push(periode);
                return perioder;
            }
            return perioder;
        }, defaultArray);
    }

    finnKvpPerioderFraSøknaden(): ÅpenPeriode[] {
        return this.finnPerioderFraSøknaden(this.kvp);
    }

    finnIntroprogramPerioderFraSøknaden(): ÅpenPeriode[] {
        return this.finnPerioderFraSøknaden(this.introProgrammet);
    }
}

export default KommunaleYtelser;
