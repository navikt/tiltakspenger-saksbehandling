import { Barn } from '~/components/papirsøknad/papirsøknadTypes';
import { Personopplysninger } from '~/components/personaliaheader/useHentPersonopplysninger';
import { formaterDatotekst } from '~/utils/date';

export const getNavnMedFødselsdato = (
    barn: Barn | Personopplysninger,
    adressebeskyttet: boolean,
) => {
    if (!adressebeskyttet) {
        return `${barn.fornavn} ${barn.etternavn} - født ${formaterDatotekst(barn.fødselsdato)}`;
    } else {
        return `Barn med adressebeskyttelse - Født ${formaterDatotekst(barn.fødselsdato)}`;
    }
};
