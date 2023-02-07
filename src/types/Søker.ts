import Personalia from './Personalia';
import { Behandling, Behandlinger, KlarBehandling } from './Behandling';

class Søker {
    ident: string;
    personopplysninger: Personalia;
    behandlinger: Behandlinger;

    constructor(søkerData: any) {
        this.ident = søkerData.ident;
        this.personopplysninger = søkerData.personopplysninger;
        this.behandlinger = søkerData.behandlinger.map((behandlingData: any) => {
            if (behandlingData.klarForBehandling) {
                return new KlarBehandling(behandlingData);
            } else {
                return new Behandling(behandlingData);
            }
        });
    }
}

export default Søker;
