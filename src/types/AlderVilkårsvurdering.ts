import { Utfall } from './Utfall';
import { Periode, ÅpenPeriode } from './Periode';
import { Vilkårsvurdering } from './Søknad';

class AlderVilkårsvurdering {
    samletUtfall: Utfall;
    perioder: Vilkårsvurdering[];

    constructor(alderVilkårsvurdering: any) {
        this.samletUtfall = alderVilkårsvurdering.samletUtfall;
        this.perioder = alderVilkårsvurdering.perioder;
    }

    harFlereVilkårsvurderinger() {
        return this.perioder.length > 1;
    }

    finnPeriodeHvorBrukerIkkeHarFylt18År(): Periode | ÅpenPeriode | null {
        const ikkeOppfyltVurdering = this.perioder.find(({ utfall }) => {
            return utfall === Utfall.IkkeOppfylt;
        });
        if (ikkeOppfyltVurdering) {
            return ikkeOppfyltVurdering.periode;
        }
        return null;
    }
}

export default AlderVilkårsvurdering;
