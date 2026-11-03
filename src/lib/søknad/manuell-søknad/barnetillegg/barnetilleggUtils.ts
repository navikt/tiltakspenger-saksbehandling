import { formaterDatotekst } from '~/utils/date';
import { Nullable } from '~/types/UtilTypes';
import { Dato } from '~/types/DatoTid';

type BarnMedNavn = {
    fornavn?: Nullable<string>;
    etternavn?: Nullable<string>;
    fødselsdato: Nullable<Dato>;
};

export const getNavnMedFødselsdato = (barn: BarnMedNavn, adressebeskyttet: boolean) => {
    const fødselsdatoTekst = barn.fødselsdato ? formaterDatotekst(barn.fødselsdato) : 'ukjent';

    if (!adressebeskyttet) {
        return `${barn.fornavn} ${barn.etternavn} - født ${fødselsdatoTekst}`;
    } else {
        return `Barn med adressebeskyttelse - født ${fødselsdatoTekst}`;
    }
};
