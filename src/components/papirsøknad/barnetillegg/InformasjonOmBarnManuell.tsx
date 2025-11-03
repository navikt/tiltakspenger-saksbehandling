import React from 'react';
import { Heading, VStack } from '@navikt/ds-react';
import { getNavnMedFødselsdato } from '~/components/papirsøknad/barnetillegg/barnetilleggUtils';
import { Barn } from '~/components/papirsøknad/papirsøknadTypes';
import { formaterSøknadsspørsmålSvar } from '~/utils/tekstformateringUtils';

type Props = {
    barn: Barn;
};

export const InformasjonOmBarnManuell = ({ barn }: Props) => {
    return (
        <VStack>
            <Heading size="small" level="4">
                {getNavnMedFødselsdato(barn, false)}
            </Heading>
            <div>
                Oppholder seg i EØS-land i tiltaksperioden:{' '}
                {formaterSøknadsspørsmålSvar(barn.oppholdInnenforEøs?.svar)}
                <br />
                Det er vedlagt dokumentasjon for barnet:{' '}
                {formaterSøknadsspørsmålSvar(barn.manueltRegistrertBarnHarVedlegg?.svar)}
            </div>
        </VStack>
    );
};
