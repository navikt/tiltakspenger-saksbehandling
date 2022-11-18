import Personalia from './Personalia';
import Søknad, { Behandling } from './Søknad';

interface Søker {
    ident: string;
    personopplysninger: Personalia;
    behandlinger: Behandling[];
}

export default Søker;
