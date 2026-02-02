import React from 'react';
import { Heading, HStack, Tag } from '@navikt/ds-react';
import { finn16årsdag, formaterDatotekst } from '~/utils/date';
import { Personopplysninger } from '~/components/personaliaheader/useHentPersonopplysninger';
import { getNavnMedFødselsdato } from '~/components/manuell-søknad/barnetillegg/barnetilleggUtils';
import { erDatoIPeriode } from '~/utils/periode';
import { Periode } from '~/types/Periode';

type Props = {
    barn: Personopplysninger;
    søknadsperiode: Periode | undefined;
};

export const InformasjonOmBarnPDL = ({ barn, søknadsperiode }: Props) => {
    const bleFødtITiltaksperioden = søknadsperiode
        ? erDatoIPeriode(barn.fødselsdato, søknadsperiode)
        : false;
    const fyller16ITiltaksperioden = søknadsperiode
        ? erDatoIPeriode(finn16årsdag(barn.fødselsdato), søknadsperiode)
        : false;
    return (
        <>
            <HStack gap="space-8">
                <Heading size="small" level="4">
                    {getNavnMedFødselsdato(barn, barn.fortrolig || barn.strengtFortrolig)}
                </Heading>
                {barn.strengtFortrolig && (
                    <Tag data-color="danger" variant="outline">
                        Strengt fortrolig adresse
                    </Tag>
                )}
                {barn.fortrolig && (
                    <Tag data-color="danger" variant="outline">
                        Fortrolig adresse
                    </Tag>
                )}
                {barn.skjerming && (
                    <Tag data-color="danger" variant="outline">
                        Skjermet
                    </Tag>
                )}
                {barn.dødsdato && (
                    <Tag data-color="warning" variant="outline">
                        Død {formaterDatotekst(barn.dødsdato)}
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
