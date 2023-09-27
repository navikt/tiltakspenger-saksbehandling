import { Behandling, IkkeKlarBehandling } from './Behandling';
import Søknad from "./Søknad";

interface Vilkår {
    lovreferanse : string;
    tittel : string;
}

interface Saksopplysning {
    fom: string;
    tom: string;
    vilkår: Vilkår;
    kilde: string;
    detaljer: string;
    typeSaksopplysning: string;
}

interface Vurdering {
    fom: string;
    tom: string;
    vilkår: Vilkår;
    kilde: string;
    detaljer: string;
    utfall: string;
}

export interface NyBehandling {
    behandlingId: string;
    fom: string;
    tom: string;
    søknad: any;
    saksopplysninger: Saksopplysning[];
    vurderinger: Vurdering[];

    //
    //
    // constructor(søkerData: any) {
    //     this.søkerId = søkerData.søkerId;
    //     this.ident = søkerData.ident;
    //     this.personopplysninger = søkerData.personopplysninger;
    //     this.behandlinger = søkerData.behandlinger.map((behandlingData: any) => {
    //         if (behandlingData.klarForBehandling) {
    //             return new Behandling(behandlingData);
    //         } else {
    //             return new IkkeKlarBehandling(behandlingData);
    //         }
    //     });
    // }
}
