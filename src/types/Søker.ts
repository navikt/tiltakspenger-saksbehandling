import Personalia from './Personalia';
import Behandling from './Behandling';

class Søker {
    ident: string;
    personopplysninger: Personalia;
    behandlinger: Behandling[];

    constructor(søkerData: any) {
        this.ident = søkerData.ident;
        this.personopplysninger = søkerData.personopplysninger;
        this.behandlinger = søkerData.behandlinger.map((behandlingData: any) => new Behandling(behandlingData));
    }
}

export default Søker;
