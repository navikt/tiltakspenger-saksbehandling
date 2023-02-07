import Søknad, { Barnetillegg, RegistrertTiltak } from './Søknad';
import StatligeYtelser from './StatligeYtelser';
import KommunaleYtelser from './KommunaleYtelser';
import Pensjonsordninger from './Pensjonsordninger';
import Lønnsinntekt from './Lønnsinntekt';
import Institusjonsopphold from './Institusjonsopphold';
import TiltakspengerYtelser from './TiltakspengerYtelser';
import AlderVilkårsvurdering from './AlderVilkårsvurdering';

export type Behandlinger = Behandling[] | KlarBehandling[];

export class Behandling {
    søknad: Søknad;
    klarForBehandling: boolean;

    constructor(behandlingData: any) {
        this.søknad = behandlingData.søknad;
        this.klarForBehandling = behandlingData.klarForBehandling;
    }
}

export class KlarBehandling extends Behandling {
    registrerteTiltak: RegistrertTiltak[];
    vurderingsperiode: {
        fra: string;
        til: string;
    };
    tiltakspengerYtelser: TiltakspengerYtelser;
    statligeYtelser: StatligeYtelser;
    kommunaleYtelser: KommunaleYtelser;
    pensjonsordninger: Pensjonsordninger;
    lønnsinntekt: Lønnsinntekt;
    institusjonsopphold: Institusjonsopphold;
    alderVilkårsvurdering: AlderVilkårsvurdering;
    barnetillegg: Barnetillegg[];

    constructor(klarBehandlingData: any) {
        super(klarBehandlingData);
        this.registrerteTiltak = klarBehandlingData.registrerteTiltak;
        this.vurderingsperiode = klarBehandlingData.vurderingsperiode;
        this.tiltakspengerYtelser = new TiltakspengerYtelser(klarBehandlingData.tiltakspengerYtelser);
        this.statligeYtelser = new StatligeYtelser(klarBehandlingData.statligeYtelser);
        this.kommunaleYtelser = new KommunaleYtelser(klarBehandlingData.kommunaleYtelser);
        this.pensjonsordninger = new Pensjonsordninger(klarBehandlingData.pensjonsordninger);
        this.lønnsinntekt = new Lønnsinntekt(klarBehandlingData.lønnsinntekt);
        this.institusjonsopphold = new Institusjonsopphold(klarBehandlingData.institusjonsopphold);
        this.alderVilkårsvurdering = new AlderVilkårsvurdering(klarBehandlingData.alderVilkårsvurdering);
        this.barnetillegg = klarBehandlingData.barnetillegg;
    }
}
