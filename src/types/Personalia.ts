class Personalia {
    ident: string;
    fornavn: string;
    etternavn: string;
    fødselsdato: string;
    fortrolig: boolean;
    strengtFortrolig: boolean;
    skjermet: boolean;
    barn: Personalia[];

    constructor(personalia: any) {
        this.ident = personalia.ident;
        this.fornavn = personalia.fornavn;
        this.etternavn = personalia.etternavn;
        this.fortrolig = personalia.fortrolig;
        this.strengtFortrolig = personalia.strengtFortrolig;
        this.skjermet = personalia.skjermet;
        this.barn = personalia.barn;
    }

    finnBarnMedFortroligAdresse(): Personalia[] {
        return this.barn.filter((barn) => barn.fortrolig);
    }

    finnBarnMedStrengtFortroligAdresse(): Personalia[] {
        return this.barn.filter((barn) => barn.strengtFortrolig);
    }
}

export default Personalia;
