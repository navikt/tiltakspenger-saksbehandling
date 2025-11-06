import React from 'react';
import { Heading, HStack, Tag } from '@navikt/ds-react';
import { finn16årsdag, formaterDatotekst } from '~/utils/date';
import { Personopplysninger } from '~/components/personaliaheader/useHentPersonopplysninger';
import { getNavnMedFødselsdato } from '~/components/papirsøknad/barnetillegg/barnetilleggUtils';
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
            <HStack gap="2">
                <Heading size="small" level="4">
                    {getNavnMedFødselsdato(barn, barn.fortrolig || barn.strengtFortrolig)}
                </Heading>
                {barn.strengtFortrolig && <Tag variant="error">Strengt fortrolig adresse</Tag>}
                {barn.fortrolig && <Tag variant="error">Fortrolig adresse</Tag>}
                {barn.skjerming && <Tag variant="error">Skjermet</Tag>}
                {barn.dødsdato && (
                    <Tag variant="warning">Død {formaterDatotekst(barn.dødsdato)}</Tag>
                )}
                {bleFødtITiltaksperioden && <Tag variant="warning">Født i søknadsperioden</Tag>}
                {fyller16ITiltaksperioden && (
                    <Tag variant="warning">Fyller 16 år i søknadsperioden</Tag>
                )}
            </HStack>
        </>
    );
};
