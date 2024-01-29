import Personalia from './Personalia';

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

  constructor(søkerData: any) {
    this.søkerId = søkerData.søkerId;
    this.ident = søkerData.ident;
    this.personopplysninger = søkerData.personopplysninger;
  }
}

export default Søker;
