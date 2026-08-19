import { ManuellSøknadBarn } from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import { Personopplysninger } from '~/lib/personaliaheader/useHentPersonopplysninger';
import { formaterDatotekst } from '~/utils/date';

export const getNavnMedFødselsdato = (
    barn: ManuellSøknadBarn | Personopplysninger,
    adressebeskyttet: boolean,
) => {
    if (!adressebeskyttet) {
        return `${barn.fornavn} ${barn.etternavn} - født ${formaterDatotekst(barn.fødselsdato)}`;
    } else {
        return `Barn med adressebeskyttelse - født ${formaterDatotekst(barn.fødselsdato)}`;
    }
};
