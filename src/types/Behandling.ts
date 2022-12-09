import Søknad, {
    Barnetillegg,
    Institusjonsopphold,
    Lønnsinntekt,
    Pensjonsordninger,
    RegistrertTiltak,
    TiltakspengerYtelser,
} from './Søknad';
import StatligeYtelser from './StatligeYtelser';
import KommunaleYtelser from './KommunaleYtelser';

export class Behandling {
    søknad: Søknad;
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
    barnetillegg: Barnetillegg[];

    constructor(behandlingData: any) {
        this.søknad = behandlingData.søknad;
        this.registrerteTiltak = behandlingData.registrerteTiltak;
        this.vurderingsperiode = behandlingData.vurderingsperiode;
        this.tiltakspengerYtelser = behandlingData.tiltakspengerYtelser;
        this.statligeYtelser = new StatligeYtelser(behandlingData.statligeYtelser);
        this.kommunaleYtelser = new KommunaleYtelser(behandlingData.kommunaleYtelser);
        this.pensjonsordninger = behandlingData.pensjonsordninger;
        this.lønnsinntekt = behandlingData.lønnsinntekt;
        this.institusjonsopphold = behandlingData.institusjonsopphold;
        this.barnetillegg = behandlingData.barnetillegg;
    }
}

export default Behandling;
