import React from 'react';
import { Heading, HStack, Tag, VStack } from '@navikt/ds-react';
import { getNavnMedFødselsdato } from '~/components/manuell-søknad/barnetillegg/barnetilleggUtils';
import { Barn } from '~/components/manuell-søknad/ManueltRegistrertSøknad';
import { formaterSøknadsspørsmålSvar } from '~/utils/tekstformateringUtils';
import { Periode } from '~/types/Periode';
import { erDatoIPeriode } from '~/utils/periode';
import { finn16årsdag } from '~/utils/date';

type Props = {
    barn: Barn;
    søknadsperiode: Periode | undefined;
};

export const InformasjonOmBarnManuell = ({ barn, søknadsperiode }: Props) => {
    const bleFødtITiltaksperioden = søknadsperiode
        ? erDatoIPeriode(barn.fødselsdato, søknadsperiode)
        : false;
    const fyller16ITiltaksperioden = søknadsperiode
        ? erDatoIPeriode(finn16årsdag(barn.fødselsdato), søknadsperiode)
        : false;
    return (
        <VStack gap="2">
            <HStack gap="4">
                <Heading size="small" level="4">
                    {getNavnMedFødselsdato(barn, false)}
                </Heading>
                {bleFødtITiltaksperioden && <Tag variant="warning">Født i søknadsperioden</Tag>}
                {fyller16ITiltaksperioden && (
                    <Tag variant="warning">Fyller 16 år i søknadsperioden</Tag>
                )}
            </HStack>
            <div>
                Oppholder seg i EØS-land i tiltaksperioden:{' '}
                {formaterSøknadsspørsmålSvar(barn.oppholdInnenforEøs?.svar)}
                <br />
                Antall vedlegg (dokumentasjon) for barnet:{' '}
                {barn.manueltRegistrertBarnAntallVedlegg ?? 0}
            </div>
        </VStack>
    );
};
