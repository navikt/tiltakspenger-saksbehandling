import { formaterDatotekst } from '~/utils/date';
import { Nullable } from '~/types/UtilTypes';

type BarnMedNavn = {
    fornavn?: Nullable<string>;
    etternavn?: Nullable<string>;
    fødselsdato: string;
};

export const getNavnMedFødselsdato = (barn: BarnMedNavn, adressebeskyttet: boolean) => {
    if (!adressebeskyttet) {
        return `${barn.fornavn} ${barn.etternavn} - født ${formaterDatotekst(barn.fødselsdato)}`;
    } else {
        return `Barn med adressebeskyttelse - født ${formaterDatotekst(barn.fødselsdato)}`;
    }
};
