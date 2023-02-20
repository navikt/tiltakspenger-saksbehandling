import Personalia from './Personalia';
import { Behandling, IkkeKlarBehandling } from './Behandling';

export interface SøkerIdent {
    ident: string;
}

export interface SøkerResponse {
    id: string;
}

class Søker {
    søkerId: string;
    ident: string;
    personopplysninger: Personalia;
    behandlinger: Behandling[];

    constructor(søkerData: any) {
        this.søkerId = søkerData.søkerId;
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
