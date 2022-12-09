import { Utfall } from './Utfall';
import { Vilkårsvurdering } from './Søknad';

class KommunaleYtelser {
    samletUtfall: Utfall;
    kvp: Vilkårsvurdering[];
    introProgrammet: Vilkårsvurdering[];

    constructor(kommunaleYtelser: any) {
        this.samletUtfall = kommunaleYtelser.samletUtfall;
        this.kvp = kommunaleYtelser.kvp;
        this.introProgrammet = kommunaleYtelser.introProgrammet;
    }
}

export default KommunaleYtelser;
