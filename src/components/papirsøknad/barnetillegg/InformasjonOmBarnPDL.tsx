import React from 'react';
import { Heading, HStack, Tag } from '@navikt/ds-react';
import { formaterDatotekst } from '~/utils/date';
import { Personopplysninger } from '~/components/personaliaheader/useHentPersonopplysninger';
import { getNavnMedFødselsdato } from '~/components/papirsøknad/barnetillegg/barnetilleggUtils';

type Props = {
    barn: Personopplysninger;
};

export const InformasjonOmBarnPDL = ({ barn }: Props) => {
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
                    <Tag variant="neutral">Død {formaterDatotekst(barn.dødsdato)}</Tag>
                )}
            </HStack>
        </>
    );
};
