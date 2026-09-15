import { Heading, HStack, Tag } from '@navikt/ds-react';
import { finn16årsdag, formaterSladdbarDatotekst } from '~/utils/date';
import { hentVerdi, sladdbarTekst, sladdbarTekstEllerNull } from '~/types/SladdetVerdi';
import { Personopplysninger } from '~/lib/personaliaheader/useHentPersonopplysninger';
import { getNavnMedFødselsdato } from '~/lib/søknad/manuell-søknad/barnetillegg/barnetilleggUtils';
import { erDatoIPeriode } from '~/utils/periode';
import { Periode } from '~/types/Periode';

type Props = {
    barn: Personopplysninger;
    søknadsperiode: Periode | undefined;
};

export const InformasjonOmBarnPDL = ({ barn, søknadsperiode }: Props) => {
    const fødselsdato = hentVerdi(barn.fødselsdato);
    const bleFødtITiltaksperioden =
        fødselsdato && søknadsperiode ? erDatoIPeriode(fødselsdato, søknadsperiode) : false;
    const fyller16ITiltaksperioden =
        fødselsdato && søknadsperiode
            ? erDatoIPeriode(finn16årsdag(fødselsdato), søknadsperiode)
            : false;
    return (
        <>
            <HStack gap="space-8">
                <Heading size="small" level="4">
                    {getNavnMedFødselsdato(
                        {
                            fornavn: sladdbarTekstEllerNull(barn.fornavn),
                            etternavn: sladdbarTekstEllerNull(barn.etternavn),
                            fødselsdato: sladdbarTekst(barn.fødselsdato),
                        },
                        barn.fortrolig || barn.strengtFortrolig || barn.strengtFortroligUtland,
                    )}
                </Heading>
                {(barn.strengtFortrolig || barn.strengtFortroligUtland) && (
                    <Tag data-color="danger" variant="outline">
                        Strengt fortrolig adresse
                    </Tag>
                )}
                {barn.fortrolig && (
                    <Tag data-color="danger" variant="outline">
                        Fortrolig adresse
                    </Tag>
                )}
                {barn.skjermet && (
                    <Tag data-color="danger" variant="outline">
                        Skjermet
                    </Tag>
                )}
                {sladdbarTekstEllerNull(barn.dødsdato) && (
                    <Tag data-color="warning" variant="outline">
                        Død {formaterSladdbarDatotekst(barn.dødsdato)}
                    </Tag>
                )}
                {bleFødtITiltaksperioden && (
                    <Tag data-color="warning" variant="outline">
                        Født i søknadsperioden
                    </Tag>
                )}
                {fyller16ITiltaksperioden && (
                    <Tag data-color="warning" variant="outline">
                        Fyller 16 år i søknadsperioden
                    </Tag>
                )}
            </HStack>
        </>
    );
};
