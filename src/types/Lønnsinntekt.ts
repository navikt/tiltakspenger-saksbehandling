import { Utfall } from './Utfall';
import { Vilkårsvurdering } from './Søknad';
import { ÅpenPeriode } from './Periode';

class Lønnsinntekt {
    samletUtfall: Utfall;
    perioder: Vilkårsvurdering[];

    constructor(lønnsinntekt: any) {
        this.samletUtfall = lønnsinntekt.samletUtfall;
        this.perioder = lønnsinntekt.perioder;
    }

    finnLønnsinntektOppgittISøknaden(): ÅpenPeriode[] {
        const defaultArray: ÅpenPeriode[] = [];
        const allePerioder = this.perioder.slice();
        return allePerioder.reduce((perioder, { utfall, periode, kilde }) => {
            if (Utfall.KreverManuellVurdering === utfall && kilde?.toLowerCase() === 'søknad') {
                perioder.push(periode);
                return perioder;
            }
            return perioder;
        }, defaultArray);
    }
}

export default Lønnsinntekt;
