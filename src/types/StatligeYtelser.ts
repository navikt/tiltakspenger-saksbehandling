import { Utfall } from './Utfall';
import { Vilkårsvurdering } from './Søknad';
import { ÅpenPeriode } from './Periode';

class StatligeYtelser {
    samletUtfall: Utfall;
    aap: Vilkårsvurdering[];
    dagpenger: Vilkårsvurdering[];
    uføre: Vilkårsvurdering[];
    foreldrepenger: Vilkårsvurdering[];
    pleiepengerNærstående: Vilkårsvurdering[];
    pleiepengerSyktBarn: Vilkårsvurdering[];
    svangerskapspenger: Vilkårsvurdering[];
    opplæringspenger: Vilkårsvurdering[];
    omsorgspenger: Vilkårsvurdering[];

    constructor(statligeYtelser: any) {
        this.samletUtfall = statligeYtelser.samletUtfall;
        this.aap = statligeYtelser.aap;
        this.dagpenger = statligeYtelser.dagpenger;
        this.uføre = statligeYtelser.uføre;
        this.foreldrepenger = statligeYtelser.foreldrepenger;
        this.pleiepengerNærstående = statligeYtelser.pleiepengerNærstående;
        this.pleiepengerSyktBarn = statligeYtelser.pleiepengerSyktBarn;
        this.svangerskapspenger = statligeYtelser.svangerskapspenger;
        this.opplæringspenger = statligeYtelser.opplæringspenger;
        this.omsorgspenger = statligeYtelser.omsorgspenger;
    }

    finnPerioderTilManuellVurdering(vilkårsvurderinger: Vilkårsvurdering[]): ÅpenPeriode[] {
        const defaultArray: ÅpenPeriode[] = [];
        return vilkårsvurderinger.reduce((perioder, { utfall, periode }) => {
            if (Utfall.KreverManuellVurdering === utfall) {
                perioder.push(periode);
                return perioder;
            }
            return perioder;
        }, defaultArray);
    }

    finnDagpengeperioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.dagpenger);
    }

    finnAapPerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.aap);
    }

    finnUførePerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.uføre);
    }

    finnForeldrepengePerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.foreldrepenger);
    }

    finnPleiepengerNærståendePerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.pleiepengerNærstående);
    }

    finnPleiepengerSyktBarnPerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.pleiepengerSyktBarn);
    }

    finnSvangerskapspengerPerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.svangerskapspenger);
    }

    finnOpplæringspengerPerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.opplæringspenger);
    }

    finnOmsorgspengerPerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.omsorgspenger);
    }
}

export default StatligeYtelser;
