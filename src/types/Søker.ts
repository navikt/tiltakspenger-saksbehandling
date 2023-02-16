import Personalia from './Personalia';
import { Behandling, IkkeKlarBehandling } from './Behandling';

export interface SøkerIdent {
    ident: string;
}

export interface SøkerResponse {
    id: string;
}

class Søker {
    ident: string;
    personopplysninger: Personalia;
    behandlinger: Behandling[];

    constructor(søkerData: any) {
        this.ident = søkerData.ident;
        this.personopplysninger = søkerData.personopplysninger;
        this.behandlinger = søkerData.behandlinger.map((behandlingData: any) => {
            if (behandlingData.klarForBehandling) {
                return new Behandling(behandlingData);
            } else {
                return new IkkeKlarBehandling(behandlingData);
            }
        });
    }
}

export default Søker;
