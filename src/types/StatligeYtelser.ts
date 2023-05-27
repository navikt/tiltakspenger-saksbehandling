import {Utfall} from './Utfall';
import {Vilkårsvurdering} from './Søknad';
import {ÅpenPeriode} from './Periode';

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
    overgangsstønad: Vilkårsvurdering[];
    sykepenger: Vilkårsvurdering[];
    gjenlevendepensjon: Vilkårsvurdering[];
    alderspensjon: Vilkårsvurdering[];
    supplerendeStønadFlyktning: Vilkårsvurdering[];
    supplerendeStønadAlder: Vilkårsvurdering[];

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
        this.overgangsstønad = statligeYtelser.overgangsstønad;
        this.sykepenger = statligeYtelser.sykepenger;
        this.gjenlevendepensjon = statligeYtelser.gjenlevendepensjon;
        this.alderspensjon = statligeYtelser.alderspensjon;
        this.supplerendeStønadFlyktning = statligeYtelser.supplerendeStønadFlyktning;
        this.supplerendeStønadAlder = statligeYtelser.supplerendeStønadAlder;
    }

    finnPerioderTilManuellVurdering(vilkårsvurderinger: Vilkårsvurdering[]): ÅpenPeriode[] {
        const defaultArray: ÅpenPeriode[] = [];
        return vilkårsvurderinger.reduce((perioder, {utfall, periode}) => {
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

    finnOvergangsstønadPerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.overgangsstønad);
    }

    finnSykepengerPerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.sykepenger);
    }

    finnGjenlevendepensjonPerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.gjenlevendepensjon);
    }

    finnAlderspensjonPerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.alderspensjon);
    }

    finnSupplerendeStønadFlyktningPerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.supplerendeStønadFlyktning);
    }

    finnSupplerendeStønadAlderPerioder(): ÅpenPeriode[] {
        return this.finnPerioderTilManuellVurdering(this.supplerendeStønadAlder);
    }
}

export default StatligeYtelser;
