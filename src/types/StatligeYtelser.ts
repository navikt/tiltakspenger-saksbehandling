import { Utfall } from './Utfall';
import { Vilkårsvurdering } from './Søknad';
import { ÅpenPeriode } from './Periode';

class StatligeYtelser {
    samletUtfall: Utfall;
    aap: Vilkårsvurdering[];
    dagpenger: Vilkårsvurdering[];

    constructor(statligeYtelser: any) {
        this.samletUtfall = statligeYtelser.samletUtfall;
        this.aap = statligeYtelser.aap;
        this.dagpenger = statligeYtelser.dagpenger;
    }

    finnPerioderTilManuellVurdering(vilkårsvurderinger: Vilkårsvurdering[]): ÅpenPeriode[] {
        const defaultArray: ÅpenPeriode[] = [];
        return vilkårsvurderinger.reduce((perioderMedDagpenger, { utfall, periode }) => {
            if (Utfall.KreverManuellVurdering === utfall) {
                perioderMedDagpenger.push(periode);
                return perioderMedDagpenger;
            }
            return perioderMedDagpenger;
        }, defaultArray);
    }

    finnDagpengeperioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.dagpenger);
    }

    finnAapPerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.aap);
    }
}

export default StatligeYtelser;
